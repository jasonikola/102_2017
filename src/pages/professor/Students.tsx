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
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";

function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const noGroup = 'Bez grupe';


  const user = useSelector(selectUser)?.user;

  useEffect(() => {
    getStudents().then((students: any) => {
      const newGroups: string[] = [];
      setStudents(students);
      students.forEach((student: any) => {
        newGroups.push(student.group ? student.group : noGroup);
      });
      setSelectedGroups(newGroups);
    });
    // TODO
    setGroups([{ name: noGroup }, { name: 'Grupica' }, { name: 'Jutric' }, { name: 'Kafica' }]);
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

  const closeAndRefresh = async (student: any) => {
    setAddStudentOpen(false);
    const updatedStudents = [...students, student];
    setStudents(updatedStudents);
  }

  const handleOnClick = () => {
    setAddStudentOpen(true);
  }

  const showPoints = () => {
    console.log('TODO prikazi poene');
  }

  const handleGroupChange = (index: number, newValue: any, indexNumber: string) => {
    const updatedSelectedGroups = [...selectedGroups];
    updatedSelectedGroups[index] = newValue;
    setSelectedGroups(updatedSelectedGroups);
    updateGroupName(indexNumber, newValue);
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
        <Button variant={'text'} onClick={handleOnClick}>
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
            {students.map((student: any, index) => (
              <TableRow key={index}>
                <TableCell>{student.index}</TableCell>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>
                  <Select
                    value={selectedGroups[index] ? selectedGroups[index] : noGroup}
                    onChange={(e) => handleGroupChange(index, e.target.value, student.index)}
                    fullWidth
                  >
                    {groups.map((group: any) => (
                      <MenuItem key={group.name} value={group.name}>
                        {group.name}
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
        onClose={() => {
          setAddStudentOpen(false)
        }} />
    </>
  );
}

export default Students;
