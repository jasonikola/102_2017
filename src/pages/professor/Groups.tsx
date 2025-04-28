import {
  Box,
  Card,
  CardContent,
  List,
  ListItem, ListItemText,
  Paper,
  TableContainer,
  Typography
} from "@mui/material";
import React, { useEffect } from "react";
import axios from "axios";
import FormInput from "../../components/FormInput";

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
      // TODO
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
      // TODO add some warning
    }
  }

  const disableButton = () => {
    // TODO add regex
    return newGroup.length === 0;
  }

  return (
    <TableContainer component={Paper}>
      <FormInput
        onSubmit={onSubmitHandler}
        onChange={(e) => setNewGroup(e.target.value)}
        onClick={onSubmitHandler}
        value={newGroup}
        disabled={disableButton()}
        title={'Dodaj novu grupu'}
      />
      <Box>
        {
          groups?.map((group: any) => (
            <Card key={`card${group.name}`} sx={{ maxWidth: 400, margin: '20px auto', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {group.name}
                </Typography>
                <List>
                  {group.members?.map((member: any) => (
                    <ListItem key={`listItem${group.name}-${member}`} disablePadding>
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
