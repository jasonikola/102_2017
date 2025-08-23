import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { ErrorManager } from "../utils/ErrorManager";
import axios from "axios";

function ThemesTable() {
  const [themes, setThemes] = useState<any[]>([]);

  useEffect(() => {
    getThemes().then((themes: any) => {
      setThemes(themes);
    });
  }, []);

  const getThemes = async () => {
    try {
      const response = await axios.get("/projectThemes");
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      ErrorManager.show(error.response?.data?.error || 'Greška pri učitavanju tema za seminarski.');
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ime teme</TableCell>
            <TableCell>Zauzeta / Slobodna</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!!themes?.length &&
            themes.map((theme: any) => (
              <TableRow key={theme.name}>
                <TableCell>{theme.name}</TableCell>
                <TableCell>{theme.group ? `Zauzeta - ${theme.group}` : 'Slobodna'}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ThemesTable;
