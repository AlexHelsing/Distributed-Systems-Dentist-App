import expresss from 'express';
import { Request, Response } from 'express';
import validateObjectId from '../../middlewares/validObjectId';
import asyncwrapper from '../../middlewares/asyncwrapper';
import { Clinic } from '../../models/clinicModel';
import bcrypt from 'bcrypt';
import { Dentist, validateRegistration } from '../../models/dentistModel';
import authAdmin from '../../middlewares/adminAuth';
import { handleMqtt, client } from '../../mqttConnection';
import authDentist from '../../middlewares/dentistAuth';
import { randomUUID } from 'crypto';
const redis = require('redis');

// other imports and setup...

const redisClient = redis.createClient();

// Connect to Redis
redisClient.connect();


const router = expresss.Router();

// GET
router.get(
  '/',
  asyncwrapper(async (req: Request, res: Response) => {
    let clinics = await Clinic.find()
      .select('-dentists -admin')
      .sort({ name: 1 });

    res.status(200).json(clinics);
  })
);

router.get('/city', async (req: Request, res: Response) => {
  let city = req.query.city;

  // if city is not specified, just use gothenburg as default
  if (!city) {
    city = 'Gothenburg';
  }

  // First letter needs to be capitalized
  try {
    let clinics = await Clinic.find({ city: city })
      .select('-dentists -admin')
      .sort({ name: 1 });

    return res.status(200).json(clinics);
  } catch {
    return res.status(500).json(console.error());
  }
});

router.get(
  '/:id',
  [validateObjectId],
  asyncwrapper(async (req: Request, res: Response) => {
    let clinic = await Clinic.findById(req.params.id).select('-admin').populate('dentists');
    if (!clinic)
      return res
        .status(404)
        .json({ message: 'Clinic with given id was not found.' });

    return res.status(200).json(clinic);
  })
);

