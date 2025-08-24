import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect } from 'react';
import { ErrorManager } from "../utils/ErrorManager";
import api from "../services/api";

interface StudentPointsProps {
  open: boolean;
  onClose: (points: any) => void;
  student?: any
}

const StudentPoints: React.FC<StudentPointsProps> = (props: StudentPointsProps) => {
  const [test1, setTest1] = React.useState<number>(0);
  const [test2, setTest2] = React.useState<number>(0);
  const [reTest1, setReTest1] = React.useState<number>(0);
  const [reTest2, setReTest2] = React.useState<number>(0);
  const [project, setProject] = React.useState<number>(0);
  const [exam, setExam] = React.useState<number>(0);

  const { student } = props;

  useEffect(() => {
    if (student?.points) {
      const { test1, test2, reTest1, reTest2, project, exam } = student?.points;
      setTest1(test1);
      setTest2(test2);
      setReTest1(reTest1);
      setReTest2(reTest2);
      setProject(project);
      setExam(exam);
    }
  }, [props.open]);

  const calculateTotalPoints = (): number => {
    const kol1 = test1 > reTest1 ? test1 : reTest1;
    const kol2 = test2 > reTest2 ? test2 : reTest2;
    return kol1 + kol2 + project + exam;
  };

  const resetValues = () => {
    setTest1(0);
    setTest2(0);
    setReTest1(0);
    setReTest2(0);
    setProject(0);
    setExam(0);
  };

  const closeDialog = () => {
    resetValues();
    props.onClose(getPoints());
  };

  const getPoints = () => {
    return {
      test1,
      test2,
      reTest1,
      reTest2,
      project,
      exam
    }
  }

  const savePoints = async () => {
    const data = {
      studentId: student._id,
      points: getPoints()
    }

    try {
      const response = await api.post('/students/savePoints', data);
      if (response?.status === 200 && response.data) {
        console.log('Success!');
      }
    } catch (error: any) {
      ErrorManager.show(error.response.data.error);
    }
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth={'lg'} fullWidth={true}>
      {student && <DialogTitle>{`Poeni ${student.firstName} ${student.lastName}`}</DialogTitle>}
      {
        student && <DialogContent>
          <Box display={'flex'} flexDirection={'row'} gap={2} mt={1} flexWrap={'wrap'}>
            <TextField
              label={'1. kolokvijum'}
              type={'number'}
              inputProps={{ min: 0, max: 30 }}
              value={test1}
              onChange={(e) => setTest1(Number(e.target.value))}
              fullWidth={false}
              sx={{ width: 120 }}
            />

            <TextField
              label={'2. kolokvijum'}
              type={'number'}
              inputProps={{ min: 0, max: 30 }}
              value={test2}
              onChange={(e) => setTest2(Number(e.target.value))}
              fullWidth={false}
              sx={{ width: 120 }}
            />

            <TextField
              label={'1. popravni'}
              type={'number'}
              inputProps={{ min: 0, max: 30 }}
              value={reTest1}
              onChange={(e) => setReTest1(Number(e.target.value))}
              fullWidth={false}
              sx={{ width: 120 }}
            />

            <TextField
              label={'2. popravni'}
              type={'number'}
              inputProps={{ min: 0, max: 30 }}
              value={reTest2}
              onChange={(e) => setReTest2(Number(e.target.value))}
              fullWidth={false}
              sx={{ width: 120 }}
            />

            <TextField
              label={'Seminarski'}
              type={'number'}
              inputProps={{ min: 0, max: 30 }}
              value={project}
              onChange={(e) => setProject(Number(e.target.value))}
              fullWidth={false}
              sx={{ width: 120 }}
            />

            <TextField
              label={'Ispit'}
              type={'number'}
              value={exam}
              onChange={(e) => setExam(Number(e.target.value))}
              fullWidth={false}
              sx={{ width: 120 }}
              inputProps={{ min: 0, max: 30 }}
              // TODO REMOVE inputProps
            />
          </Box>

          <Typography variant={'subtitle1'} mt={3}>
            {'Ukupno '}<strong>{calculateTotalPoints()}</strong>{' poena'}
          </Typography>
        </DialogContent>
      }
      <DialogActions>
        <Button
          onClick={savePoints}
          variant={'contained'}
        >
          {'Sačuvaj'}
        </Button>
        <Button
          onClick={closeDialog}
          variant={'text'}
        >
          {'Zatvori'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentPoints;
