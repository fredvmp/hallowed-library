import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LoginPage from "./components/pages/loginPage/loginPage";
import StartupPage from "./components/pages/startupPage/startupPage";
import TestPage from "./components/pages/testPage/testPage";
import ProfilePage from "./components/pages/profilePage/ProfilePage";
import PrivateRoute from "./routes/PrivateRoute";
import "./styles/variables.css";



function App() {
  return (
    <>
      <Routes>
        <Route index element={<StartupPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="pruebas" element={<TestPage />} />
        <Route
          path="profile"
          element={
            <PrivateRoute>
            <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>

      <Navbar />
    </>
  );
}

export default App;
