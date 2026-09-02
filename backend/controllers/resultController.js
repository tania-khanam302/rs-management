import Result from "../models/Result.js";
import Student from "../models/Student.js";

// ================= Search Student Result =================
export const searchStudentResult = async (req, res) => {
  try {
    const { studentId, semester, department, year } = req.query;

    // Check required fields
    if (!studentId || !semester || !department || !year) {
      return res.status(400).json({
        success: false,
        message: "Student ID, Semester, Department and Year are required",
      });
    }

    // Find student
    const student = await Student.findOne({
      studentId,
      department,
      year: String(year),
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student information not found",
      });
    }

    // Find result
    const result = await Result.findOne({
      studentId,
      semester: Number(semester),
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found for this semester",
      });
    }

    res.status(200).json({
      success: true,
      student: {
        studentId: student.studentId,
        name: student.name,
        department: student.department,
        year: student.year,
        currentSemester: student.currentSemester,
        courseCompleted: student.courseCompleted,
      },
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Add Result =================
export const addResult = async (req, res) => {
  try {
    const { studentId, semester, session, subjects } = req.body;

    // Check student
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if result already exists
    const existingResult = await Result.findOne({
      studentId,
      semester,
    });

    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: "Result for this semester already exists",
      });
    }

    // Calculate GPA
    let totalCredit = 0;
    let totalGradePoint = 0;

    subjects.forEach((subject) => {
      totalCredit += subject.credit;

      totalGradePoint += subject.credit * subject.gradePoint;
    });

    const semesterGPA = totalGradePoint / totalCredit;

    // Create result
const result = await Result.create({
  studentId,
  semester,
  session,
  subjects,
  semesterGPA: Number(semesterGPA.toFixed(2)),
});


    res.status(201).json({
      success: true,
      message: "Result added successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get My Results =================
export const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({
      studentId: req.student.studentId,
    }).sort({ semester: 1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get My CGPA =================
export const getMyCGPA = async (req, res) => {
  try {
    const results = await Result.find({
      studentId: req.student.studentId,
    }).sort({ semester: 1 });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No result found",
      });
    }

    let totalCredit = 0;
    let totalGradePoint = 0;

    results.forEach((result) => {
      result.subjects.forEach((subject) => {
        totalCredit += subject.credit;

        totalGradePoint += subject.credit * subject.gradePoint;
      });
    });

    const cgpa = totalGradePoint / totalCredit;

    res.status(200).json({
      success: true,
      studentId: req.student.studentId,
      totalSemester: results.length,
      totalCredit,
      cgpa: Number(cgpa.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get Semester Result =================
export const getSemesterResult = async (req, res) => {
  try {
    const semester = Number(req.params.semester);

    const result = await Result.findOne({
      studentId: req.student.studentId,
      semester: semester,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found for this semester",
      });
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get All Student Results =================
export const getAllStudentResults = async (req, res) => {
  try {
    const { studentId, department, year } = req.query;

    // Check required fields
    if (!studentId || !department || !year) {
      return res.status(400).json({
        success: false,
        message: "Student ID, Department and Year are required",
      });
    }

    // Find student
    const student = await Student.findOne({
      studentId,
      department,
      year: String(year),
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student information not found",
      });
    }

    // Find all semester results
    const results = await Result.find({
      studentId,
    }).sort({
      semester: 1,
    });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No result found",
      });
    }

    // Response
    res.status(200).json({
      success: true,

      student: {
        studentId: student.studentId,
        name: student.name,
        department: student.department,
        year: student.year,
        currentSemester: student.currentSemester,
        courseCompleted: student.courseCompleted,
      },

      count: results.length,

      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get Student CGPA =================

export const getStudentCGPA = async (req, res) => {
  try {
    const { studentId, department, year } = req.query;

    // Check required fields
    if (!studentId || !department || !year) {
      return res.status(400).json({
        success: false,
        message: "Student ID, Department and Year are required",
      });
    }

    // Check student
    const student = await Student.findOne({
      studentId,
      department,
      year: String(year),
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student information not found",
      });
    }

    // Find all results
    const results = await Result.find({
      studentId,
    }).sort({
      semester: 1,
    });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No result found",
      });
    }

    // Calculate CGPA
    let totalCredit = 0;
    let totalGradePoint = 0;

    results.forEach((result) => {
      result.subjects.forEach((subject) => {
        totalCredit += subject.credit;

        totalGradePoint += subject.credit * subject.gradePoint;
      });
    });

    const cgpa = totalGradePoint / totalCredit;

    res.status(200).json({
      success: true,

      studentId,

      totalSemester: results.length,

      totalCredit,

      cgpa: Number(cgpa.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
