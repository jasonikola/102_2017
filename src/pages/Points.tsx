import React, { useEffect, useState } from "react";
import axios from "axios";
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

function Points() {
  const [points, setPoints] = useState<any[]>([]);

  useEffect(() => {
    getPoints().then((points: any) => {
      setPoints(points);
    });
  }, []);

  const getPoints = async () => {
    try {
      const response = await axios.get("/points");
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      ErrorManager.show(error.response?.data?.error || 'Greška pri učitavanju poena.');
    }
  };

  const calculateTotalPoints = (student: any) => {
    const { test1, test2, reTest1, reTest2, exam, project } = student;
    const kol1 = test1 > reTest1 ? test1 : reTest1;
    const kol2 = test2 > reTest2 ? test2 : reTest2;
    return kol1 + kol2 + project + exam;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Broj indexa</TableCell>
            <TableCell>Ime i Prezime</TableCell>
            <TableCell>Prvi kolokvijum</TableCell>
            <TableCell>Drugi kolokvijum</TableCell>
            <TableCell>Prvi popravni</TableCell>
            <TableCell>Drugi popravni</TableCell>
            <TableCell>Seminarski</TableCell>
            <TableCell>Ispit</TableCell>
            <TableCell>Prisustvo</TableCell>
            <TableCell>Ukupno</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!!points?.length &&
            points.map((student: any) => (
              <TableRow key={student.index}>
                <TableCell>{student.index}</TableCell>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>{student.test1 ?? "-"}</TableCell>
                <TableCell>{student.test2 ?? "-"}</TableCell>
                <TableCell>{student.reTest1 ?? "-"}</TableCell>
                <TableCell>{student.reTest2 ?? "-"}</TableCell>
                <TableCell>{student.project ?? "-"}</TableCell>
                <TableCell>{student.exam ?? "-"}</TableCell>
                <TableCell>{student.presence ?? "-"}</TableCell>
                <TableCell>{calculateTotalPoints(student)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Points;
