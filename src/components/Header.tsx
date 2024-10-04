import React from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser, selectUser } from "../features/userSlice";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user: any = useSelector(selectUser)?.user;

  const onClickHandler = () => {
    dispatch(removeUser());
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
        <Typography variant="h6" component="div">
          Ardunent
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="h6" component="div">
          {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''}
        </Typography>
        <Button
          variant={'text'}
          sx={{ ml: 1 }}
          onClick={onClickHandler}
          color={'secondary'}
        >
          Odjavi se
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
