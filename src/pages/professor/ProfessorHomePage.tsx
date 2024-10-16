import React, { useEffect } from 'react';
import Components from "./Components";
import Students from "./Students";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { Box, Tab, Tabs } from "@mui/material";

function ProfessorHomePage() {

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
    let pathname: string = location.pathname.split('/')?.pop() || '';
    let tab: any = tabsData[pathname];
    if (tab) {
      setTabNumber(tab.number);
    }
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
    const newPage: any = Object.keys(tabsData).filter((tab: any) => tabsData[tab].number === newValue)[0];
    if (newPage) {
      navigate(newPage, { replace: true })
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ p: 1 }}>
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Tabs value={tabNumber} onChange={handleChange}>
            {
              Object.keys(tabsData).map((tab: any) => <Tab key={`tab-${tabsData[tab].label}`} label={tabsData[tab].label} />)
            }
          </Tabs>
        </Box>
        <Routes>
          <Route path="/" element={<Navigate to={'./students'} replace={true} />} />
          <Route path="/components" element={<Components />} />
          <Route path="/students" element={<Students />} />
        </Routes>
      </Box>
    </>
  );
}

export default ProfessorHomePage;
