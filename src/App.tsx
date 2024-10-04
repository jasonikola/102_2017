import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import StudentPage from "./pages/StudentPage";
import ProfessorPage from "./pages/ProfessorPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/professor/*" element={<ProfessorPage/>} />
          <Route path="/student" element={<StudentPage/>} />
          <Route path="/" element={<Navigate to={'/login'}/>} />
          {/*TODO if user then navigate to profesor/student page*/}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
