import React, { useState } from 'react';
import Header from "../components/Header";
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUserComponents } from "../features/userSlice";
import axios from "axios";

function StudentPage() {
  const dispatch = useDispatch();
  const [selectedComponents, setSelectedComponents] = useState<any[]>([]);
  const user = useSelector(selectUser)?.user;
  const components: any = user?.components || [];

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const data = { components: selectedComponents };
    try {
      const response = await axios.post('/users/return', data);
      const responseComponents = response.data.components;

      const newComponents: any = components.filter((component: any) => !responseComponents.includes(component));
      dispatch(setUserComponents(newComponents));
    } catch (error: any) {

    }
    // TODO if response 200 update user
    // TODO if error display error
  }

  const handleCheckboxChange = (component: any) => {
    setSelectedComponents((prevSelected: any) =>
      prevSelected.includes(component)
        ? prevSelected.filter((item: any) => item !== component)
        : [...prevSelected, component]
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ p: 1 }}>
        <Typography variant={'h6'}>
          Dobrodošao <Box sx={{ fontWeight: 'bold', display: 'inline' }}>{`${user?.firstName} ${user?.lastName}`}</Box>
        </Typography>
        <Paper elevation={2} sx={{ p: 1, }}>
          <Typography variant="h6">
            Komponente:
          </Typography>
          {
            components?.length > 0 ? <form onSubmit={onSubmitHandler}>
              <FormGroup>
                {components.map((component: any) => (
                  <FormControlLabel
                    key={component}
                    control={
                      <Checkbox
                        checked={selectedComponents.includes(component)}
                        onChange={() => handleCheckboxChange(component)}
                      />
                    }
                    label={component}
                  />
                ))}
              </FormGroup>
              <Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
                <Button type="submit" variant="contained" disabled={!selectedComponents.length}>
                  Vrati
                </Button>
              </Box>
            </form> : <Typography variant={'body1'} color={'textSecondary'}>
              Nemate ni jednu dodeljenu komponentu.
            </Typography>
          }
        </Paper>
      </Box>
    </>
  );
}

export default StudentPage;
