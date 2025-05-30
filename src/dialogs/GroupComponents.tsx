import {
  Box,
  Button, Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, TextField, Typography
} from "@mui/material";
import React, { useEffect } from "react";
import ApiService from "../ApiService";

interface GroupComponentsProps {
  open: boolean;
  onClose: () => void;
  group: any;
}

const AddStudent: React.FC<GroupComponentsProps> = (props: GroupComponentsProps) => {
  const [components, setComponents] = React.useState<any[]>([]);
  const [templates, setTemplates] = React.useState<any[]>([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!components?.length) {
      getComponents().then((components: any[]) => {
        const newComponents = components?.map((component: any) => {
          return {
            name: component.name,
            checked: false,
            quantity: 1,
            totalQuantity: component.quantity,
            _id: component._id,
            image: component.image,
            assigned: component.assigned
          }
        });
        setComponents(newComponents)
      });
    }
    if (!templates?.length) {
      getTemplates().then((templates: any) => {
        const newTemplates = templates?.map((template: any) => ({
          name: template.name,
          checked: false,
          _id: template._id,
          components: template.components
        }));
        setTemplates(newTemplates)
      });
    }
  }, [props.open]);

  const getComponents = async () => {
    try {
      return await ApiService.getComponents();
    } catch (e: any) {
      console.error(e);
      // TODO add warning dialog
    }
  };

  const getTemplates = async () => {
    try {
      return await ApiService.getTemplates();
    } catch (e) {
      // TODO
      console.error(e);
    }
  }

  const handleComponentCheckboxChange = (index: number) => {
    const updatedComponents = [...components];
    updatedComponents[index].checked = !updatedComponents[index].checked;
    setComponents(updatedComponents);
  }

  const handleTemplateCheckboxChange = (index: number) => {
    const value = !templates[index].checked;
    const updatedTemplates = templates.map((template, i) => ({
      ...template,
      checked: i === index ? !template.checked : false,
    }));
    setTemplates(updatedTemplates);
    let updatedComponents;
    if (value) {
      updatedComponents = components.map((component: any) => {
        const templateComponent = templates[index].components.find((templateC: any) => templateC._id === component._id);
        if (templateComponent) {
          return {
            ...component,
            quantity: templateComponent.quantity,
            checked: true
          }
        } else {
          return {
            ...component,
            quantity: 1,
            checked: false
          }
        }
      });
    } else {
      updatedComponents = components.map((component) => ({
        ...component,
        quantity: 1,
        checked: false
      }));
    }
    setComponents(updatedComponents);
  }

  const handleQuantityChange = (index: number, value: string) => {
    const updatedComponents = [...components];
    if (value === '') {
      updatedComponents[index].quantity = value;
      setComponents(updatedComponents);
    } else {
      let newValue = parseInt(value);
      if (newValue < 0 || isNaN(newValue)) {
        newValue = 0;
      }
      updatedComponents[index].quantity = newValue;
      setComponents(updatedComponents);
    }
  }

  const closeDialog = () => {
    props.onClose();
  }

  return <Dialog open={props.open} onClose={props.onClose}>
    <DialogTitle>{props.group?.name || 'Grupa'} komponente</DialogTitle>
    <DialogContent>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        <Typography variant={'subtitle1'}>
          Sabloni
        </Typography>
        {!!templates?.length && (
          templates.map((template: any, index: number) => (
            <Box
              key={template.name}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Box display={'flex'} alignItems={'center'} gap={2} flex={1} minWidth={0}>
                <Checkbox
                  checked={template.checked}
                  onChange={() => handleTemplateCheckboxChange(index)}
                />
                <Typography
                  noWrap
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '700px',
                    flex: 1
                  }}
                >
                  {template.name}
                </Typography>
              </Box>
            </Box>
          ))
        )}
        <Typography variant={'subtitle1'}>
          Komponente
        </Typography>
        {!!components?.length &&
          components.map((component: any, index: number) => (
            <Box
              key={component.name}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
              gap={2}
            >
              <Box display={'flex'} alignItems={'center'} gap={2} flex={1} minWidth={0}>
                <Checkbox
                  checked={component.checked}
                  onChange={() => handleComponentCheckboxChange(index)}
                />
                <img
                  src={`${API_URL}/${component.image}`}
                  alt={component.name}
                  width={40}
                  height={40}
                  style={{ borderRadius: 4, objectFit: 'cover' }}
                />
                <Typography
                  noWrap
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '700px',
                    flex: 1
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
                onChange={(event: any) => handleQuantityChange(index, event.target.value)}
                sx={{ width: '100px' }}
                disabled={!component.checked}
              />
              <Typography
                noWrap
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '700px',
                  flex: 1,
                  color: component.quantity > (component.totalQuantity - component.assigned) ? 'red' : 'inherit'
                }}
              >
                Dostupno {component.totalQuantity - component.assigned}
              </Typography>
            </Box>
          ))}
      </Box>
    </DialogContent>
    <DialogActions>
      <Button
        variant={'contained'}
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

export default AddStudent;
