import express from "express";

import {
    addResult,
    getMyResults,
    getMyCGPA,
    getSemesterResult,
    searchStudentResult,
    getAllStudentResults,
    getStudentCGPA
} from "../controllers/resultController.js";

import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add Result
router.post("/add", isAuthenticated, addResult);

// Get My Results
router.get("/my-results", isAuthenticated, getMyResults);

// Get My CGPA
router.get("/cgpa", isAuthenticated, getMyCGPA);

// Get Specific Semester Result
router.get(
    "/semester/:semester",
    isAuthenticated,
    getSemesterResult
);

// search student result -No Login Required
router.get(
    "/search",
    searchStudentResult
);

// get all student results
router.get(
    "/all-results",
    getAllStudentResults
);
router.get(
    "/student-cgpa",
    getStudentCGPA
);
export default router;