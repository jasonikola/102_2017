import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton
} from "@mui/material";
import React, { useEffect } from "react";
import ApiService from "../ApiService";
import DeleteIcon from '@mui/icons-material/Delete';
import { ErrorManager } from "../utils/ErrorManager";
import api from "../services/api";

interface GroupComponentsProps {
  open: boolean;
  onClose: (group: any) => void;
  group: any;
}

const GroupComponents: React.FC<GroupComponentsProps> = (props: GroupComponentsProps) => {
  const [components, setComponents] = React.useState<any[]>([]);
  const [allComponents, setAllComponents] = React.useState<any[]>([]);
  const [templates, setTemplates] = React.useState<any[]>([]);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = React.useState(-1);
  const [returnValue, setReturnValue] = React.useState<any>(null);
  const [addComponentButton, setAddComponentButton] = React.useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const { group } = props;
    if (!allComponents?.length) {
      getComponents().then((components: any[]) => {
        const newComponents = components?.map((component: any) => {
          return {
            name: component.name,
            quantity: 1,
            totalQuantity: component.quantity,
            _id: component._id,
            image: component.image,
            assigned: component.assigned
          }
        });
        setAllComponents(newComponents)
      });
    }
    if (!templates?.length) {
      getTemplates().then((templates: any) => {
        const newTemplates = templates?.map((template: any) => ({
          name: template.name,
          _id: template._id,
          components: template.components,
        }));
        setTemplates(newTemplates)
      });
    }

    if (group?.components?.length) {
      const updatedComponents = group.components.map((component: any) => {
        const globalComponent = allComponents.find((c: any) => c._id.toString() === component._id.toString());
        return {
          ...component,
          totalQuantity: globalComponent?.totalQuantity || 0,
          assigned: globalComponent?.assigned || 0,
          maxQuantity: globalComponent?.totalQuantity - globalComponent.assigned + component.quantity
        }
      });
      setComponents(updatedComponents);
    }
  }, [props.open]);

  const getComponents = async () => {
    try {
      return await ApiService.getComponents();
    } catch (error: any) {
      ErrorManager.show(error.response.data.error);
    }
  };

  const getTemplates = async () => {
    try {
      return await ApiService.getTemplates();
    } catch (error: any) {
      ErrorManager.show(error.response.data.error);
    }
  }

  const handleTemplateButtonClick = (index: number) => {
    const newValue = selectedTemplateIndex !== index;
    if (newValue && index !== -1) {
      const { components } = templates[index];
      const updatedComponents = components.map((component: any) => {
        const globalComponent = allComponents.find((c: any) => c._id.toString() === component._id.toString());
        return {
          name: component.name,
          quantity: 1,
          _id: component._id,
          image: component.image,
          totalQuantity: globalComponent.totalQuantity,
          assigned: globalComponent.assigned,
          maxQuantity: globalComponent.totalQuantity - globalComponent.assigned,
        }
      });
      setComponents(updatedComponents);
      setAddComponentButton(true);
    }

    setSelectedTemplateIndex(() => (newValue ? index : -1));
  }

  const handleQuantityChange = (index: number, value: string, maxAvailable: number) => {
    const updatedComponents = [...components];
    if (value === '') {
      updatedComponents[index].quantity = value;
      setComponents(updatedComponents);
    } else {
      let newValue = parseInt(value);
      if (newValue < 0 || isNaN(newValue)) {
        newValue = 0;
      } else if (newValue > maxAvailable) {
        newValue = maxAvailable;
      }
      updatedComponents[index].quantity = newValue;
      setComponents(updatedComponents);
    }
  }

  const assignComponents = async () => {
    const { group } = props;

    const data = {
      _id: group._id,
      components: components.filter((c: any) => c.quantity > 0)
    };
    const members = group.members;

    try {
      const response = await api.post('/groups/assignComponents', data);
      if (response?.status === 200 && response.data) {
        setReturnValue({ ...response.data, members });
      }
    } catch (error: any) {
      ErrorManager.show(error.response.data.error);
    }
  }

  const closeDialog = () => {
    resetValues();
    props.onClose(returnValue);
  }

  const disableSaveButton = () => {
    if (props.group?.components.length && !components.length) {
      return false;
    } else {
      return !components?.length || components.some((component) => !component.quantity || !component.maxQuantity);
    }
  }

  const resetValues = () => {
    const updatedTemplates = templates.map((template) => ({
      ...template
    }));

    setComponents([]);
    setAllComponents([]);
    setTemplates(updatedTemplates);
    setSelectedTemplateIndex(-1);
    setReturnValue(null);
    setAddComponentButton(true);
  }

  const remainingComponents = allComponents?.filter(ac =>
    !components.some(c => c._id.toString() === ac._id.toString())
  );

  const addComponent = (component: any) => {
    setAddComponentButton(true);
    setSelectedTemplateIndex(-1);
    const updatedComponents = [...components, {
      name: component.name,
      quantity: 1,
      _id: component._id,
      image: component.image,
      totalQuantity: component.totalQuantity,
      assigned: component.assigned,
      maxQuantity: component.totalQuantity - component.assigned,
    }];
    setComponents(updatedComponents);
  };

  const deleteComponent = (component: any) => {
    const updatedComponents = components.filter((c: any) => c._id.toString() !== component._id.toString());
    setComponents(updatedComponents);
    setSelectedTemplateIndex(-1);
  }

  return <Dialog open={props.open} onClose={props.onClose}>
    <DialogTitle>{props.group?.name || 'Grupa'} komponente</DialogTitle>
    <DialogContent>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        <Typography variant={'subtitle1'}>
          Sabloni
        </Typography>
        {!!templates?.length && (
          <Box display="flex" flexWrap="wrap" gap={1}>
            {templates?.map((template: any, index: number) => (
              <Button
                key={template.name}
                variant={selectedTemplateIndex === index ? 'contained' : 'outlined'}
                color={selectedTemplateIndex === index ? 'primary' : 'inherit'}
                onClick={() => handleTemplateButtonClick(index)}
                sx={{
                  flex: '0 0 auto',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  paddingX: 2,
                }}
              >
                {template.name}
              </Button>
            ))}
          </Box>
        )}
        <Typography variant={'subtitle1'}>
          Komponente
        </Typography>
        {!!components?.length &&
          components.map((component: any, index: number) => {
            return (
              <Box
                key={component.name}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
                gap={2}
              >
                <Box display={'flex'} flexWrap={'wrap'} alignItems={'center'} gap={2} flex={1} minWidth={0}>
                  <img
                    src={`${API_URL}/${component.image}`}
                    alt={component.name}
                    width={60}
                    height={60}
                    style={{ borderRadius: 4, objectFit: 'cover' }}
                  />
                  <Typography
                    sx={{
                      flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      lineHeight: 1.5,
                    }}
                  >
                    {component.name}
                  </Typography>
                </Box>
                <TextField
                  type={'number'}
                  label={'Količina'}
                  size={'small'}
                  value={component.quantity}
                  onChange={(event: any) => handleQuantityChange(index, event.target.value, component.maxQuantity)}
                  sx={{ width: '100px' }}
                />
                <Typography
                  noWrap
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '80px',
                    flex: 1
                  }}
                >
                  Max: {component.maxQuantity}
                </Typography>
                <IconButton
                  color={'primary'}
                  onClick={() => deleteComponent(component)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )
          })
        }
        {
          (addComponentButton && remainingComponents?.length) ?
            <Box display={ 'flex'}>
              <Button variant={'contained'} onClick={() => setAddComponentButton(false)}>
                Dodaj komponentu
              </Button>
            </Box>
            :
            <Box display="flex" flexWrap="wrap" gap={2}>
              {
                remainingComponents?.map((component: any) => (
                  <Button
                    onClick={() => addComponent(component)}
                    disabled={component.totalQuantity - component.assigned === 0}
                    sx={{
                      position: 'relative',
                      width: 120,
                      height: 120,
                      padding: 0,
                      overflow: 'hidden',
                      borderRadius: 2,
                    }}
                  >
                    <img
                      src={`${API_URL}/${component.image}`}
                      alt={component.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <Box
                      position="absolute"
                      bottom={0}
                      width="100%"
                      bgcolor="rgba(0, 0, 0, 0.6)"
                      color="white"
                      textAlign="center"
                      px={1}
                      py={0.5}
                      fontSize="0.75rem"
                      lineHeight={1.2}
                    >
                      {component.name}
                    </Box>
                  </Button>
                ))}
            </Box>

        }
      </Box>
    </DialogContent>
    <DialogActions>
      <Button
        variant={'contained'}
        onClick={assignComponents}
        disabled={disableSaveButton()}
      >
        Sacuvaj
      </Button>
      <Button
        onClick={closeDialog}
      >
        Zatvori
      </Button>
    </DialogActions>
  </Dialog>

}

export default GroupComponents;
