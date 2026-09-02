import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
    {
        subjectCode: {
            type: String,
            required: true
        },

        subjectName: {
            type: String,
            required: true
        },

        credit: {
            type: Number,
            required: true
        },

        marks: {
            type: Number,
            required: true
        },

        grade: {
            type: String,
            required: true
        },

        gradePoint: {
            type: Number,
            required: true
        }
    },
    {
        _id: false
    }
);

// const resultSchema = new mongoose.Schema(
//     {
//         studentId: {
//             type: String,
//             required: true
//         },

//         semester: {
//             type: Number,
//             required: true
//         },

//         subjects: [subjectSchema],

//         semesterGPA: {
//             type: Number,
//             required: true
//         }
//     },
//     {
//         timestamps: true
//     }
// );

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true
    },

    semester: {
      type: Number,
      required: true
    },

    session: {
      type: String,
      required: true
    },

    subjects: [subjectSchema],

    semesterGPA: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);


const Result = mongoose.model("Result", resultSchema);

export default Result;