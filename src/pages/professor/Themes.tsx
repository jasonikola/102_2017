import React, { useEffect } from 'react';
import { Box, Paper, TableContainer, } from "@mui/material";
import FormInput from "../../components/FormInput";
import axios from "axios";

// TODO add component model

function Themes() {

  const [newTheme, setNewTheme] = React.useState<string>('');
  const [themes, setThemes] = React.useState<any[]>([]);

  useEffect(() => {
    getThemes().then((themes: any) => {
      setThemes(themes);
    });
  }, []);

  const getThemes = async () => {
    try {
      const response = await axios.get('/themes/get');
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      // TODO
      console.error(e);
    }
  }

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();

    const data = { name: newTheme };

    try {
      const response = await axios.put(`/themes/add`, data);
      if (response.status === 200 && response.data) {
        console.log("response", response.data);
      } else {
        // TOOD deletee
        console.log(response);
      }
    } catch (e) {
      // TODO add warning
    }
  }

  const disableButton = () => {
    // TODO add regex
    return newTheme.length === 0;
  }

  return (
    <TableContainer component={Paper}>
      <FormInput
        onSubmit={onSubmitHandler}
        onChange={(e) => setNewTheme(e.target.value)}
        onClick={onSubmitHandler}
        value={newTheme}
        disabled={disableButton()}
        title={'Dodaj novu temu'}
      />
      <Box>
        {
          themes?.map((theme: any) => (<div key={theme.name}>
            {theme.name}
          </div>))
        }
      </Box>
    </TableContainer>
  );
}

export default Themes;
