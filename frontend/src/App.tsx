import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LoginPage from "./components/pages/loginPage/loginPage";
import StartupPage from "./components/pages/startupPage/startupPage";
import TestPage from "./components/pages/testPage/testPage";
import ProfilePage from "./components/pages/profilePage/ProfilePage";
import PrivateRoute from "./routes/PrivateRoute";
import "./styles/variables.css";
import Library from "./components/library/Library";
import BookDetail from "./components/bookDetail/BookDetail";
import MyLibraryPanel from "./components/MyLibrary/MyLibraryPanel";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<StartupPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="library" element={<Library />} />
        <Route path="library/:id" element={<BookDetail />} />
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route path="my-library" element={<MyLibraryPanel />} />
      </Routes>

      <Navbar />
    </>
  );
}

export default App;
