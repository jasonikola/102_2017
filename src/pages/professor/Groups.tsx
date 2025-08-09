import {
  Button, MenuItem,
  Paper, Select, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from "@mui/material";
import React, { useEffect } from "react";
import axios from "axios";
import FormInput from "../../components/FormInput";
import ApiService from "../../ApiService";
import GroupComponents from "../../dialogs/GroupComponents";

function Groups() {
  const [newGroup, setNewGroup] = React.useState('');
  const [groups, setGroups] = React.useState<any[]>([]);
  const [themes, setThemes] = React.useState<any[]>([]);
  const [selectedThemes, setSelectedThemes] = React.useState<any[]>([]);
  const [componentsDialogOpen, setComponentsDialogOpen] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState<any>();
  const noTheme = 'Bez teme';

  useEffect(() => {
    getGroups().then((groups: any) => {
      const newThemes: any[] = [];
      setGroups(groups);
      groups?.forEach((group: any) => {
        newThemes.push(group.theme ? group.theme : noTheme);
      });
      setSelectedThemes(newThemes);
    });
    getThemes().then((themes: any) => {
      setThemes(themes);
    });
  }, []);

  const getGroups = async () => {
    try {
      return await ApiService.getGroups();
    } catch (e) {
      console.log(e);
      //  TODO warning
    }
  }

  const getThemes = async () => {
    try {
      return await ApiService.getThemes();
    } catch (e) {
      console.log(e);
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

  const handleThemeChange = (index: number, themeName: string, groupName: string) => {
    const updatedSelectedThemes = [...selectedThemes];
    updatedSelectedThemes[index] = themeName;
    setSelectedThemes(updatedSelectedThemes);

    const updatedThemes = themes?.map((theme: any) => {
      if (theme.name === themeName) {
        theme.group = groupName;
      }
      return theme;
    });
    setThemes(updatedThemes);

    updateGroupTheme(groupName, themeName);
  }

  const updateGroupTheme = async (groupName: string, themeName: string) => {
    try {
      const response = await axios.post('/groups/assignTheme',
        { groupName, themeName: themeName !== noTheme ? themeName : '' },
        {
          headers: { 'Content-Type': 'application/json' }
        });
      if (response.status !== 200) {
        // TODO add some warning
      }
    } catch (e: any) {
      console.log(e);
      // TODO warning
    }
  }

  const openComponentsDialog = (group: any) => {
    setSelectedGroup(group);
    setComponentsDialogOpen(true);
  }

  const selectThemeComponent = (group: any, index: number) => {
    return <Select
      value={group.theme || noTheme}
      onChange={(e: any) => handleThemeChange(index, e.target.value, group.name)}
      fullWidth
      displayEmpty
    >
      <MenuItem value={noTheme}>{noTheme}</MenuItem>
      {themes?.map((theme: any) => (
        <MenuItem
          key={`menuItem${theme.name}`}
          value={theme.name}
          disabled={!!theme.group && group.name !== theme.group}
        >
          {theme.name}
        </MenuItem>
      ))}
    </Select>
  };

  const onCloseGroupComponentsDialog = (group: any) => {
    setSelectedGroup(null);
    setComponentsDialogOpen(false);

    if (group) {
      const updatedGroups: any[] = groups.map((g: any) => {
        if (group._id === g._id) {
          return group;
        } else {
          return g;
        }
      });
      setGroups(updatedGroups);
    }
  }

  const componentsButtonComponent = (group: any) => {
    return <Button
      variant={'text'}
      onClick={() => {
        openComponentsDialog(group);
      }}
    >
      Komponente: {group?.components?.length || 0}
    </Button>
  };

  return (
    <>
      <TableContainer component={Paper}>
        <FormInput
          onSubmit={onSubmitHandler}
          onChange={(e) => setNewGroup(e.target.value)}
          onClick={onSubmitHandler}
          value={newGroup}
          disabled={disableButton()}
          title={'Dodaj novu grupu'}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ime grupe</TableCell>
              <TableCell>Clanovi</TableCell>
              <TableCell>Tema za seminarski</TableCell>
              <TableCell>Komponente</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!groups?.length && groups.map((group: any, index: number) => (
              !!group.members.length ? group.members.map((member: any, memberIndex: number) => {
                const rowSpan = group.members.length;
                const firstRow = memberIndex === 0;
                return (
                  <TableRow key={`tableRow${group.name}${member}`}>
                    {firstRow && (
                      <TableCell rowSpan={rowSpan}>
                        {group.name}
                      </TableCell>
                    )}

                    <TableCell>
                      {member}
                    </TableCell>
                    {firstRow && (
                      <>
                        <TableCell rowSpan={rowSpan}>
                          {selectThemeComponent(group, index)}
                        </TableCell>
                        <TableCell rowSpan={rowSpan}>
                          {componentsButtonComponent(group)}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                )
              }) : (
                // There is no members
                <TableRow key={`noMembers-${group.name}`}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>Grupa nema clanova</TableCell>
                  <TableCell>
                    {selectThemeComponent(group, index)}
                  </TableCell>
                  <TableCell>
                    {componentsButtonComponent(group)}
                  </TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <GroupComponents
        open={componentsDialogOpen}
        onClose={onCloseGroupComponentsDialog}
        group={selectedGroup}
      />
    </>
  );
}

export default Groups;
