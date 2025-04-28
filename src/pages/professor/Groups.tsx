import {
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem, ListItemText,
  Paper,
  TableContainer,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect } from "react";
import axios from "axios";

function Groups() {
  const [newGroup, setNewGroup] = React.useState('');
  const [groups, setGroups] = React.useState<any[]>([]);

  useEffect(() => {
    getGroups().then((groups: any) => {
      setGroups(groups);
    });
  }, []);

  const getGroups = async () => {
    try {
      const response = await axios.get('/groups/get');
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {

    }
  }

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    const data = {
      name: newGroup
    }

    try {
      const response = await axios.put('/groups/add', data);
      if (response.status === 200 && response.data) {
        const updatedGroups: any[] = [...groups, response.data];
        setGroups(updatedGroups);
      }
    } catch (e: any) {
      // TODO add some warrning
    }
  }

  const disableButton = () => {
    // TODO add regex
    return newGroup.length === 0;
  }

  return (
    <TableContainer component={Paper}>
      <Box
        component={'form'}
        onSubmit={onSubmitHandler}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
        <TextField
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          placeholder={'Ime grupe'}
          fullWidth
          required
          autoFocus
        />
        <Button
          type={'submit'}
          variant={'contained'}
          fullWidth
          onClick={onSubmitHandler}
          disabled={disableButton()}
          sx={{ minWidth: 'auto', px: 1.5, py: 0.5, fontSize: '0.75rem', maxWidth: '250px' }}
        >
          Dodaj novu grupu
        </Button>
      </Box>
      <Box>
        {
          groups?.map((group: any, index: number) => (
            <Card key={index} sx={{ maxWidth: 400, margin: '20px auto', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {group.name}
                </Typography>
                <List>
                  {group.members?.map((member: any, index: number) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText primary={member} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))
        }
      </Box>
    </TableContainer>
  );
}

export default Groups;
