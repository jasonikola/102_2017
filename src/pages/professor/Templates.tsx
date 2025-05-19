import React, { useEffect, useState } from 'react';
import { Button, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import AddTemplate from "../../dialogs/AddTemplate";
import axios from "axios";

function Templates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [addTemplateOpen, setAddTemplateOpen] = useState(false);

  useEffect(() => {
    getTemplates().then((templates: any) => {
      setTemplates(templates)
    });
  }, []);

  const getTemplates = async () => {
    try {
      const response = await axios.get('/templates');
      if (response.status === 200) {
        return response.data;
      }
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
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Button variant={'contained'} onClick={openAddTemplateDialog}>
          Dodaj sablon
        </Button>
        <TableHead>
          <TableRow>
            <TableCell>Ime sablona</TableCell>
            <TableCell>Komponente</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            // TODO add length to every component
            templates.length > 0 && templates.map((template: any) => (
              <TableRow key={`tableRow-${template.id}`}>
                <TableCell>{template.name}</TableCell>
                <TableCell>
                  {template.components.length > 0 && template.components.map((component: any) => (
                    <div key={`tableCell-${component}`}>{component.name}</div>
                  ))}
                </TableCell>
                <TableCell>
                  <Button variant={'text'}>
                    Izmeni
                  </Button>
                  <Button variant={'text'}>
                    Obrisi
                  </Button>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </TableContainer>

      <AddTemplate
        open={addTemplateOpen}
        onClose={() => setAddTemplateOpen(false)}
        closeAndRefresh={closeAndRefresh}
      />
    </>
  );
}

export default Templates;
