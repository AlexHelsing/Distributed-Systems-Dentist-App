import express from "express";
import { Request, Response } from "express";
import asyncwrapper from "../../middlewares/asyncwrapper";
import { Dentist } from "../../models/dentistModel";
import { isValidObjectId, mongo } from "mongoose";
import Joi from "joi";
import { client, handleMqtt } from "../../mqttConnection";
import { randomUUID } from "crypto";

const router = express.Router() 

router.post(
  '/',
  asyncwrapper(async (req: Request, res: Response) => {
    let dentistId = req.body.dentistId;

    let { error } = validateNotificationBody(req.body);
    if(error) return res.status(403).json(error.details[0].message);
    
    let isValidId = isValidObjectId(dentistId);
    if(!isValidId) {
      return res.status(403).json({message: "is not a valid patient id"})
    }

    let dentist = await Dentist.findById(dentistId);
    if(!dentist) return res.status(404).json({message: "Dentist with given id was not found"});

    if(!client.connected) return res.status(500).json({message: "Internal error, MQTT not connected"});

    let responseTopic = randomUUID();
    let payload = {
      subject: req.body.subject,   
      firstname: dentist.firstname,
      lastname: dentist.lastname,
      email: dentist.email,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      responseTopic: responseTopic
    }
    let response = await handleMqtt('notification', `notification/${responseTopic}`, payload);
    if(response.status === 200){
      return res.status(200).json({message: "Notification is acknowledged"})
    }
  })
);

function validateNotificationBody(body: any) {
  const Schema = Joi.object({
    date: Joi.required(),
    startTime: Joi.required(),
    endTime: Joi.required(),
    dentistId: Joi.required(),
    subject: Joi.string().required()
  });

  return Schema.validate(body);
}

export default router;