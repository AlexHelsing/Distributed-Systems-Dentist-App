import express from 'express';
import { Request, Response } from 'express';
import {
  Dentist,
  validateRegistration,
  validateUpdate,
} from '../../models/dentistModel';
import validateObjectId from '../../middlewares/validObjectId';
import authDentist from '../../middlewares/dentistAuth';
import asyncwrapper from '../../middlewares/asyncwrapper';
import bcrypt from 'bcrypt';
import { client, handleMqtt } from '../../mqttConnection';
import _ from 'lodash';
import { randomUUID } from 'crypto';
import { Clinic } from '../../models/clinicModel';
import pusher from '../../utils/pusher';
import axios from 'axios';

const router = express.Router();

// Dentist HTTP Handlers

// GET Requests
router.get(
  '/',
  asyncwrapper(async (req: Request, res: Response) => {
    let dentists = await Dentist.find().select('-password');

    res.status(200).send(dentists);
  })
);

router.get(
  '/:dentist_id',
  [validateObjectId, authDentist],
  asyncwrapper(async (req: Request, res: Response) => {
    let dentist = await Dentist.findById(req.params.dentist_id).select(
      '-password'
    );

    if (!dentist)
      return res
        .status(404)
        .json({ message: 'Dentist with given id was not found' });

    return res.status(200).json(dentist);
  })
);

router.get(
  '/:dentist_id/appointment_slots',
  [validateObjectId],
  asyncwrapper(async (req: Request, res: Response) => {
    let dentist = await Dentist.findById(req.params.dentist_id);
    if (!dentist)
      return res
        .status(404)
        .json({ message: 'Dentist with given id was not found' });

    if (!client.connected)
      return res.status(500).json({ message: 'Internal server error' });

    const responseTopic: string = randomUUID();
    let response = await handleMqtt(
      `Dentist/get_appointments/req`,
      `Dentist/${responseTopic}/get_appointments/res`,
      { dentistId: dentist._id, responseTopic: responseTopic }
    );
    // Expected response is an array of appointments [Last element in array is response status]

    return res.status(200).json(response);
  })
);

router.get(
  '/:dentist_id/appointment_slots/:appointment_id',
  [validateObjectId],
  asyncwrapper(async (req: Request, res: Response) => {
    let dentist = await Dentist.findById(req.params.dentist_id);
    if (!dentist)
      return res
        .status(404)
        .json({ message: 'Dentist with given id was not found.' });

    if (!client.connected)
      return res.status(500).json({ message: 'Internal server error' });

    const responseTopic: string = randomUUID();
    let response = await handleMqtt(
      `Dentist/get_appointments/req`,
      `Dentist/${responseTopic}/get_appointments/res`,
      { dentistId: dentist._id, responseTopic: responseTopic }
    );
    // Expected response is an array of appointments [Last element in array is response status]

    let appointment = response.find((appointment: any) => {
      if (appointment._id === req.params.appointment_id) return appointment;
    });

    if (appointment) return res.status(response.pop().status).json(appointment);
    return res
      .status(404)
      .json({ message: 'Appointment with given id was not found.' });
  })
);

// POST Requests
router.post(
  '/login',
  asyncwrapper(async (req: Request, res: Response) => {
    if (!req.body.password || !req.body.email) {
      return res.status(403).json({ message: 'Missing email or password' });
    }

    let dentist = await Dentist.findOne({ email: req.body.email });
    if (!dentist)
      return res
        .status(404)
        .json({ message: 'Dentist with given email was not found' });

    let match = await bcrypt.compare(
      req.body.password,
      dentist.password.toString()
    );
    if (match) {
      let token = await dentist.signJWT();
      return res.status(201).json({
        ..._.pick(dentist, [
          '_id',
          'phone_number',
          'firstname',
          'lastname',
          'email',
        ]),
        token: token,
      });
    }

    res.status(403).json({ message: 'incorrect password' });
  })
);

router.post(
  '/:dentist_id/appointment_slots',
  [validateObjectId, authDentist],
  asyncwrapper(async (req: Request, res: Response) => {
    let dentist = await Dentist.findById(req.params.dentist_id);
    if (!dentist)
      return res
        .status(404)
        .json({ message: 'Dentist with given id was not found.' });

    // find the clinic which the dentist belongs to, just include id
    let clinic = await Clinic.findOne({ dentists: dentist._id }).select('_id');
    console.log(clinic);
    if (!clinic)
      return res.status(404).json({ message: 'Dentist is not in a clinic' });

    if (!client.connected)
      return res.status(500).json({ message: 'Internal server error' });

    const responseTopic: string = randomUUID();
    let appointments = req.body.map((appointment: any) => ({
      ...appointment,
      dentistId: dentist?._id,
      clinicId: clinic?._id,
      patientId: null,
      booked: false,
    }));

    appointments.push({ responseTopic: responseTopic });

    let response = await handleMqtt(
      `Dentist/post_slots/req`,
      `Dentist/${responseTopic}/post_slots/res`,
      appointments
    );

    pusher.trigger('global-channel', 'appointment-event', {});

    return res.status(response.status).json({ message: response.message });
  })
);

// PUT
router.put(
  '/:dentist_id',
  [validateObjectId, authDentist],
  asyncwrapper(async (req: Request, res: Response) => {
    let { error } = validateUpdate(req.body);
    if (error)
      return res
        .status(403)
        .json('Invalid update format for dentist' + error.details[0].message);

    if (req.body.password) {
      let hashed = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashed;
    }

    let result = await Dentist.findByIdAndUpdate(
      req.params.dentist_id,
      req.body,
      { new: true }
    );
    if (!result)
      return res
        .status(404)
        .json({ message: 'Dentist with given id was not found' });

    res.status(200).json(result);
  })
);

// DELETE
router.delete(
  '/:dentist_id/appointment_slots/:appointment_id',
  [validateObjectId, authDentist],
  asyncwrapper(async (req: Request, res: Response) => {
    let dentist = await Dentist.findById(req.params.dentist_id);
    if (!dentist)
      return res
        .status(404)
        .json({ message: 'Dentist with given id was not found' });

    if (!client.connected)
      return res.status(500).json({ message: 'Internal server error' });

    const responseTopic: string = randomUUID();
    let response = await handleMqtt(
      `Dentist/cancel_appointment/req`,
      `Dentist/${responseTopic}/cancel_appointment/res`,
      {
        dentistId: dentist._id,
        appointmentId: req.params.appointment_id,
        responseTopic: responseTopic,
      }
    );

    if(response.status === 200) {
      let notification = {
        subject: "cancelling",
        date: response.date,
        startTime: response.startTime,
        endTime: response.endTime, 
        patientId: response.patientId
      }
      axios.post(`${process.env.PATIENT_SERVICE}/patients/notification`, notification)
      .then((res) => {
        console.log(res.status)
      })
      .catch((err) => {
        console.log(err.response.data)
      });
    }
    // Trigger pusher event to user-userId, id is response.message, FYI response.message is the appointment id right now, theres no other way to get the appointment id
    pusher.trigger(`user-${response.patientId}`, 'appointment-cancelled', {});

    // Expected response is an response object[With status field]
    return res.status(response.status).json(response);
  })
);

// Exporting the router object
export default router;
