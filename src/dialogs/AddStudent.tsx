import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel, Switch,
  TextField,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

interface AddStudentProps {
  open: boolean;
  onClose: () => void;
  closeAndRefresh: () => void;
  courses: string[];
}

const AddStudent: React.FC<AddStudentProps> = (props: AddStudentProps) => {
  const [indexNumber, setIndexNumber] = React.useState(0);
  const [year, setYear] = React.useState(0);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');

  const [courses, setCourses] = useState<any>(
    props.courses.map((course: string) => {
      return { name: course, value: false }
    })
  );

  const addStudent = async () => {
    const data = {
      index: `${indexNumber}/${year}`,
      firstName,
      lastName,
      courses: courses.filter((course: any) => course.value)?.map((course: any) => course.name)
    };

    const response = await axios.put('/students/add', data);
    if (response.status === 200) {
      props.closeAndRefresh();
    }
  }

  const handleOnChange = (courseName: string) => {
    const newCourses = courses.map((course: any) => {
      if (course.name === courseName) {
        course.value = !course.value;
      }
      return course
    });

    setCourses(newCourses);
  }

  const checkButtonDisable = () => {
    return indexNumber <= 0 || year <= 0 || firstName === '' || lastName === '' || !courses.some((course: any) => course.value);
  }

  const numberFieldOnChange = (field: string, value: string) => {
    let numberValue = parseInt(value);
    if (isNaN(numberValue)) {
      numberValue = 0;
    }
    field === 'year' ? setYear(numberValue) : setIndexNumber(numberValue);
  }

  // TODO NaN when removing number value from input
  // TODO first letter uppercase

  return <Dialog open={props.open} onClose={props.onClose}>
    <DialogTitle>Dodaj studenta</DialogTitle>
    <DialogContent>
      <Box component={'form'} onSubmit={addStudent}>
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            placeholder={'Broj indeksa'}
            value={indexNumber}
            onChange={(e) => numberFieldOnChange('index', e.target.value)}
            required
          />
          <Typography variant="h5">/</Typography>
          <TextField
            placeholder={'Godina upisa'}
            value={year}
            onChange={(e) => numberFieldOnChange('year', e.target.value)}
            required
          />
        </Box>
        <TextField
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={'Ime'}
          fullWidth
          required
        />
        <TextField
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder={'Prezime'}
          fullWidth
          required
        />
        {
          courses.map((course: any) => {
            return <FormControlLabel
              key={`formControl${course.name}`}
              control={
                <Switch
                  checked={course.value}
                  onChange={() => handleOnChange(course.name)}
                  name={`${course.name}`}
                />
              }
              label={course.name}
            />
          })
        }
      </Box>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={addStudent}
        variant={'contained'}
        disabled={checkButtonDisable()}
      >
        Dodaj studenta
      </Button>
      <Button
        onClick={props.onClose}
        variant={'text'}
      >
        Zatvori
      </Button>
    </DialogActions>
  </Dialog>
}

export default AddStudent;