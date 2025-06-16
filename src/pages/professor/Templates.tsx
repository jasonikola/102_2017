import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import AddTemplate from "../../dialogs/AddTemplate";
import axios from "axios";
import ApiService from "../../ApiService";

function Templates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [templateToEdit, setTemplateToEdit] = useState<any>(null);
  const [addTemplateOpen, setAddTemplateOpen] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getTemplates().then((templates: any) => setTemplates(templates));
  }, []);

  const getTemplates = async () => {
    try {
      return await ApiService.getTemplates();
    } catch (e) {
      // TODO
      console.error(e);
    }
  }

  const openAddTemplateDialog = () => {
    setAddTemplateOpen(true);
  }

  const closeAndRefresh = (template: any) => {
    // TODO add added template
    setAddTemplateOpen(false);
    let updatedTemplates = [...templates];
    if (templateToEdit) {
      updatedTemplates = updatedTemplates?.map((t: any) => {
        if (template._id === t._id) {
          t.name = template.name;
          t.components = template.components;
        }
        return t;
      });
      setTemplateToEdit(null);
    } else {
      updatedTemplates = [template, ...templates];
    }
    setTemplates(updatedTemplates);
  }

  const closeAddTemplate = () => {
    setAddTemplateOpen(false);
    if (templateToEdit) {
      setTemplateToEdit(null);
    }
  }

  const editTemplate = (template: any) => {
    setTemplateToEdit(template);
    setAddTemplateOpen(true);
  }

  const deleteTemplate = async (template: any) => {
    try {
      const response = await axios.delete(`/templates/delete/${template._id}`);
      if (response.status === 200) {
        const updatedTemplates = templates.filter((t: any) => t._id !== template._id);
        setTemplates(updatedTemplates);
      }
    } catch (e) {
      // TODO
      console.error(e);
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Button variant={'contained'} onClick={openAddTemplateDialog}>
          Dodaj sablon
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ime sablona</TableCell>
              <TableCell>Komponente</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!templates?.length && templates?.map((template: any) => (
              !!template?.components?.length && template?.components?.map((component: any, index: number) => (
                <TableRow key={`template-${template._id}-component-${index}`}>
                  {index === 0 && (
                    <TableCell rowSpan={template.components.length}>
                      {template.name}
                    </TableCell>
                  )}

                  <TableCell>
                    <img
                      src={`${API_URL}/${component.image}`}
                      alt={component.name}
                      width={40}
                      height={40}
                      style={{ borderRadius: 4, objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell>
                    {component.name}
                  </TableCell>
                  <TableCell>
                    {component.quantity ?? '-'}
                  </TableCell>
                  {index === 0 && (
                    <TableCell rowSpan={template.components.length}>
                      <Box display={'flex'} flexDirection={'column'} gap={1}>
                        <Button
                          variant={'text'}
                          onClick={() => editTemplate(template)}
                        >
                          Izmeni
                        </Button>
                        <Button
                          variant={'text'}
                          color={'error'}
                          onClick={() => deleteTemplate(template)}
                        >
                          Obriši
                        </Button>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddTemplate
        open={addTemplateOpen}
        onClose={closeAddTemplate}
        closeAndRefresh={closeAndRefresh}
        template={templateToEdit}
      />
    </>
  );
}

export default Templates;
