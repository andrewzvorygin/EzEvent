import React from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import Description from './Description';

const Stages = () => {
  return <Box mb={5}>
    <Stack direction="row" mb={5}>
      <Stack direction="row"
             sx={{
               border: '1px solid #000000',
               borderRadius: '2px'
             }}
             divider={<Divider orientation="vertical" flexItem />}
             justifyContent="space-between" spacing={3}>
        <Typography p={2} variant={'subtitle1'} sx={{ fontWeight: 'bold' }} align={'center'}>
          1 Этап
        </Typography>
        <Typography p={2} variant={'subtitle1'}>
          Бар Контур
        </Typography>
        <Typography p={2} variant={'subtitle1'}>
          19:00
        </Typography>
      </Stack>
    </Stack>
    <Description />
  </Box>;
};

export default Stages;
