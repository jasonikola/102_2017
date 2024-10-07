import React, { useEffect } from 'react';
import Components from "./Components";
import Students from "./Students";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Box, Button, Tab, Tabs } from "@mui/material";

function ProfessorPage() {

  const navigate = useNavigate();
  const location = useLocation();

  const [tabNumber, setTabNumber] = React.useState(0);
  const tabsData: any = {
    students: { number: 0, label: 'Studenti' },
    groups: { number: 1, label: 'Grupe' },
    TODO: { number: 2, label: 'Seminarski' },
    components: { number: 3, label: 'Komponente' },
    schemes: { number: 4, label: 'Šabloni' }
  };


  useEffect(() => {
    debugger
    let pathname: string = location.pathname.split('/')?.pop() || '';
    let tab: any = tabsData[pathname];
    if (tab) {
      setTabNumber(tab.number);
    }
  }, []);

  const onClickHandler = (event: any) => {
    const value: string = event.target.value;
    navigate(`${value}`, { replace: true });
  }


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };

  return (
    <>
      <Header />
      <Box sx={{ p: 1 }}>
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Tabs value={tabNumber} onChange={handleChange}>
            {
              Object.keys(tabsData).map((tab: any) => <Tab label={tabsData[tab].label} />)
            }
          </Tabs>
        </Box>
        <Routes>
          <Route path="/" element={<Navigate to={'/professor/students'} replace={true} />} />
          <Route path="/components" element={<Components />} />
          <Route path="/students" element={<Students />} />
        </Routes>
      </Box>
    </>
  );
}

export default ProfessorPage;
