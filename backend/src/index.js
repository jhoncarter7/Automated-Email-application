import express from "express";
import path from "path";
import cors from "cors";
import 'dotenv/config'; // Ensure environment variables are loaded first

// Import configurations and routes
import connectDB from "./config/db.js";
import { startAgenda, stopAgenda } from "./config/agenda.js"; // Import control functions
import sequenceRoutes from "./routes/sequenceRoutes.js";

// Initialize Express app
const app = express();

// --- Core Middleware ---
app.use(express.json()); // Middleware to parse JSON bodies

// --- CORS Configuration ---
const allowedOrigin = process.env.ORIGIN || 'http://localhost:5173'; // Default if not set
console.log("Allowed Origin:", allowedOrigin);
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Add methods as needed
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- Database Connection ---
connectDB()
  .then(async () => {
    // --- Start Agenda Processing ---
    
    try {
        await startAgenda(); 
    } catch (agendaStartError) {
        console.error("Failed to start Agenda processing:", agendaStartError);
    
        process.exit(1);
    }

    // --- API Routes ---
   
    app.use("/api/sequence", sequenceRoutes);

    // --- Serve Static Frontend ---
    // Resolve directory paths (assuming standard project structure)
    const __dirname = path.resolve();
    // Adjust the path based on your actual frontend build directory location
    const frontendDistPath = path.join(__dirname, "../frontend/dist");
    console.log(`Serving static files from: ${frontendDistPath}`);

    // Serve static files (CSS, JS, images)
    app.use(express.static(frontendDistPath));

    // --- Catch-all Route for SPA ---
    // This handles client-side routing by sending index.html for any GET request
    // that doesn't match an API route or a static file.
    // It should come AFTER API routes and static file serving.
    app.get("*", (req, res) => {
      // Simple check to avoid serving index.html for API-like paths if desired
      if (req.path.startsWith('/api/')) {
           return res.status(404).send('API endpoint not found.');
      }
      const indexPath = path.join(frontendDistPath, "index.html");
      res.sendFile(indexPath, (err) => {
          if (err) {
              console.error("Error sending index.html:", err);
             
              res.status(500).send("Server error serving application.");
          }
      });
    });

    // --- Start Server ---
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running successfully on port ${PORT}`);
      console.log(`Access frontend at: ${allowedOrigin}`);
      console.log(`API available at: http://localhost:${PORT}/api`);
    });

  })
  .catch((err) => {
    console.error("Exiting due to database connection failure.");
    process.exit(1);
  });


// --- Graceful Shutdown ---
// Handles SIGTERM (e.g., from Docker/Kubernetes) and SIGINT (Ctrl+C)
async function gracefulShutdown(signal) {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

    // Stop Agenda processing first
    await stopAgenda();

    // Close Mongoose connection (optional, often handled by process exit)
    // await mongoose.connection.close();
    // console.log("MongoDB connection closed.");

    // Add any other cleanup tasks here

    console.log("Graceful shutdown complete. Exiting.");
    process.exit(0);
}

process.on("SIGTERM", () => gracefulShutdown('SIGTERM'));
process.on("SIGINT", () => gracefulShutdown('SIGINT'));

// Optional: Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...', error);
  // Perform minimal cleanup if possible, then exit
  // Avoid complex async operations here as the process state is unstable
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION! Shutting down...', reason);
  // Perform minimal cleanup, then exit
  process.exit(1);
});
