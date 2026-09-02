import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./../PersonalInfo.css";

function PersonalInfo() {
  const navigate = useNavigate();

  const [originalData, setOriginalData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    enrollmentDay: "",
    enrollmentMonth: "",
    enrollmentYear: "",
    fatherName: "",
    mobile: "",
    motherName: "",
    designation: "",
    address: "",
    bloodGroup: "",
    email: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    sex: "",
    religion: "Islam",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD STUDENT PROFILE
  // ==========================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:4000/api/students/profile",
        {
          withCredentials: true,
        }
      );

      const student = response.data.student;

      console.log("Student Profile:", student);

      const data = {
        name: student.name || "",

        enrollmentDay:
          student.enrollmentDay ||
          student.enrollmentDate?.day ||
          "",

        enrollmentMonth:
          student.enrollmentMonth ||
          student.enrollmentDate?.month ||
          "",

        enrollmentYear:
          student.enrollmentYear ||
          student.enrollmentDate?.year ||
          "",

        // fatherName:
        //   student.fatherName ||
        //   student.fathersName ||
        //   "",

        fatherName:
  student.fatherName ||
  student.fathersName ||
  student.father_name ||
  student.father ||
  "",


        mobile: student.mobile || "",

        // motherName:
        //   student.motherName ||
        //   student.mothersName ||
        //   "",

        motherName:
  student.motherName ||
  student.mothersName ||
  student.mother_name ||
  student.mother ||
  "",


        designation: student.designation || "",

        address: student.address || "",

        bloodGroup:
          student.bloodGroup || "",

        email: student.email || "",

        dobDay:
          student.dobDay ||
          student.dateOfBirth?.day ||
          "",

        dobMonth:
          student.dobMonth ||
          student.dateOfBirth?.month ||
          "",

        dobYear:
          student.dobYear ||
          student.dateOfBirth?.year ||
          "",

        sex: student.sex || "",

        religion: student.religion || "Islam",
      };

      setForm(data);
      setOriginalData(data);
    } catch (err) {
      console.log(
        "Profile Loading Error:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Unable to load personal information."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ==========================================
  // UPDATE
  // ==========================================

 const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    setSaving(true);
    setMessage("");
    setError("");

    const response = await axios.put(
      "http://localhost:4000/api/students/profile",
      form,
      {
        withCredentials: true,
      }
    );

    console.log("Update Response:", response.data);

    // Server থেকে updated student data নাও
    const updatedStudent = response.data.student;

    if (updatedStudent) {
      const updatedData = {
        name: updatedStudent.name || "",

        enrollmentDay: updatedStudent.enrollmentDay || "",
        enrollmentMonth: updatedStudent.enrollmentMonth || "",
        enrollmentYear: updatedStudent.enrollmentYear || "",

        fatherName: updatedStudent.fatherName || "",
        motherName: updatedStudent.motherName || "",
        address: updatedStudent.address || "",
        email: updatedStudent.email || "",
        mobile: updatedStudent.mobile || "",
        designation: updatedStudent.designation || "",
        bloodGroup: updatedStudent.bloodGroup || "",

        dobDay: updatedStudent.dobDay || "",
        dobMonth: updatedStudent.dobMonth || "",
        dobYear: updatedStudent.dobYear || "",

        sex: updatedStudent.sex || "",
        religion: updatedStudent.religion || "Islam",
      };

      setForm(updatedData);
      setOriginalData(updatedData);
    } else {
      // যদি backend student না পাঠায়, তাহলে আবার load করবে
      await loadProfile();
    }

    setMessage(
      response.data?.message ||
        "Student profile updated successfully"
    );

  } catch (err) {
    console.log(
      "Profile Update Error:",
      err.response?.data
    );

    setError(
      err.response?.data?.message ||
        "Unable to update personal information."
    );
  } finally {
    setSaving(false);
  }
};

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    if (originalData) {
      setForm(originalData);
    }

    setMessage("");
    setError("");
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/students/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log("Logout Error:", err);
    }

    localStorage.removeItem("student");

    navigate("/");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="personal-page">
        <div className="personal-loading">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="personal-page">
         <div className="personal-information-box">

            <div className="personal-title">
              Personal Information
            </div>

            <form
              onSubmit={handleUpdate}
              className="personal-form"
            >

              {/* =============================
                  LEFT COLUMN
              ============================== */}

              <div className="personal-left">

                {/* NAME */}

                <div className="personal-row">

                  <label>Name</label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />

                </div>


                {/* FATHER */}

                <div className="personal-row">

                  <label>Father's Name</label>

                  <input
                    type="text"
                    name="fatherName"
                    value={form.fatherName}
                    onChange={handleChange}
                  />

                </div>


                {/* MOTHER */}

                <div className="personal-row">

                  <label>Mother's Name</label>

                  <input
                    type="text"
                    name="motherName"
                    value={form.motherName}
                    onChange={handleChange}
                  />

                </div>


                {/* ADDRESS */}

                <div className="personal-row address-row">

                  <label>Address</label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />

                </div>


                {/* EMAIL */}

                <div className="personal-row">

                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />

                </div>


                {/* SEX */}

                <div className="personal-row sex-row">

                  <label>Sex</label>

                  <div className="radio-area">

                    <label>
                      <input
                        type="radio"
                        name="sex"
                        value="Male"
                        checked={
                          form.sex === "Male"
                        }
                        onChange={handleChange}
                      />
                      Male
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="sex"
                        value="Female"
                        checked={
                          form.sex === "Female"
                        }
                        onChange={handleChange}
                      />
                      Female
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="sex"
                        value="Others"
                        checked={
                          form.sex === "Others"
                        }
                        onChange={handleChange}
                      />
                      Others
                    </label>

                  </div>

                </div>

              </div>


              {/* =============================
                  RIGHT COLUMN
              ============================== */}

              <div className="personal-right">

                {/* ENROLLMENT */}

                <div className="personal-row">

                  <label>Enrollment</label>

                  <div className="date-selects">

                    <select
                      name="enrollmentDay"
                      value={
                        form.enrollmentDay
                      }
                      onChange={handleChange}
                    >
                      <option value="">
                        Day
                      </option>

                      {Array.from(
                        { length: 31 },
                        (_, i) => (
                          <option
                            key={i + 1}
                            value={i + 1}
                          >
                            {i + 1}
                          </option>
                        )
                      )}

                    </select>

                    <select
                      name="enrollmentMonth"
                      value={
                        form.enrollmentMonth
                      }
                      onChange={handleChange}
                    >
                      <option value="">
                        Month
                      </option>

                      <option value="January">
                        January
                      </option>

                      <option value="February">
                        February
                      </option>

                      <option value="March">
                        March
                      </option>

                      <option value="April">
                        April
                      </option>

                      <option value="May">
                        May
                      </option>

                      <option value="June">
                        June
                      </option>

                      <option value="July">
                        July
                      </option>

                      <option value="August">
                        August
                      </option>

                      <option value="September">
                        September
                      </option>

                      <option value="October">
                        October
                      </option>

                      <option value="November">
                        November
                      </option>

                      <option value="December">
                        December
                      </option>

                    </select>

                    <input
                      type="text"
                      name="enrollmentYear"
                      value={
                        form.enrollmentYear
                      }
                      onChange={handleChange}
                    />

                  </div>

                </div>


                {/* MOBILE */}

                <div className="personal-row">

                  <label>Mobile</label>

                  <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                  />

                </div>


                {/* DESIGNATION */}

                <div className="personal-row">

                  <label>Designation</label>

                  <input
                    type="text"
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                  />

                </div>


                {/* BLOOD GROUP */}

                <div className="personal-row">

                  <label>Blood Group</label>

                  <select
                    className="blood-select"
                    name="bloodGroup"
                    value={
                      form.bloodGroup
                    }
                    onChange={handleChange}
                  >

                    <option value="">
                      Select
                    </option>

                    <option value="A+">
                      A+
                    </option>

                    <option value="A-">
                      A-
                    </option>

                    <option value="B+">
                      B+
                    </option>

                    <option value="B-">
                      B-
                    </option>

                    <option value="O+">
                      O+
                    </option>

                    <option value="O-">
                      O-
                    </option>

                    <option value="AB+">
                      AB+
                    </option>

                    <option value="AB-">
                      AB-
                    </option>

                  </select>

                </div>


                {/* DATE OF BIRTH */}

                <div className="personal-row">

                  <label>Date of Birth</label>

                  <div className="date-selects">

                    <select
                      name="dobDay"
                      value={form.dobDay}
                      onChange={handleChange}
                    >

                      <option value="">
                        Day
                      </option>

                      {Array.from(
                        { length: 31 },
                        (_, i) => (
                          <option
                            key={i + 1}
                            value={i + 1}
                          >
                            {i + 1}
                          </option>
                        )
                      )}

                    </select>

                    <select
                      name="dobMonth"
                      value={
                        form.dobMonth
                      }
                      onChange={handleChange}
                    >

                      <option value="">
                        Month
                      </option>

                      <option value="January">
                        January
                      </option>

                      <option value="February">
                        February
                      </option>

                      <option value="March">
                        March
                      </option>

                      <option value="April">
                        April
                      </option>

                      <option value="May">
                        May
                      </option>

                      <option value="June">
                        June
                      </option>

                      <option value="July">
                        July
                      </option>

                      <option value="August">
                        August
                      </option>

                      <option value="September">
                        September
                      </option>

                      <option value="October">
                        October
                      </option>

                      <option value="November">
                        November
                      </option>

                      <option value="December">
                        December
                      </option>

                    </select>

                    <input
                      type="text"
                      name="dobYear"
                      value={
                        form.dobYear
                      }
                      onChange={handleChange}
                    />

                  </div>

                </div>


                {/* RELIGION */}

                <div className="personal-row">

                  <label>Religion</label>

                  <select
                    name="religion"
                    value={
                      form.religion
                    }
                    onChange={handleChange}
                  >

                    <option value="Islam">
                      Islam
                    </option>

                    <option value="Hinduism">
                      Hinduism
                    </option>

                    <option value="Christianity">
                      Christianity
                    </option>

                    <option value="Buddhism">
                      Buddhism
                    </option>

                    <option value="Others">
                      Others
                    </option>

                  </select>

                </div>

              </div>


              {/* =============================
                  MESSAGES
              ============================== */}

              {(message || error) && (

                <div className="personal-message">

                  {message && (
                    <span className="success-message">
                      {message}
                    </span>
                  )}

                  {error && (
                    <span className="error-message">
                      {error}
                    </span>
                  )}

                </div>

              )}


              {/* =============================
                  BUTTONS
              ============================== */}

              <div className="personal-actions">

                <button
                  type="submit"
                  className="update-button"
                  disabled={saving}
                >
                  {saving
                    ? "Updating..."
                    : "Update"}
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
    </div>
  );
}

export default PersonalInfo;
