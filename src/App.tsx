import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import ProfessorPage from "./pages/professor/ProfessorPage";
import ProfessorHomePage from "./pages/professor/ProfessorHomePage";
import { WarningDialogProvider } from "./dialogs/WarningDialogProvider";
import Points from "./pages/Points";
import ThemesTable from "./pages/ThemesTable";
import ArduinoFact from "./pages/ArduinoFact";

function App() {
  return (
    <div className="App">
      <WarningDialogProvider>
        <Router>
          <Routes>
            <Route path="/professor" element={<ProfessorPage />} />
            <Route path="/professor/home/*" element={<ProfessorHomePage />} />
            <Route path="/points" element={<Points />} />
            <Route path="/themes" element={<ThemesTable />} />
            <Route path="/fact" element={<ArduinoFact />} />
            <Route path="*" element={<Navigate to={'/fact'} replace={true} />}/>
          </Routes>
        </Router>
      </WarningDialogProvider>
    </div>
  );
}

export default App;
