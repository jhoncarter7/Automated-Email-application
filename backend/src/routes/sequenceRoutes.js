import express from "express";
import { saveAndScheduleSequence } from "../controllers/sequenceController.js";

const router = express.Router();


router.post("/save-schedule", saveAndScheduleSequence);


export default router;
