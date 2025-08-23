import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const arduinoFacts: string[] = [
  'Arduino je open-source platforma, što znači da svako može slobodno koristiti i menjati njegov hardver i softver.',
  'Prvi Arduino je napravljen 2005. godine u Italiji, u gradu Ivrea.',
  'Naziv \'Arduino\' potiče od bara \'Bar di Re Arduino\' u Ivrei, gde su se osnivači okupljali.',
  'Arduino je napravljen tako da bude jednostavan za početnike, sa programiranjem baziranim na C/C++.',
  'Arduino se koristi u raznim oblastima – od robotike i IoT projekata do umetnosti i edukacije.',
  'Postoje različite vrste Arduino ploča, kao što su Uno, Mega, Nano i Leonardo.',
  'Arduino može da se poveže sa raznim uređajima, uključujući senzore, motore, ekrane i LED diode.',
  'Postoji ogromna zajednica korisnika Arduina širom sveta, koja deli tutorijale, biblioteke i projekte.',
  'Arduino ploče su povoljne u poređenju sa mnogim drugim razvojnim platformama.',
  'Arduino je poslužio kao inspiracija za mnoge druge mikrokontrolerske ploče.'
];

const ArduinoFact: React.FC = () => {
  const [fact, setFact] = useState<string>('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * arduinoFacts.length);
    setFact(arduinoFacts[randomIndex]);
  }, []);

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      height={'100vh'}
      textAlign={'center'}
      px={2}
    >
      <Typography
        variant={'h5'}
        fontStyle={'italic'}
        fontFamily={'Georgia, serif'}
        color={'primary'}
      >
        {fact}
      </Typography>
    </Box>
  );
};

export default ArduinoFact;
