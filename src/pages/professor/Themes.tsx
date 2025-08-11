import React, { useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import FormInput from "../../components/FormInput";
import axios from "axios";
import { ErrorManager } from "../../utils/ErrorManager";
import ApiService from "../../ApiService";

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
      return await ApiService.getThemes();
    } catch (error: any) {
      ErrorManager.show(error.response.data.error);
    }
  }

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();

    const data = { name: newTheme };

    try {
      const response = await axios.put(`/themes/add`, data);
      if (response.status === 200 && response.data) {
        const updatedThemes = [...themes];
        updatedThemes.unshift(response.data);
        setThemes(updatedThemes);
      }
    } catch (error: any) {
      ErrorManager.show(error.response.data.error);
    }
  }

  const disableButton = () => {
    // TODO add regex
    return newTheme?.length === 0;
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ime teme</TableCell>
            <TableCell>Dodeljena grupi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            !!themes?.length && themes?.map((theme: any) => (
              <TableRow key={theme.name}>
                <TableCell>{theme.name}</TableCell>
                <TableCell>{theme.group ? theme.group : 'Nije dodeljeno grupi'}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Themes;
