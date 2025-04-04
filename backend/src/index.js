import express from "express";
import path from "path";
import cors from "cors";


import connectDB from "./config/db.js";
import { startAgenda, stopAgenda } from "./config/agenda.js"; 
import sequenceRoutes from "./routes/sequenceRoutes.js";

const app = express();


app.use(express.json()); 

const allowedOrigin = process.env.ORIGIN || "http://localhost:5173"; 
console.log("Allowed Origin:", process.env.PORT);
app.use(
  cors()
);

// --- Database Connection ---
connectDB()
  .then(async () => {
    try {
      await startAgenda();
    } catch (agendaStartError) {
      console.error("Failed to start Agenda processing:", agendaStartError);

      process.exit(1);
    }

    // --- API Routes ---

    app.use("/api/sequence", sequenceRoutes);

    const __dirname = path.resolve();
  
    app.use(express.static(path.join(__dirname, '/frontend/dist')))

    app.get('*', (req, res)=> {
      res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
    })

    // --- Start Server ---
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running successfully on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Exiting due to database connection failure.");
    process.exit(1);
  });

async function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

  await stopAgenda();

  console.log("Graceful shutdown complete. Exiting.");
  process.exit(0);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION! Shutting down...", reason);

  process.exit(1);
});
