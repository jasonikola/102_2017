import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import ProfessorPage from "./pages/professor/ProfessorPage";
import HomePage from "./pages/HomePage";
import ProfessorHomePage from "./pages/professor/ProfessorHomePage";
import { WarningDialogProvider } from "./dialogs/WarningDialogProvider";
import Points from "./pages/Points";
import ThemesTable from "./pages/ThemesTable";

function App() {
  return (
    <div className="App">
      <WarningDialogProvider>
        <Router>
          <Routes>
            <Route path="/professor" element={<ProfessorPage />} />
            <Route path="/professor/home/*" element={<ProfessorHomePage />} />
            <Route path="/home/*" element={<HomePage />} />
            <Route path="/points" element={<Points />} />
            <Route path="/themes" element={<ThemesTable />} />
            {/*<Route path="*" element={<Navigate to={'/home'} replace={true} />} />*/}
            <Route path="*" element={<Navigate to={'/professor'} replace={true} />} />
            {/*TODO if user then navigate to profesor/student page*/}
          </Routes>
        </Router>
      </WarningDialogProvider>
    </div>
  );
}

export default App;
