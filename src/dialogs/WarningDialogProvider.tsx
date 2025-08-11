import React, { useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { ErrorManager } from "../utils/ErrorManager";

export const WarningDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const showWarning = React.useCallback((msg: string) => {
    setMessage(msg);
    setOpen(true);
  }, []);

  useEffect(() => {
    ErrorManager.register(showWarning);
    return () => {
      ErrorManager.unregister();
    }
  }, [showWarning]);

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  }

  return <>
    {children}
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { width: 400 }
      }}
    >
      <DialogTitle>{'Greška'}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant={'text'}>
          {'Zatvori'}
        </Button>
      </DialogActions>
    </Dialog>
  </>
}
