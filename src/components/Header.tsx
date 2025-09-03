import React from 'react';
import { useNavigate } from "react-router-dom";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { ErrorManager } from "../utils/ErrorManager";
import axios from "axios";

function Header() {
  const navigate = useNavigate();

  const onClickHandler = async () => {
    try {
      await axios.post('/auth/logout');
      navigate('/professor');
    } catch (error: any) {
      ErrorManager.show(error.response?.data.error || 'Došlo je do greške, pokušajte ponovo.');
    }
  }

  return (
    <AppBar
      position={'static'}
      color={'primary'}
      elevation={0}
      sx={{ pl: 1, pr: 1 }}
    >
      <Toolbar disableGutters={true} variant={'dense'}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Ardunent
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={onClickHandler} color="secondary">
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
