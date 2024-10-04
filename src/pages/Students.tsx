import React, { useEffect, useState } from 'react';
import axios from "axios";
import {
  Button,
  Dialog, DialogActions, DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

function Products() {
  const [students, setStudents] = useState<never[]>([]);
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialogComponents, setDialogComponents] = useState<string[]>([]);

  useEffect(() => {
    getStudents().then((students: any) => {
      setStudents(students)
    });
  }, []);

  const getStudents = async () => {
    try {
      const response = await axios.get('/users/students');

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      // TODO
    }
  }

  const handleOnClose = () => {
    setOpen(false);
  }

  const handleOnClick = (student: any) => {
    setOpen(true);
    setDialogTitle(`${student.firstName} ${student.lastName} komponente`);
    setDialogComponents(student.components);
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Broj indexa</TableCell>
              <TableCell>Ime i Prezime</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Komponente</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student: any, index) => (
              <TableRow key={index}>
                <TableCell>{student.index}</TableCell>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <Button
                    variant={'text'}
                    color={'primary'}
                    disabled={!student.components.length}
                    onClick={() => handleOnClick(student)}
                    sx={{ textTransform: 'none' }}
                  >
                    {`Broj komponenti: ${student.components.length}`}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleOnClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>{
          dialogComponents.map((component: any) => {
            return <p>{component}</p>
          })
        }</DialogContent>
        <DialogActions>
          <Button onClick={handleOnClose}>Zatvori</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Products;
