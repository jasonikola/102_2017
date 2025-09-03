import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: '#00979D'
    },
    secondary: {
      main: '#E2F1EC'
    }
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: '4px 8px',
        },
        root: {
          margin: '4px 0'
        }
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 'bold',
          color: '#00979D'
        },
        root: {
          padding: '4px 8px',
          verticalAlign: 'top',
          horizontalAlign: 'center',
          border: '1px solid rgba(224, 224, 224, 1)',
        },
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          minWidth: "800px",
          borderRadius: "16px"
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#00979D',
          color: 'white'
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          marginTop: '8px',
        }
      }
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          minWidth: 500,
          maxWidth: '80vw',
          borderRadius: 8,
          padding: '8px 16px',

        }
      }
    },
  },
  typography: {
    button: {
      textTransform: "none"
    }
  }
});
