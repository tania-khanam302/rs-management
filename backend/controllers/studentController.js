import Student from "../models/Student.js";
import Result from "../models/Result.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";

// =====================================================
// Register Student
// =====================================================
export const registerStudent = async (req, res) => {
  try {
    const {
      studentId,
      name,
      password,
      department,
      year,
      currentSemester,
    } = req.body;

    // Check required fields
    if (
      !studentId ||
      !name ||
      !password ||
      !department ||
      !year ||
      currentSemester === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({
      studentId: studentId.trim(),
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    await Student.create({
      studentId: studentId.trim(),
      name: name.trim(),
      password: hashedPassword,
      department,
      year: String(year),
      currentSemester: Number(currentSemester),
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Login Student
// =====================================================
export const loginStudent = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    // Check required fields
    if (!studentId || !password) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Password are required",
      });
    }

    // Find student
    const student = await Student.findOne({
      studentId: studentId.trim(),
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid Student ID or Password",
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      student.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid Student ID or Password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        studentId: student.studentId,
        id: student._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || "7d",
      }
    );

    // Store JWT in cookie
    // Required for Vercel frontend + Render backend
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge:
        Number(process.env.COOKIE_EXPIRE || 7) *
        24 *
        60 *
        60 *
        1000,
    });

    // Login successful
    return res.status(200).json({
      success: true,
      message: "Student login successful",

      student: {
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        department: student.department,
        year: student.year,
        currentSemester: student.currentSemester,
        courseCompleted: student.courseCompleted,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Logout Student
// =====================================================
export const logoutStudent = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: "Student logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get Student Profile
// =====================================================
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      studentId: req.student.studentId,
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Update Student Profile
// =====================================================
export const updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      studentId: req.student.studentId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Personal Information
    if (req.body.name !== undefined) {
      student.name = req.body.name;
    }

    if (req.body.fatherName !== undefined) {
      student.fatherName = req.body.fatherName;
    }

    if (req.body.motherName !== undefined) {
      student.motherName = req.body.motherName;
    }

    if (req.body.address !== undefined) {
      student.address = req.body.address;
    }

    if (req.body.email !== undefined) {
      student.email = req.body.email;
    }

    if (req.body.sex !== undefined) {
      student.sex = req.body.sex;
    }

    if (req.body.mobile !== undefined) {
      student.mobile = req.body.mobile;
    }

    if (req.body.designation !== undefined) {
      student.designation = req.body.designation;
    }

    if (req.body.bloodGroup !== undefined) {
      student.bloodGroup = req.body.bloodGroup;
    }

    if (req.body.religion !== undefined) {
      student.religion = req.body.religion;
    }

    // Enrollment Information
    if (req.body.enrollmentDay !== undefined) {
      student.enrollmentDay = req.body.enrollmentDay;
    }

    if (req.body.enrollmentMonth !== undefined) {
      student.enrollmentMonth = req.body.enrollmentMonth;
    }

    if (req.body.enrollmentYear !== undefined) {
      student.enrollmentYear = req.body.enrollmentYear;
    }

    // Date of Birth
    if (req.body.dobDay !== undefined) {
      student.dobDay = req.body.dobDay;
    }

    if (req.body.dobMonth !== undefined) {
      student.dobMonth = req.body.dobMonth;
    }

    if (req.body.dobYear !== undefined) {
      student.dobYear = req.body.dobYear;
    }

    // Save updated student
    await student.save();

    // Remove password from response
    const updatedStudent = student.toObject();
    delete updatedStudent.password;

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Complete Course
// =====================================================
export const completeCourse = async (req, res) => {
  try {
    const student = await Student.findOne({
      studentId: req.student.studentId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    student.courseCompleted = true;

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Course completed successfully",
      courseCompleted: student.courseCompleted,
    });
  } catch (error) {
    console.error("Complete Course Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get Certificate Information
// =====================================================
export const getCertificate = async (req, res) => {
  try {
    const student = await Student.findOne({
      studentId: req.student.studentId,
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check course completion
    if (!student.courseCompleted) {
      return res.status(403).json({
        success: false,
        message: "Course is not completed yet",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate is available",
      certificate: {
        studentId: student.studentId,
        name: student.name,
        department: student.department,
        year: student.year,
        courseCompleted: student.courseCompleted,
      },
    });
  } catch (error) {
    console.error("Certificate Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Download Certificate
// =====================================================
export const downloadCertificate = async (req, res) => {
  try {
    const student = await Student.findOne({
      studentId: req.student.studentId,
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check course completion
    if (!student.courseCompleted) {
      return res.status(403).json({
        success: false,
        message: "Course is not completed yet",
      });
    }

    // Get student results
    const results = await Result.find({
      studentId: student.studentId,
    });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No result found",
      });
    }

    // =================================================
    // Calculate CGPA
    // =================================================

    let totalCredit = 0;
    let totalGradePoint = 0;

    results.forEach((result) => {
      result.subjects.forEach((subject) => {
        totalCredit += Number(subject.credit);
        totalGradePoint +=
          Number(subject.credit) * Number(subject.gradePoint);
      });
    });

    if (totalCredit === 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to calculate CGPA",
      });
    }

    const cgpa = totalGradePoint / totalCredit;

    // =================================================
    // Certificate Number
    // =================================================

    const certificateNumber = `CERT-${student.department}-${student.year}-${student.studentId}`;

    // =================================================
    // Create PDF
    // =================================================

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 0,
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${student.studentId}-certificate.pdf"`
    );

    doc.pipe(res);

    // Page dimensions
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // =================================================
    // Background
    // =================================================

    doc
      .rect(0, 0, pageWidth, pageHeight)
      .fill("#fffdf5");

    // =================================================
    // Outer Border
    // =================================================

    doc
      .lineWidth(8)
      .strokeColor("#1e3a5f")
      .rect(20, 20, pageWidth - 40, pageHeight - 40)
      .stroke();

    // =================================================
    // Inner Border
    // =================================================

    doc
      .lineWidth(2)
      .strokeColor("#c9a227")
      .rect(32, 32, pageWidth - 64, pageHeight - 64)
      .stroke();

    // =================================================
    // University Name
    // =================================================

    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor("#1e3a5f")
      .text("UNIVERSITY OF EXCELLENCE", 0, 65, {
        align: "center",
        width: pageWidth,
      });

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#555555")
      .text("KNOWLEDGE • INTEGRITY • SUCCESS", 0, 95, {
        align: "center",
        width: pageWidth,
      });

    // =================================================
    // Decorative Line
    // =================================================

    doc
      .moveTo(260, 120)
      .lineTo(pageWidth - 260, 120)
      .lineWidth(2)
      .strokeColor("#c9a227")
      .stroke();

    // =================================================
    // Certificate Title
    // =================================================

    doc
      .font("Helvetica-Bold")
      .fontSize(32)
      .fillColor("#1e3a5f")
      .text("CERTIFICATE OF COMPLETION", 0, 140, {
        align: "center",
        width: pageWidth,
      });

    // =================================================
    // Subtitle
    // =================================================

    doc
      .font("Helvetica")
      .fontSize(15)
      .fillColor("#333333")
      .text("This is to certify that", 0, 195, {
        align: "center",
        width: pageWidth,
      });

    // =================================================
    // Student Name
    // =================================================

    doc
      .font("Helvetica-Bold")
      .fontSize(30)
      .fillColor("#1e3a5f")
      .text(student.name, 0, 225, {
        align: "center",
        width: pageWidth,
      });

    // Name underline
    doc
      .moveTo(250, 265)
      .lineTo(pageWidth - 250, 265)
      .lineWidth(1)
      .strokeColor("#c9a227")
      .stroke();

    // =================================================
    // Student Information
    // =================================================

    doc
      .font("Helvetica")
      .fontSize(14)
      .fillColor("#333333")
      .text(`Student ID: ${student.studentId}`, 0, 285, {
        align: "center",
        width: pageWidth,
      });

    doc.text(
      `Department: ${student.department}`,
      0,
      310,
      {
        align: "center",
        width: pageWidth,
      }
    );

    doc.text(
      `Academic Year: ${student.year}`,
      0,
      335,
      {
        align: "center",
        width: pageWidth,
      }
    );

    // =================================================
    // Completion Text
    // =================================================

    doc
      .fontSize(15)
      .text(
        "has successfully completed the required academic course.",
        0,
        375,
        {
          align: "center",
          width: pageWidth,
        }
      );

    // =================================================
    // CGPA
    // =================================================

    doc
      .font("Helvetica-Bold")
      .fontSize(21)
      .fillColor("#1e3a5f")
      .text(`CGPA: ${cgpa.toFixed(2)}`, 0, 410, {
        align: "center",
        width: pageWidth,
      });

    // =================================================
    // Issue Date
    // =================================================

    const issueDate = new Date().toLocaleDateString("en-GB");

    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor("#333333")
      .text(
        `Certificate issued on: ${issueDate}`,
        0,
        450,
        {
          align: "center",
          width: pageWidth,
        }
      );

    // =================================================
    // Signature
    // =================================================

    doc
      .moveTo(100, 500)
      .lineTo(270, 500)
      .lineWidth(1)
      .strokeColor("#333333")
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#333333")
      .text("Authorized Signature", 100, 507, {
        align: "center",
        width: 170,
      });

    // =================================================
    // Certificate Number
    // =================================================

    doc
      .fontSize(11)
      .text(
        `Certificate No: ${certificateNumber}`,
        pageWidth - 300,
        500,
        {
          align: "center",
          width: 200,
        }
      );

    // =================================================
    // Footer
    // =================================================

    doc
      .fontSize(9)
      .fillColor("#777777")
      .text(
        "This certificate is digitally generated by the Student Result Management System.",
        0,
        pageHeight - 55,
        {
          align: "center",
          width: pageWidth,
        }
      );

    // Finish PDF
    doc.end();
  } catch (error) {
    console.error("Certificate Download Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};