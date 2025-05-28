import React, { useEffect } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import AddComponent from "../../dialogs/AddComponent";
import axios from "axios";
import ApiService from "../../ApiService";

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
      return await ApiService.getComponents();
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
    const updatedComponents = [...components];
    updatedComponents.unshift(component);
    setComponents(updatedComponents);
  }

  const deleteComponent = async (component: any) => {
    try {
      const response = await axios.delete(`/components/delete/${component._id}`);
      if (response.status === 200) {
        const updatedComponents = components.filter((c: any) => c._id !== component._id);
        setComponents(updatedComponents);
      }
    } catch (e) {
      console.log(e);
      // TODO warrning
    }
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Ime komponente</TableCell>
              <TableCell>Kolicina</TableCell>
              <TableCell>Dodeljeno</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              !!components?.length && components.map((component, index) => (
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
                  <TableCell>{component.assigned}</TableCell>
                  <TableCell>
                    <Button variant={'text'} onClick={() => deleteComponent(component)}>
                      Obrisi
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
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
