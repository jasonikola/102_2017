import React, { useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddComponent from "../../dialogs/AddComponent";
import ApiService from "../../ApiService";
import DeleteIcon from "@mui/icons-material/Delete";
import { ErrorManager } from "../../utils/ErrorManager";
import api from "../../services/api";
import { useSnackbar } from "../../components/SnachbarProvider";

function Components() {
  const [components, setComponents] = React.useState<any[]>([]);
  const [addComponentOpen, setAddComponentOpen] = React.useState(false);
  const { showSuccessMessage } = useSnackbar();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getComponents().then((components: any) => setComponents(components));
  }, []);

  const getComponents = async () => {
    try {
      return await ApiService.getComponents();
    } catch (error: any) {
      ErrorManager.show(error.response.data.error || 'Greška pri učitavanju komponenti.');
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
      const response = await api.delete(`/components/delete/${component._id}`);
      if (response.status === 200) {
        const updatedComponents = components.filter((c: any) => c._id !== component._id);
        setComponents(updatedComponents);
        showSuccessMessage(response.data?.message);
      }
    } catch (error: any) {
      ErrorManager.show(error.response.data.error || 'Greška pri brisanju komponente.');
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Box display={'flex'} gap={1} p={1}>
          <Button
            variant={'contained'}
            onClick={openAddComponentDialog}
          >
            Dodaj komponentu
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Ime komponente</TableCell>
              <TableCell>Količina</TableCell>
              <TableCell>Dodeljeno</TableCell>
              <TableCell>Slobodno</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              !!components?.length && components.map((component) => (
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
                  <TableCell>{component.quantity - component.assigned}</TableCell>
                  <TableCell>
                    <IconButton
                      color={'error'}
                      onClick={() => deleteComponent(component)}
                    >
                      <DeleteIcon />
                    </IconButton>
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
