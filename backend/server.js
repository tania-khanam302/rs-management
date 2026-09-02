
import { connectDB } from "./config/db.js";
import app from "./app.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// ============ Database Connection ============
connectDB();

// ============ Start Server ============
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// ============ Unhandled Promise Rejection ============
process.on("unhandledRejection", (err) => {
    console.log(`Unhandled Rejection: ${err.message}`);

    server.close(() => {
        process.exit(1);
    });
});

// ============ Uncaught Exception ============
process.on("uncaughtException", (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

export default app;
