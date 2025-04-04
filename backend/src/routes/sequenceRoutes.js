import express from "express";
import { saveAndScheduleSequence } from "../controllers/sequenceController.js";

const router = express.Router();

// Define routes for sequences
// POST /api/sequence/save-schedule
router.post("/save-schedule", saveAndScheduleSequence);


export default router;
