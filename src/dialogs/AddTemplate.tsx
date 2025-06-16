import React, { useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import ApiService from "../ApiService";
import axios from "axios";

interface AddTemplateProps {
  open: boolean;
  onClose: () => void;
  closeAndRefresh: (data: any) => void;
  template?: any;
}

const AddTemplate: React.FC<AddTemplateProps> = (props: AddTemplateProps) => {
  const [name, setName] = React.useState('');
  const [components, setComponents] = React.useState<any[]>([]);
  const isEdit = !!props.template;
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const { template } = props;
    if (isEdit) {
      setName(template.name);
      const updatedComponents = components.map((component: any) => {
        const checkedComponent = template.components.find((checkedComponent: any) => component.name === checkedComponent.name);
        return checkedComponent || component;
      });
      setComponents(updatedComponents);
    } else if (!components.length) {
      getComponents().then((components: any) => {
        const newComponents = components?.map((component: any) => {
          return {
            name: component.name,
            checked: false,
            quantity: 1,
            _id: component._id,
            image: component.image
          }
        });
        setComponents(newComponents)
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

  const addTemplate = async () => {
    const checkedComponents = components.filter((component: any) => component.checked);
    const data = {
      name: name,
      components: checkedComponents
    };
    try {
      const response = await axios.put('/templates/add', data);
      if (response.status === 200 && response.data) {
        resetValues();
        props.closeAndRefresh(response.data);
      }
    } catch (e) {
      console.error(e);
      // TODO add error
    }
  };

  const checkButtonDisable = () => {
    return !name || !components.find((component: any) => component.checked) || components.find((component: any) => component.checked && !component.quantity);
  };

  const closeDialog = () => {
    resetValues();
    props.onClose();
  };

  const resetValues = () => {
    setName('');
    const newComponents = components?.map((component: any) => {
      return {
        _id: null,
        name: component.name,
        quantity: 1,
        image: component.image,
        checked: false
      };
    });
    setComponents(newComponents);
  };

  const handleCheckboxChange = (index: number) => {
    const updatedComponents = [...components];
    updatedComponents[index].checked = !updatedComponents[index].checked;
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

  const editTemplate = async () => {
    const { _id } = props.template;
    const checkedComponents = components.filter((component: any) => component.checked);
    const data = {
      name: name,
      _id: _id,
      components: checkedComponents,
    };
    try {
      const response = await axios.put(`/templates/edit/${_id}`, data);
      if (response.status === 200) {
        resetValues();
        props.closeAndRefresh(response.data);
      }
    } catch (e) {
      console.error(e);
      // TODO dialog
    }
  }

  const submitTemplate = () => {
    if (isEdit) {
      editTemplate();
    } else {
      addTemplate();
    }
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>Dodaj šablon</DialogTitle>
      <DialogContent>
        <Box component={'form'} display={'flex'} flexDirection={'column'} gap={2} mt={1}>
          <Box>
            <Typography variant={'subtitle1'} gutterBottom>
              Ime šablona
            </Typography>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete={'off'}
              fullWidth={true}
              required={true}
            />
          </Box>
          <Box display={'flex'} flexDirection={'column'} gap={2}>
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
                      onChange={() => handleCheckboxChange(index)}
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
                </Box>
              ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={submitTemplate}
          variant={'contained'}
          disabled={checkButtonDisable()}
        >
          {isEdit ? 'Izmeni' : 'Dodaj'}
        </Button>
        <Button onClick={closeDialog} variant={'text'}>
          Zatvori
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTemplate;
