import React, { ChangeEvent, FormEvent  } from 'react';
import { Box, Button, TextField, } from "@mui/material";

interface FormInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  value: string;
  disabled: boolean;
  title: string;
  placeholder: string;
}

const FormInput: React.FC<FormInputProps> = (props: FormInputProps) => {
  // TODO check if needed
  return (
    <Box
      component={'form'}
      onSubmit={props.onSubmit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1
      }}>
      <TextField
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        required
        autoFocus
        sx={{ width: 500 }}
      />
      <Button
        type={'submit'}
        variant={'contained'}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.title}
      </Button>
    </Box>
  );
}

export default FormInput;
