import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import React from "react";
import axios from "axios";

interface AddStudentProps {
  open: boolean;
  onClose: () => void;
  closeAndRefresh: (data: any) => void;
}

const AddStudent: React.FC<AddStudentProps> = (props: AddStudentProps) => {
  const [indexNumber, setIndexNumber] = React.useState(0);
  const [year, setYear] = React.useState(0);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');

  const addStudent = async () => {
    const data = {
      index: `${indexNumber}/${year}`,
      firstName,
      lastName
    };

    try {
      const response = await axios.put('/students/add', data);
      if (response.status === 200 && response.data) {
        props.closeAndRefresh(response.data);
      }
    } catch (e) {
      // TODO add error message
    }
  }

  const checkButtonDisable = () => {
    return indexNumber <= 0 || year <= 0 || firstName === '' || lastName === '';
  }

  const numberFieldOnChange = (field: string, value: string) => {
    let numberValue = parseInt(value);
    if (isNaN(numberValue)) {
      numberValue = 0;
    }
    field === 'year' ? setYear(numberValue) : setIndexNumber(numberValue);
  }

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
