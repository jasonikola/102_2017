import React from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser } from "../features/userSlice";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(removeUser());
    // TODO upgrada logout
    navigate('/login');
  }

  return (
    <AppBar
      position="static"
      color={'primary'}
      elevation={0}
      sx={{ pl: 1, pr: 1 }}
    >
      <Toolbar disableGutters={true} variant={'dense'}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Ardunent
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={() => console.log('TODO settings')} color="secondary">
          <SettingsIcon />
        </IconButton>
        <IconButton onClick={onClickHandler} color="secondary">
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
