import React, { useState } from 'react';
import Components from "./Components";
import Students from "./Students";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Box, Button } from "@mui/material";

function ProfessorPage() {

  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('students')

  const onClickHandler = (event: any) => {
    const value: string = event.target.value;
    setSelected(value);
    navigate(`${value}`, { replace: true });
  }

  const sx = {
    ml: 1,
    color: 'primary.main',
    backgroundColor: 'white',
    borderRadius: '10px 10px 0 0',
    // TODO hover and selected
  };

  return (
    <>
      <Header />
      <Box sx={{ p: 1 }}>
        <Box sx={{ mt: 1 }}>
          <Button
            disableElevation
            variant={'contained'}
            sx={sx}
            onClick={onClickHandler}
            value={'students'}
          >
            Studenti
          </Button>
          <Button
            disableElevation
            variant={'contained'}
            sx={sx}
            onClick={onClickHandler}
            value={'components'}
          >
            Komponente
          </Button>
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
