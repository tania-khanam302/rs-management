import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./../OverallResult.css";
import headerLogo from "../images/header-logo.png";

function ResultSearch() {
  const navigate = useNavigate();

const API_URL = "https://rs-management-vgcw.onrender.com";

  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [cgpa, setCgpa] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // ================= Load Student Result =================
  useEffect(() => {
    loadStudentResult();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/api/students/logout`,
        {},
        {
          withCredentials: true,
        },
      );
    } catch (err) {
      console.log("Logout Error:", err);
    }

    localStorage.removeItem("student");
    navigate("/");
  };

  const loadStudentResult = async () => {
    try {
      setLoading(true);
      setError("");

      // ================= Get Logged-in Student Profile =================
      const studentResponse = await axios.get(
        `${API_URL}/api/students/profile`,
        {
          withCredentials: true,
        },
      );

      console.log("Student:", studentResponse.data);

      setStudent(studentResponse.data.student);

      // ================= Get All Results =================
      const resultResponse = await axios.get(
        `${API_URL}/api/results/my-results`,
        {
          withCredentials: true,
        },
      );

      console.log("Results:", resultResponse.data);

      setResults(resultResponse.data.results || []);

      // ================= Get CGPA =================
    const cgpaResponse = await axios.get(
  `${API_URL}/api/results/cgpa`,
        {
          withCredentials: true,
        },
      );

      console.log("CGPA:", cgpaResponse.data);

      setCgpa(cgpaResponse.data);
    } catch (error) {
      console.log("Result Loading Error:", error.response?.data);

      setError(
        error.response?.data?.message ||
          "Unable to load your result. Please login again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= Check All 8 Semesters =================
  const allSemestersCompleted = [1, 2, 3, 4, 5, 6, 7, 8].every(
    (semesterNumber) =>
      results.some((result) => Number(result.semester) === semesterNumber),
  );

  // ================= Download Result PDF =================
  const downloadResultPDF = () => {
    if (!student || !cgpa || results.length === 0) {
      return;
    }

    const doc = new jsPDF();

    // ================= Header =================

    doc.setFillColor(30, 64, 175);

    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(22);

    doc.setFont("helvetica", "bold");

    doc.text("STUDENT RESULT SYSTEM", 105, 15, {
      align: "center",
    });

    doc.setFontSize(11);

    doc.setFont("helvetica", "normal");

    doc.text("Academic Result Statement", 105, 25, {
      align: "center",
    });

    // Reset text color

    doc.setTextColor(0, 0, 0);

    // ================= Student Information =================

    doc.setFontSize(16);

    doc.setFont("helvetica", "bold");

    doc.text("Student Information", 20, 50);

    doc.setDrawColor(200, 200, 200);

    doc.roundedRect(15, 55, 180, 42, 3, 3);

    doc.setFontSize(11);

    doc.setFont("helvetica", "normal");

    doc.text(`Name: ${student.name}`, 22, 67);

    doc.text(`Student ID: ${student.studentId}`, 22, 78);

    doc.text(`Department: ${student.department}`, 110, 67);

    doc.text(`Academic Year: ${student.year}`, 110, 78);

    // ================= Semester Results =================

    let currentY = 110;

    // ================= COMMON TABLE HEADER =================

    autoTable(doc, {
      startY: currentY,

      head: [
        ["Sl", "Course Code", "Course Title", "Cr.Hr", "Grade", "Point", "G.P"],
      ],

      body: [],

      theme: "grid",

      margin: {
        left: 15,
        right: 15,
      },

      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        valign: "middle",
        lineColor: [180, 180, 180],
        lineWidth: 0.3,
      },

      headStyles: {
        fillColor: [133, 134, 138],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "start",
      },

      columnStyles: {
        0: {
          cellWidth: 10,
          halign: "center",
        },

        1: {
          cellWidth: 28,
          halign: "center",
        },

        2: {
          cellWidth: 65,
        },

        3: {
          cellWidth: 20,
          halign: "center",
        },

        4: {
          cellWidth: 20,
          halign: "center",
        },

        5: {
          cellWidth: 20,
          halign: "center",
        },

        6: {
          cellWidth: 22,
          halign: "center",
        },
      },
    });

    currentY = doc.lastAutoTable.finalY + 12;

    // ================= EACH SEMESTER =================

    results.forEach((semesterResult) => {
      // Page check
      if (currentY > 245) {
        doc.addPage();
        currentY = 20;

        autoTable(doc, {
          startY: currentY,

          head: [
            [
              "Sl",
              "Course Code",
              "Course Title",
              "Cr.Hr",
              "Grade",
              "Point",
              "G.P",
            ],
          ],

          body: [],

          theme: "grid",

          margin: {
            left: 15,
            right: 15,
          },

          styles: {
            fontSize: 8,
            cellPadding: 2.5,
            lineColor: [180, 180, 180],
            lineWidth: 0.3,
          },

          headStyles: {
            fillColor: [133, 134, 138],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            halign: "center",
          },

          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 28 },
            2: { cellWidth: 65 },
            3: { cellWidth: 20 },
            4: { cellWidth: 20 },
            5: { cellWidth: 20 },
            6: { cellWidth: 22 },
          },
        });

        currentY = doc.lastAutoTable.finalY + 12;
      }

      // ================= SEMESTER NAME =================

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      doc.text(`Semester ${semesterResult.semester}`, 20, currentY);

      // ================= SESSION =================

      const session =
        semesterResult.session ||
        semesterResult.academicSession ||
        semesterResult.semesterYear ||
        "";

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);

      doc.text(session, 190, currentY, {
        align: "right",
      });

      currentY += 5;

      // ================= SUBJECT ROWS =================

      autoTable(doc, {
        startY: currentY,

        head: [],

        body: semesterResult.subjects.map((subject, index) => {
          const credit = Number(subject.credit) || 0;

          const point = Number(subject.gradePoint) || 0;

          const gp = credit * point;

          return [
            index + 1,
            subject.subjectCode || "",
            subject.subjectName || "",
            credit.toFixed(2),
            subject.grade || "",
            point.toFixed(2),
            gp.toFixed(2),
          ];
        }),

        theme: "grid",

        margin: {
          left: 15,
          right: 15,
        },

        styles: {
          fontSize: 8,
          cellPadding: 2.5,
          valign: "middle",
          lineColor: [180, 180, 180],
          lineWidth: 0.3,
        },

        columnStyles: {
          0: {
            cellWidth: 10,
            halign: "center",
          },

          1: {
            cellWidth: 28,
            halign: "center",
          },

          2: {
            cellWidth: 65,
          },

          3: {
            cellWidth: 20,
            halign: "center",
          },

          4: {
            cellWidth: 20,
            halign: "center",
          },

          5: {
            cellWidth: 20,
            halign: "center",
          },

          6: {
            cellWidth: 22,
            halign: "center",
          },
        },
      });

      // ================= GPA =================

      currentY = doc.lastAutoTable.finalY + 7;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);

      doc.text(
        `Semester GPA: ${Number(semesterResult.semesterGPA || 0).toFixed(2)}`,
        190,
        currentY,
        {
          align: "right",
        },
      );

      currentY += 15;
    });

    // ================= Footer =================

    doc.setFontSize(9);

    doc.setFont("helvetica", "normal");

    doc.text("Generated by Student Result System", 105, 285, {
      align: "center",
    });

    // ================= Save PDF =================

    doc.save(`${student.studentId}-Result.pdf`);
  };

  // ================= Download Certificate =================
  const downloadCertificate = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/students/certificate/download`,
        {
          withCredentials: true,

          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${student.studentId}-Certificate.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Certificate Error:", error.response?.data);

      alert("Certificate is not available yet.");
    }
  };

  // ================= Loading =================

  if (loading) {
    return (
      <div className="result-page">
        <div className="container">
          <div className="loading">Loading your result...</div>
        </div>
      </div>
    );
  }

  // ================= Error =================

  if (error) {
    return (
      <div className="result-page">
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  // ================= No Student =================

  if (!student) {
    return (
      <div className="result-page">
        <div className="container">
          <div className="error">Student information not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="result-page">
      {/* <header className="overall-result-header">
          <div className="university-title-wrapper">
            <div className="university-logo">
              <img src={headerLogo} alt="" />
            </div>
          </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header> */}
      <div className="container">
        {/* ================= STUDENT INFORMATION ================= */}

        <div className="student-card">
          {/* <h2>
            Student Information
          </h2> */}

          <div className="student-info">
            <p>
              <strong>Student ID:</strong> {student.studentId}
            </p>

            <p>
              <strong>Department:</strong> {student.department}
            </p>

            <p>
              <strong>Name:</strong> {student.name}
            </p>

            <p>
              <strong>Academic Year:</strong> {student.year}
            </p>
          </div>
        </div>

        {/* COMMON TABLE HEADER */}
        <table className="result-table">
          <thead>
            <tr>
              <th className="sl-column">Sl</th>
              <th className="course-code-th">Course Code</th>
              <th className="course-title-th">Course Title</th>
              <th className="cr-th">Cr.Hr</th>
              <th className="grade-th">Grade</th>
              <th className="point-th">Point</th>
              <th className="gp-th">G.P</th>
            </tr>
          </thead>
        </table>

        {/* ALL SEMESTERS */}
        {results.map((semesterResult) => (
          <div className="semester-section" key={semesterResult._id}>
            {/* Semester 1 / Spring 2022 */}
            <div className="semester-header">
              <strong>Semester {semesterResult.semester}</strong>

              <span>
                {semesterResult.session ||
                  semesterResult.academicSession ||
                  semesterResult.semesterYear ||
                  ""}
              </span>
            </div>

            {/* Semester Subjects */}
            <table className="result-table">
              <tbody>
                {semesterResult.subjects.map((subject, index) => {
                  const gp =
                    Number(subject.credit) * Number(subject.gradePoint);
                  return (
                    <tr key={index}>
                      <td className="sl-column-td">{index + 1}</td>

                      <td className="course-code-td">{subject.subjectCode}</td>

                      <td className="course-title">{subject.subjectName}</td>

                      <td>{Number(subject.credit).toFixed(2)}</td>

                      <td>{subject.grade}</td>

                      <td>{Number(subject.gradePoint).toFixed(2)}</td>

                      <td>{gp.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* GPA */}
            <div className="gpa-box">
              <div className="gpa result-semester-gpa">
                Semester GPA:{" "}
                <strong>{Number(semesterResult.semesterGPA).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        ))}

        {/* ================= ACADEMIC SUMMARY ================= */}
        {cgpa && (
          <div className="cgpa-card">
            <div className="summary-grid">
              <div className="overall-cgpa">
                <span>
                  CGPA:
                </span>
                <strong>{cgpa.cgpa}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ================= COURSE COMPLETED ================= */}
        {student.courseCompleted === true && allSemestersCompleted && (
          <div className="certificate-section">
            <h3>🎓 Course Completed</h3>
            <p>
              Congratulations! You have successfully completed all 8 semesters.
            </p>

            <button
              className="certificate-button"
              onClick={downloadCertificate}
            >
              🎓 DOWNLOAD CERTIFICATE
            </button>
          </div>
        )}

        {/* ================= COURSE IN PROGRESS ================= */}
        {!allSemestersCompleted && (
          <div className="progress-section">
            <h3>📚 Course In Progress</h3>
            <p>
              You have completed <strong>{results.length}</strong> out of 8
              semesters.
            </p>

            <p>
              Certificate will be available after completing all 8 semesters.
            </p>
          </div>
        )}

        {/* ================= BUTTONS ================= */}
        <div className="result-actions">
          <button className="print-button" onClick={downloadResultPDF}>
            📄 DOWNLOAD RESULT PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultSearch;
