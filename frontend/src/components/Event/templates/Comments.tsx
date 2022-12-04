import React from 'react';
import { Avatar, Box, Stack, TextField, Typography } from '@mui/material';
import SmallTitle from './SmallTitle';

const Comments = () => {
  return <><SmallTitle fontWeight={500} mb={5} color={'black'}>
    Комментарии:
  </SmallTitle>
    <Stack spacing={1.5} mb={5}>
      <Comment />
      <Comment />
      <Comment />
      <Comment />
    </Stack>
    <Box mb={5}>
      <TextField sx={{ borderColor: 'transparent' }}
                 fullWidth label="Введите комментарий"
                 variant="filled" />
    </Box>
  </>;
};

const Comment = () => {
  return <Stack direction="row" spacing={2}>
    <Box paddingTop={0.5}>
      <Avatar alt="Remy Sharp"
              src={'https://sun9-66.userapi.com/impg/gpPdVT_I38wgnrXkvZXoaZRvnAShF_W7ZN2wOA/O7zIGq8XOdM.jpg?size=1620x2160&quality=96&sign=a4ff920a97a4bcd4ee513e3bc7c1a592&type=album'} />
    </Box>
    <Box sx={{
      background: '#F5F6F8',
      borderRadius: '3px',
      width: '100%'
    }} paddingLeft={2} paddingRight={2}
         paddingTop={1}
         paddingBottom={1}>
      <Typography variant={'h4'} fontSize={14}>
        Пользователь 1
      </Typography>
      <Typography variant={'body1'} fontSize={16}>
        Какое классное мероприятие!
      </Typography>
    </Box>
  </Stack>;
};

export default Comments;
