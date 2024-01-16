import express from 'express';
import { Request, Response } from 'express';
import {
  Patient,
  validateRegistration,
  validateUpdate,
} from '../../models/patientsModel';
import validateObjectId from '../../middlewares/validObjectId';
import asyncwrapper from '../../middlewares/asyncwrapper';
import authPatient from '../../middlewares/authPatient';
import bcrypt from 'bcrypt';
import { client, handleMqtt } from '../../mqttConnection';
import _ from 'lodash';
import { randomUUID } from 'crypto';
import pusher from '../../utils/pusher';
import axios from 'axios';

const router = express.Router();

const clinicAPI: string = "http://localhost:4000/api/v1/clinics/";
const dentistAPI: string = "http://localhost:4000/api/v1/dentists/";

// Dentist HTTP Handlers
// GET Requests

router.get(
  '/',
  asyncwrapper(async (req: Request, res: Response) => {
    let patients = await Patient.find().select('-password');

    return res.status(200).json(patients);
  })
);

router.get(
  '/:id',
  [validateObjectId, authPatient],
  asyncwrapper(async (req: Request, res: Response) => {
    let patient = await Patient.findById(req.params.id).select('-password');

    if (!patient)
      return res
        .status(404)
        .json({ message: 'Patient with given id was not found' });

    res.status(200).json(patient);
  })
);

router.get(
  '/:id/appointments',
  [validateObjectId, authPatient],
  asyncwrapper(async (req: Request, res: Response) => {
    let patient = await Patient.findById(req.params.id);
    if (!patient)
      return res
        .status(404)
        .json({ message: 'Patient with given id was not found.' });

    if (!client.connected)
      return res.status(500).json({ message: 'Internal server error' });

    let responseTopic: string = randomUUID();

    let response = await handleMqtt(
      'Patient/get_appointments/req',
      `Patient/${responseTopic}/get_appointments/res`,
      { patientId: patient._id, responseTopic: responseTopic }
    );
    
    // Fetch names for clinics
    let clinicsInfo = await Promise.all(response.map(async appointment => {
      let clinicId = appointment.clinicId;
      let clinicResponse = await axios.get(`http://localhost:4000/api/v1/clinics/name/${clinicId}`);
      return {
        clinicId: clinicId,
        clinicName: clinicResponse.data 
      };
    }));
    

    // We merge the names with the appointments received
    const clinicMap = new Map(clinicsInfo.map(clinic => [clinic.clinicId, clinic.clinicName]));
    const newAppointments = response.map(appointment => {
      const clinicName = clinicMap.get(appointment.clinicId); 
      return {
        ...appointment,
        clinicName: clinicName
      };
    });

    // Expected response is an array of appointments [Last element in array is response status]
    res.status(200).json(newAppointments);
  })
);

router.get(
  '/:id/appointments/:appointment_id',
  asyncwrapper(async (req: Request, res: Response) => {
    let patient = await Patient.findById(req.params.id);
    if (!patient)
      return res
        .status(404)
        .json({ message: 'Patient with given id was not found.' });

    if (!client.connected)
      return res.status(500).json({ message: 'Internal server error' });

    let responseTopic: string = randomUUID();

    let response = await handleMqtt(
      'Patient/get_appointments/req',
      `Patient/${responseTopic}/get_appointments/res`,
      { patientId: patient._id, responseTopic: responseTopic }
    );
    // Expected response is an array of appointments [Last element in array is response status]

    let appointment = response.find((appointment: any) => {
      if (appointment._id === req.params.appointment_id) {
        return appointment;
      }
    });

    if (!appointment)
      return res
        .status(404)
        .json({ message: 'Appointment with given id was not found' });

    return res.status(200).json(appointment);
  })
);

// POST requests
router.post(
  '/',
  asyncwrapper(async (req: Request, res: Response) => {
    let { error } = validateRegistration(req.body);
    if (error)
      return res.status(403).json({
        message: 'Invalid patient information' + error.details[0].message,
      });

    let patient = await Patient.findOne({ email: req.body.email });
    if (patient)
      return res
        .status(409)
        .json({ message: 'Patient with given email already exists' });

    patient = new Patient(req.body);
    await patient.hashPassword();
    let token = await patient.signJWT();

    let result = await patient.save();

    return res.status(201).json({
      token: token,
      ..._.pick(patient, [
        '_id',
        'phone_number',
        'firstname',
        'lastname',
        'email',
      ]),
    });
  })
);

