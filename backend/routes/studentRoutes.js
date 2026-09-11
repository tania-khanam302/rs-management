import express from "express";

import {
    registerStudent,
    loginStudent,
    logoutStudent,
    getStudentProfile,
    updateStudentProfile,
    completeCourse,
    getCertificate,
    downloadCertificate
} from "../controllers/studentController.js";

import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerStudent);

// Login
router.post("/login", loginStudent);

// logout
router.post("/logout", logoutStudent);

// Protected Profile
router.get(
    "/profile",
    isAuthenticated,
    getStudentProfile
);

// Update Profile
router.put(
    "/profile",
    isAuthenticated,
    updateStudentProfile
);
// Complete Course
router.put("/complete-course", isAuthenticated, completeCourse);

// Certificate
router.get(
    "/certificate",
    isAuthenticated,
    getCertificate
);

// download certificate
router.get(
    "/certificate/download",
    isAuthenticated,
    downloadCertificate
);
export default router;