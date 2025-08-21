import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import React from 'react';
import { ErrorManager } from "../utils/ErrorManager";
import api from "../services/api";

interface AddComponentProps {
  open: boolean;
  onClose: () => void;
  closeAndRefresh: (data: any) => void;
}

const AddComponent: React.FC<AddComponentProps> = (props: AddComponentProps) => {
  const [name, setName] = React.useState('');
  const [quantity, setQuantity] = React.useState(0);
  const [image, setImage] = React.useState<File | null>(null);

  const addComponent = async () => {
    if(!image) {
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('quantity', quantity.toString());
    formData.append('image', image);

    try {
      const response = await api.post('/components/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if(response.status === 200 && response.data) {
        resetValues();
        props.closeAndRefresh(response.data);
      }
    } catch (error: any) {
      ErrorManager.show(error.response.data.error);
    }
  };

  const checkButtonDisable = () => {
    return !name || !image ||  quantity <= 0 || !quantity;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleQuantityChange = (value: any) => {
    if (value === '') {
      setQuantity(value);
    } else {
      let numberValue = parseInt(value);
      // TODO check after update negative values
      if (isNaN(numberValue) || numberValue < 0) {
        numberValue = 0;
      }
      setQuantity(numberValue);
    }
  }

  const closeDialog = () => {
    resetValues();
    props.onClose();
  }

  const resetValues = () => {
    setName('');
    setQuantity(0);
    setImage(null);
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>Dodaj komponentu</DialogTitle>
      <DialogContent>
        <Box component={'form'} display={'flex'} flexDirection={'column'} gap={2} mt={1}>
          <Box>
            <Typography variant={'subtitle1'} gutterBottom>
              Ime komponente
            </Typography>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete={'off'}
              fullWidth
              required
            />
          </Box>

          <Box>
            <Typography variant={'subtitle1'} gutterBottom>
              Količina
            </Typography>
            <TextField
              type={'number'}
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              fullWidth
              required
            />
          </Box>

          <Box>
            <Typography variant={'subtitle1'} gutterBottom>
              Slika komponente
            </Typography>
            <Button variant={'outlined'} component={'label'}>
              Odaberi sliku
              <input
                type={'file'}
                accept={'image/*'}
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {image && (
              <Typography variant={'body2'} mt={1}>
                {image.name}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={addComponent}
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

export default AddComponent;
