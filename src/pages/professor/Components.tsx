import React, { useEffect } from 'react';
import { Button, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import AddComponent from "../../dialogs/AddComponent";
import axios from "axios";

// TODO add component model

function Components() {
  const [components, setComponents] = React.useState<any[]>([]);
  const [addComponentOpen, setAddComponentOpen] = React.useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getComponents().then((components: any) => setComponents(components));
  }, []);

  const getComponents = async () => {
    try {
      const response = await axios.get('/components/get');
      if (response.status === 200) {
        return response.data;
      }
    } catch (e: any) {
      console.error(e);
      // TODO add warning dialog
    }
  }

  const openAddComponentDialog = () => {
    setAddComponentOpen(true);
  }

  const closeAndRefresh = (component: any) => {
    setAddComponentOpen(false);
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Button
          variant={'contained'}
          onClick={openAddComponentDialog}
        >
          Dodaj komponentu
        </Button>

        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Ime komponente</TableCell>
            <TableCell>Kolicina</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            components?.map((component, index) => (
              <TableRow key={`tableRow${component?.name}`}>
                <TableCell>
                  <img
                    src={`${API_URL}/${component.image}`}
                    alt={component.name}
                    style={{ maxWidth: '100px', height: 'auto', borderRadius: 4 }}
                  />
                </TableCell>
                <TableCell>{component.name}</TableCell>
                <TableCell>{component.quantity}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </TableContainer>

      <AddComponent
        open={addComponentOpen}
        onClose={() => setAddComponentOpen(false)}
        closeAndRefresh={closeAndRefresh}
      />
    </>
  );
}

export default Components;
