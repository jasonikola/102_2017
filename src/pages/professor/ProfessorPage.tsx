import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Box, Button, Checkbox, Container, FormControlLabel, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";

function ProfessorPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const emailRegex: RegExp = /^[a-zA-Z0-9-]+@pmf\.kg\.ac\.rs$/;

  useEffect(() => {
    checkAuth();

    let password = Cookies.get('password');
    let email = Cookies.get('email');

    email && setEmail(email);
    password && setPassword(password);
    email && password && setRememberMe(true);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/auth/me");
      if (response.status === 200) {
        navigate('./home', { replace: true });
      }
    } catch {

    }
  }

  const onSubmitHandler = async (event: any) => {
    event.preventDefault();
    try {
      const response = await axios.post('/auth/login', { email, password });

      const result = response.data;

      if (response.status === 200) {
        if (rememberMe) {
          Cookies.set('email', email);
        } else {
          setEmail('');
          setPassword('');
        }
        navigate(`./home`, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (error: any) {
      setError("Došlo je do greške, pokušajte ponovo.");
    }
  }

  const disableButton = (): boolean => {
    return !email || !password || !emailRegex.test(email);
  }

  return (
    <Container maxWidth="xs">
      <Paper sx={{ mt: 8, p: 2 }} elevation={2}>
        <Typography variant={'h5'} sx={{ textAlign: 'center' }}>
          Prijavi se
        </Typography>
        <Box component={'form'} onSubmit={onSubmitHandler}>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={'E-mail'}
            fullWidth
            required
            autoFocus
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={'Lozinka'}
            type={'password'}
            fullWidth
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                value={rememberMe}
                color={'primary'}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label={'Zapamti me'}
          />
          <Button
            type={'submit'}
            variant={'contained'}
            fullWidth
            onClick={onSubmitHandler}
            disabled={disableButton()}
          >
            Prijavi se
          </Button>
        </Box>
        {error && <Typography
          variant={'h6'}
          color={'error'}>
          {error}
        </Typography>}
      </Paper>
    </Container>
  );
}

export default ProfessorPage;
