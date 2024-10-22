import React, { useEffect, useState } from 'react';
import axios from "axios";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import AddStudent from "../../dialogs/AddStudent";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";

function Students() {
  const [students, setStudents] = useState<never[]>([]);
  const [addStudentOpen, setAddStudentOpen] = useState(false);

  const user = useSelector(selectUser)?.user;
  const courses = user?.schoolYearData?.courses || [];

  useEffect(() => {
    getStudents().then((students: any) => {
      setStudents(students)
    });
  }, []);

  const getStudents = async () => {
    try {
      const response = await axios.get('/students/get');

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      // TODO
    }
  }

  const closeAndRefresh = async () => {
    setAddStudentOpen(false);
    const students = await getStudents();
    setStudents(students);
  }

  const handleOnClick = () => {
    setAddStudentOpen(true);
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Button variant={'text'} onClick={handleOnClick}>
          Dodaj studenta
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Broj indexa</TableCell>
              <TableCell>Ime i Prezime</TableCell>
              <TableCell>Predmeti</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student: any, index) => (
              <TableRow key={index}>
                <TableCell>{student.index}</TableCell>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>
                  {`Broj predmeta: ${student.courses.length}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddStudent
        open={addStudentOpen}
        courses={courses}
        closeAndRefresh={closeAndRefresh}
        onClose={() => {
          setAddStudentOpen(false)
        }} />
    </>
  );
}

export default Students;
