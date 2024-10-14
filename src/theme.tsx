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
  // TODO add padding to every paper
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
    }
  },
  typography: {
    button: {
      textTransform: "none"
    }
  }
});