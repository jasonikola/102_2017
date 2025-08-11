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
import { ErrorManager } from "../utils/ErrorManager";

interface AddStudentProps {
  open: boolean;
  onClose: () => void;
  closeAndRefresh: (data: any) => void;
}

const AddStudent: React.FC<AddStudentProps> = (props: AddStudentProps) => {
  const [indexNumber, setIndexNumber] = React.useState<any>(0);
  const [year, setYear] = React.useState<any>(0);
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
        resetValues();
        props.closeAndRefresh(response.data);
      }
    } catch (error: any) {
      ErrorManager.show(error.response.data.error);
    }
  }

  const checkButtonDisable = () => {
    return indexNumber <= 0 || year <= 0 || !indexNumber || !year || firstName === '' || lastName === '';
  }

  const numberFieldOnChange = (field: string, value: string) => {
    if (value === '') {
      field === 'year' ? setYear(value) : setIndexNumber(value);
      return;
    }

    let numberValue = parseInt(value);
    if (isNaN(numberValue)) {
      numberValue = 0;
    }
    field === 'year' ? setYear(numberValue) : setIndexNumber(numberValue);
  }

  const resetValues = () => {
    setIndexNumber(0);
    setYear(0);
    setFirstName('');
    setLastName('');
  }

  const closeDialog = () => {
    resetValues();
    props.onClose();
  }

  // TODO first letter uppercase

  return <Dialog open={props.open} onClose={props.onClose}>
    <DialogTitle>Dodaj studenta</DialogTitle>
    <DialogContent>
      <Box component={'form'} onSubmit={addStudent} display={'flex'} flexDirection={'column'} gap={2}>
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <Box display={'flex'} flexDirection={'column'} flex={1}>
            <Typography variant={'subtitle2'}>Broj indeksa</Typography>
            <TextField
              value={indexNumber}
              onChange={(e) => numberFieldOnChange('index', e.target.value)}
              required={true}
              fullWidth={true}
            />
          </Box>
          <Typography variant={'h5'} mt={3}>/</Typography>
          <Box display={'flex'} flexDirection={'column'} flex={1}>
            <Typography variant={'subtitle2'}>Godina upisa</Typography>
            <TextField
              value={year}
              onChange={(e) => numberFieldOnChange('year', e.target.value)}
              required={true}
              fullWidth={true}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant={'subtitle2'}>Ime</Typography>
          <TextField
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth={true}
            required={true}
          />
        </Box>

        <Box>
          <Typography variant={'subtitle2'}>Prezime</Typography>
          <TextField
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth={true}
            required={true}
          />
        </Box>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={addStudent}
        variant={'contained'}
        disabled={checkButtonDisable()}
      >
        Dodaj
      </Button>
      <Button
        onClick={closeDialog}
        variant={'text'}
      >
        Zatvori
      </Button>
    </DialogActions>
  </Dialog>

}

export default AddStudent;
