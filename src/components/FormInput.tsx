import React, { ChangeEvent, FormEvent  } from 'react';
import { Box, Button, TextField, } from "@mui/material";

interface FormInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  value: string;
  disabled: boolean;
  title: string;
}

const FormInput: React.FC<FormInputProps> = (props: FormInputProps) => {

  return (
    <Box
      component={'form'}
      onSubmit={props.onSubmit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
      <TextField
        value={props.value}
        onChange={props.onChange}
        placeholder={'Ime grupe'}
        fullWidth
        required
        autoFocus
      />
      <Button
        type={'submit'}
        variant={'contained'}
        fullWidth
        onClick={props.onClick}
        disabled={props.disabled}
        sx={{ minWidth: 'auto', px: 1.5, py: 0.5, fontSize: '0.75rem', maxWidth: '250px' }}
      >
        {props.title}
      </Button>
    </Box>
  );
}

export default FormInput;
