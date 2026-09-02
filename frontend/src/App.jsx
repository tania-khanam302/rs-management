import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import OverallResult from "./pages/OverallResult";
import SemesterResult from "./pages/SemesterResult";
import PersonalInfo from "./pages/PersonalInfo";
import StudentLayout from "./components/StudentLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LOGIN ================= */}

        <Route path="/" element={<Login />} />


        {/* ================= PROTECTED ROUTES ================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/personal-info"
            element={
              <StudentLayout>
                <PersonalInfo />
              </StudentLayout>
            }
          />

          <Route
            path="/overall-result"
            element={
              <StudentLayout>
                <OverallResult />
              </StudentLayout>
            }
          />

          <Route
            path="/semester-result"
            element={
              <StudentLayout>
                <SemesterResult />
              </StudentLayout>
            }
          />

        </Route>


        {/* ================= 404 ================= */}

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
