import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Login from "./pages/Login";
import Header from "./components/Header";
import Student from "./pages/Student";
import Professor from "./pages/Professor";

function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/professor" element={<Professor/>} />
          <Route path="/student" element={<Student/>} />
          <Route path="/" element={<Navigate to={!!sessionStorage.getItem('logged') ? '/professor' : '/login'}/>} /> // TODO
        </Routes>
      </Router>
    </div>
  );
}

export default App;
