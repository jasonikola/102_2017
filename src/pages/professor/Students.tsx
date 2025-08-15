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
  TableRow,
  Select,
  MenuItem, IconButton
} from "@mui/material";
import AddStudent from "../../dialogs/AddStudent";
import ApiService from "../../ApiService";
import StudentPoints from "../../dialogs/StudentPoints";
import { ErrorManager } from "../../utils/ErrorManager";
import AddCSV from "../../dialogs/AddCsv";
import DeleteIcon from "@mui/icons-material/Delete";

function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [addCsvOpen, setAddCsvOpen] = useState(false);
  const [studentPointsOpen, setStudentPointsOpen] = useState(false);
  const [studentForPoints, setStudentForPoints] = useState<any>(null);
  const [refresh, setRefresh] = useState(false);
  const noGroup = 'Bez grupe';

  useEffect(() => {
    getStudents().then((students: any) => {
      const newGroups: string[] = [];
      setStudents(students);
      students?.forEach((student: any) => {
        newGroups.push(student.group ? student.group : noGroup);
      });
      setSelectedGroups(newGroups);
    });
    getGroups().then((groups: any) => {
      setGroups(groups);
    });
  }, [refresh]);

  const getStudents = async () => {
    try {
      const response = await axios.get('/students');
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      ErrorManager.show(error.response.data.error);
    }
  }

  const getGroups = async () => {
    try {
      const groups = await ApiService.getGroups();
      return groups.map((group: any) => group.name)
    } catch (error: any) {
      ErrorManager.show(error.response.data.error);
    }
  }

  const closeAndRefresh = async (student: any) => {
    setAddStudentOpen(false);
    const updatedStudents = [...students, student];
    setStudents(updatedStudents);
  }

  const openAddStudentDialog = () => {
    setAddStudentOpen(true);
  }

  const showPoints = (student: any) => {
    setStudentPointsOpen(true);
    setStudentForPoints(student);
  }

  const handleGroupChange = (index: number, groupName: any, indexNumber: string) => {
    const updatedSelectedGroups = [...selectedGroups];
    updatedSelectedGroups[index] = groupName;
    setSelectedGroups(updatedSelectedGroups);
    updateGroupName(indexNumber, groupName);
  }

  const refreshAfterCsvUpload = () => {
    setRefresh(!refresh);
    setAddCsvOpen(false);
  }

  const updateGroupName = async (index: string, groupName: string) => {
    try {
      await axios.post('/students/assignGroup',
        { index, groupName: groupName !== noGroup ? groupName : '' },
        {
          headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
      ErrorManager.show(error.response.data.error);
    }
  }

  const studentPointsOnClose = (points: any) => {
    setStudentPointsOpen(false);
    const updatedStudents = students.map((student: any) => {
      if (student._id === studentForPoints._id) {
        return {
          ...student,
          points: points,
        }
      } else {
        return student
      }
    });
    setStudents(updatedStudents);
    setStudentForPoints(null)
  }

  const deleteStudent = async (student: any) => {
    try {
      const response = await axios.delete(`/students/delete/${student._id}`);
      const updatedStudents = students.filter((s: any) => s._id !== student._id);
      setStudents(updatedStudents);
    } catch (error: any) {
      ErrorManager.show(error.response.data.error);
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Button
          variant={'contained'}
          onClick={() => setAddCsvOpen(true)}
        >
          Dodaj CSV
        </Button>
        <>       </>
        <Button variant={'contained'} onClick={openAddStudentDialog}>
          Dodaj studenta
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Broj indexa</TableCell>
              <TableCell>Ime i Prezime</TableCell>
              <TableCell>Grupa</TableCell>
              <TableCell>Poeni</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!students?.length && students.map((student: any, index) => (
              <TableRow key={`tableRow${student.index}`}>
                <TableCell>{student.index}</TableCell>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>
                  <Select
                    value={selectedGroups[index] ? selectedGroups[index] : noGroup}
                    onChange={(e) => handleGroupChange(index, e.target.value, student.index)}
                    fullWidth
                  >
                    <MenuItem value={noGroup}>{noGroup}</MenuItem>
                    {groups?.map((group: any) => (
                      <MenuItem key={`${student}-${group}`} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant={'text'} onClick={() => showPoints(student)}>
                    Prikazi poene
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton
                    color={'error'}
                    onClick={() => deleteStudent(student)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddStudent
        open={addStudentOpen}
        closeAndRefresh={closeAndRefresh}
        onClose={() => setAddStudentOpen(false)}
      />

      <StudentPoints
        open={studentPointsOpen}
        onClose={studentPointsOnClose}
        student={studentForPoints}
      />

      <AddCSV
        open={addCsvOpen}
        onClose={() => setAddCsvOpen(false)}
        closeAndRefresh={refreshAfterCsvUpload}
      />
    </>
  );
}

export default Students;