router.get('/name/:id', [validateObjectId], asyncwrapper(async (req: Request, res: Response) => {
    const clinicId = req.params.id;
    const redisKey = `clinic:${clinicId}`; // Unique key for each clinic
  
    try {
      // Try to fetch clinic data from Redis cache
      const cachedClinic = await redisClient.get(redisKey);
  
      if (cachedClinic) {
        // Cache hit - send the cached response
        console.log("Returning from cache");
        return res.status(200).json(JSON.parse(cachedClinic));
      } else {
        // Cache miss - fetch data from MongoDB
        let clinic = await Clinic.findById(clinicId).select('-admin');
        if (!clinic) {
          return res.status(404).json({ message: 'Clinic with given id was not found.' });
        } else {
          // Update the Redis cache with the new data
          await redisClient.set(redisKey, JSON.stringify(clinic.name));
  
          // Return the response
          return res.status(200).json(clinic.name);
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }));

// Recieving all the appointment slots of a single clinic
router.get(
  '/:id/appointment_slots',
  [validateObjectId],
  asyncwrapper(async (req: Request, res: Response) => {
    let clinic = await Clinic.findById(req.params.id).select('-admin');
    if (!clinic)
      return res
        .status(404)
        .json({ message: 'Clinic with given id was not found' });

    if (!client.connected)
      return res.status(500).json({ message: 'Internal server error.' });

    const responseTopic: string = randomUUID();

    let clinicId = clinic._id;

    let response = await handleMqtt(
      `Clinic/get_appointments/req`,
      `Clinic/${responseTopic}/get_appointments/res`,
      { clinicId: clinicId, responseTopic: responseTopic }
    );
    // Response format: [...appointment Objects, {"status": 200, "message": "some details"}]

    let { status, message } = response.pop();

    return res.status(status).json(response);
  })
);

// Recieving all the appointment slots of a single clinic
router.get(
  '/:id/appointment_slots/:date',
  [validateObjectId],
  asyncwrapper(async (req: Request, res: Response) => {
    let clinic = await Clinic.findById(req.params.id).select('-admin');
    if (!clinic)
      return res
        .status(404)
        .json({ message: 'Clinic with given id was not found' });

    if (!client.connected)
      return res.status(500).json({ message: 'Internal server error.' });

    const responseTopic: string = randomUUID();
    let { dentists } = clinic;
    let date = req.params.date;

    console.log('Hell');

    let response = await handleMqtt(
      `Clinic/get_appointments/date/req`,
      `Clinic/${responseTopic}/get_appointments/res`,
      { dentists, date, responseTopic }
    );
    // Response format: [...appointment Objects, {"status": 200, "message": "some details"}]

    let { status, message } = response.pop();

    return res.status(status).json(response);
  })
);

// POST
router.post(
  '/login_admin',
  asyncwrapper(async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.password)
      return res.status(403).json({ message: 'Missing email or password' });

    let clinic = await Clinic.findOne({ 'admin.username': req.body.username });
    if (!clinic)
      return res
        .status(404)
        .json({ message: 'Clinic with given admin username was not found' });

    let admin = clinic.admin;

    let match = await bcrypt.compare(
      req.body.password,
      admin.password.toString()
    );
    if (!match) return res.status(403).json({ message: 'Incorrect password' });

    let token = await clinic.signJWT();

    res.status(201).json({ token: token , clinicId: clinic._id});
  })
);

router.post(
  '/:id/dentists',
  [validateObjectId, authAdmin],
  asyncwrapper(async (req: Request, res: Response) => {
    let clinic = await Clinic.findById(req.params.id)
      .select('-admin')
      .populate('dentists');
    if (!clinic)
      return res
        .status(404)
        .json({ message: 'clinic with given id was not found' });

    let { error } = validateRegistration(req.body);
    if (error) return res.status(403).json({ message: 'Invalid dentist info' });

    let newDentist = new Dentist(req.body);
    // check if dentist with similar email previously exists on the systems.
    let exists = await Dentist.findOne({ email: newDentist.email });

    if (exists)
      return res.status(409).json({
        message:
          'Dentist with given email is already registered in the clinic.',
      });

    await newDentist.hashPassword();
    newDentist = await newDentist.save();

    if (newDentist) {
      clinic.dentists.push(newDentist._id);
      await clinic.save();
    }

    return res.status(201).json({
      dentist_id: newDentist._id,
      message: 'Dentist was added to the clinic successfuly',
    });
  })
);

// DELETE
router.delete(
  '/:id/dentists/:dentist_id',
  [validateObjectId, authAdmin],
  asyncwrapper(async (req: Request, res: Response) => {
    let clinic = await Clinic.findById(req.params.id).populate('dentists');
    if (!clinic)
      return res
        .status(404)
        .json({ message: 'Clinic with given id was not found.' });

    let dentistIndex = -1;

    clinic.dentists.forEach((doc: Dentist, index) => {
      if (doc._id.toHexString() === req.params.dentist_id) {
        dentistIndex = index;
        return;
      }
    });

    if (dentistIndex === -1)
      return res.status(404).json({
        message: 'Dentist with given id is not registered in the clinic.',
      });

    let dentist = clinic.dentists[dentistIndex];

    const responseTopic: string = randomUUID();
    // Getting the patient_ids from the appointments created by the id of target dentist
    let appointments = await handleMqtt(
      'Dentist/get_appointments/req',
      `Dentist/${responseTopic}/get_appointments/res`,
      { dentistId: dentist._id, responseTopic: responseTopic }
    );
    let response = await handleMqtt(
      `Clinic/delete_dentist/req`,
      `Clinic/${responseTopic}/delete_dentist/res`,
      { dentistId: dentist._id, responseTopic: responseTopic }
    );

    if (response.status === 200) {
      await Dentist.findByIdAndDelete(dentist._id);
      clinic.dentists.splice(dentistIndex, 1);
      await clinic.save();

      // TODO: send a notification to patients who had an appointment with the deleted dentist.
      return res.status(200).json({
        message:
          'Dentist was removed from the the clinic alongside all of the appointments',
      });
    }

    res.status(response.status).json({ message: response.message });
  })
);

// exporting router
export default router;