router.post(
  '/login',
  asyncwrapper(async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password)
      return res
        .status(403)
        .json({ message: 'No email or password was provided' });

    let patient = await Patient.findOne({ email: req.body.email });
    if (!patient)
      return res
        .status(404)
        .json({ message: 'Patient with given email does not exist' });

    let match = await bcrypt.compare(
      req.body.password,
      patient.password.toString()
    );
    if (!match) return res.status(403).json({ message: 'Wrong password' });

    let token = await patient.signJWT();

    res.status(201).json({
      ..._.pick(patient, [
        '_id',
        'phone_number',
        'firstname',
        'lastname',
        'email',
      ]),
      token: token,
    });
  })
);

router.post(
  '/:id/appointments',
  [validateObjectId, authPatient],
  asyncwrapper(async (req: Request, res: Response) => {
    let patient = await Patient.findById(req.params.id);
    if (!patient)
      return res
        .status(404)
        .json({ message: 'Patient with given id was not found.' });

    if (!client.connected)
      return res.status(500).json({ message: 'Internal server error' });

    let responseTopic: string = randomUUID();

    let response = await handleMqtt(
      'Patient/make_appointment/req',
      `Patient/${responseTopic}/make_appointment/res`,
      {
        patientId: patient?._id,
        appointmentId: req.body.appointmentId,
        responseTopic: responseTopic,
      }
    );
  
    if(response.status === 201) {
      let notification = {
        subject: "booking",
        date: response.date,
        startTime: response.startTime,
        endTime: response.endTime, 
        dentistId: response.dentistId
      }
      axios.post(`${process.env.DENTIST_SERVICE}/dentists/notification`, notification)
      .then((res) => {
        console.log(res.status)
      })
      .catch((err) => {
        console.log(`Notification error: ${err.response.data}, status: ${err.response.status}`)
      });
    }

    // Expected response is an object with status property [other properties could be appointment and message.]
    pusher.trigger('global-channel', 'appointment-event', {});

    res.status(response.status).json(response);
  })
);

// PUT requests
router.put(
  '/:id',
  [validateObjectId, authPatient],
  asyncwrapper(async (req: Request, res: Response) => {
    let { error } = validateUpdate(req.body);
    if (error)
      return res.status(403).json({
        message: 'Invalid patient update format' + error.details[0].message,
      });

    if (req.body.password) {
      let hashed = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashed;
    }

    let patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select('-password');
    if (!patient)
      return res
        .status(404)
        .json({ message: 'Patient with given id was not found.' });

    res.status(200).json(patient);
  })
);

// DELETE Requests

router.delete(
  '/:id',
  [validateObjectId],
  asyncwrapper(async (req: Request, res: Response) => {
    let patient = await Patient.findByIdAndDelete(req.params.id).select(
      '-password'
    );
    if (!patient)
      return res
        .status(404)
        .json({ message: 'Patient with given id was not found.' });

    res.status(200).json(patient);
  })
);

// Cancel appointment from patient
router.put(
  '/:id/appointments/:appointment_id',
  [validateObjectId],
  asyncwrapper(async (req: Request, res: Response) => {
    let patient = await Patient.findById(req.params.id);
    if (!patient)
      return res
        .status(404)
        .json({ message: 'Patient with given id was not found.' });

    if (!client.connected)
      return res.status(500).json({ message: 'Internal server error' });

    let responseTopic: string = randomUUID();

    let response = await handleMqtt(
      'Patient/cancel_appointment/req',
      `Patient/${responseTopic}/cancel_appointment/res`,
      {
        patientId: patient?._id,
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
        dentistId: response.dentistId
      }
      axios.post(`${process.env.DENTIST_SERVICE}/dentists/notification`, notification)
      .then((res) => {
        console.log(res.status)
      })
      .catch((err) => {
        console.log(`Notification error: ${err.response.data}, status: ${err.response.status}`)
      });
    }
    pusher.trigger('global-channel', 'appointment-event', {});

    // Expected response is an object with status property [other properties could be appointment and message.]

    res.status(response.status).json(response);
  })
);

// Exporting the router object
export default router;
