import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import React from 'react';
import axios from 'axios';
import { ErrorManager } from "../utils/ErrorManager";

interface AddCSVProps {
  open: boolean;
  onClose: () => void;
  closeAndRefresh: (data: any) => void;
}

const AddCSV: React.FC<AddCSVProps> = (props: AddCSVProps) => {
  const [csvFile, setCsvFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const resetValues = () => {
    setCsvFile(null);
  };

  const closeDialog = () => {
    resetValues();
    props.onClose();
  };

  const checkButtonDisable = () => {
    return !csvFile;
  };

  const uploadCSV = async () => {
    if (!csvFile) return;

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await axios.post('/students/addCsv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200 && response.data) {
        resetValues();
        props.closeAndRefresh(response.data);
      }
    } catch (error: any) {
      ErrorManager.show(error.response?.data?.error || 'Greška pri dodavanju CSV-a');
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>Dodaj CSV</DialogTitle>
      <DialogContent>
        <Box display={'flex'} flexDirection={'column'} gap={2} mt={1}>
          <Box>
            <Button variant={'outlined'} component={'label'}>
              Odaberi CSV
              <input
                type={'file'}
                accept={'.csv'}
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {csvFile && (
              <Typography variant={'body2'} mt={1}>
                {csvFile.name}
              </Typography>
            )}
          </Box>

          <Typography variant={'body2'} color={'error'}>
            Ovaj CSV će prepisati studente sa istim indeksom koji već postoji.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={uploadCSV}
          variant={'contained'}
          disabled={checkButtonDisable()}
        >
          Dodaj
        </Button>
        <Button onClick={closeDialog} variant={'text'}>
          Zatvori
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCSV;
