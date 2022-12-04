import React from 'react';
import { Avatar, Stack, Typography } from '@mui/material';

const Person = () => {
  return <Stack direction="row" spacing={1} alignItems={'center'}>
    <Avatar alt="Remy Sharp"
            src={'https://sun9-66.userapi.com/impg/gpPdVT_I38wgnrXkvZXoaZRvnAShF_W7ZN2wOA/O7zIGq8XOdM.jpg?size=1620x2160&quality=96&sign=a4ff920a97a4bcd4ee513e3bc7c1a592&type=album'} />
    <Typography fontSize={18}>Шашлыков Васян</Typography>
  </Stack>;
};

export default Person;
