import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    currentSemester: {
      type: Number,
      required: true,
    },

    courseCompleted: {
      type: Boolean,
      default: false,
    },

    // =========================
    // PERSONAL INFORMATION
    // =========================

    fatherName: {
      type: String,
      default: "",
      trim: true,
    },

    motherName: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    mobile: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    bloodGroup: {
      type: String,
      default: "",
      trim: true,
    },

    sex: {
      type: String,
      default: "",
      trim: true,
    },

    religion: {
      type: String,
      default: "Islam",
      trim: true,
    },

    // Enrollment date
    enrollmentDay: {
      type: String,
      default: "",
    },

    enrollmentMonth: {
      type: String,
      default: "",
    },

    enrollmentYear: {
      type: String,
      default: "",
    },

    // Date of birth
    dobDay: {
      type: String,
      default: "",
    },

    dobMonth: {
      type: String,
      default: "",
    },

    dobYear: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
