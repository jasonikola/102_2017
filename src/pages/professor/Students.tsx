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
  MenuItem
} from "@mui/material";
import AddStudent from "../../dialogs/AddStudent";
import ApiService from "../../ApiService";

function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const noGroup = 'Bez grupe';

  useEffect(() => {
    getStudents().then((students: any) => {
      const newGroups: string[] = [];
      setStudents(students);
      students?.forEach((student: any) => {
        newGroups.unshift(student.group ? student.group : noGroup);
      });
      setSelectedGroups(newGroups);
    });
    getGroups().then((groups:any) => {
      setGroups(groups);
    });
  }, []);

  const getStudents = async () => {
    try {
      const response = await axios.get('/students');

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      // TODO
    }
  }

  const getGroups = async () => {
    try {
      const groups = await ApiService.getGroups();
      return groups.map((group: any) => group.name)
    } catch (e) {
      console.log(e);
      //  TODO warning
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

  const showPoints = () => {
    console.log('TODO prikazi poene');
  }

  const handleGroupChange = (index: number, groupName: any, indexNumber: string) => {
    const updatedSelectedGroups = [...selectedGroups];
    updatedSelectedGroups[index] = groupName;
    setSelectedGroups(updatedSelectedGroups);
    updateGroupName(indexNumber, groupName);
  }

  const updateGroupName = async (index: string, groupName: string) => {
    try {
      const response = await axios.post('/students/assignGroup',
        { index, groupName: groupName !== noGroup ? groupName : '' },
        {
          headers: { 'Content-Type': 'application/json' }
        });
      if (response.status !== 200) {
        // TODO add some warning
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {!!students?.length && students.map((student: any, index) => (
              <TableRow key={`tableRow${student.name}`}>
                <TableCell>{student.index}</TableCell>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>
                  <Select
                    value={selectedGroups[index] ? selectedGroups[index] : noGroup}
                    onChange={(e) => handleGroupChange(index, e.target.value, student.index)}
                    fullWidth
                  >
                    <MenuItem value={noGroup}>{noGroup}</MenuItem>
                    {groups.map((group: any) => (
                      <MenuItem key={group} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant={'text'} onClick={showPoints}>
                    Prikazi poene
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddStudent
        open={addStudentOpen}
        closeAndRefresh={closeAndRefresh}
        onClose={() => setAddStudentOpen(false)} />
    </>
  );
}

export default Students;
