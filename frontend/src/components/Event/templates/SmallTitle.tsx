import React, { FC } from 'react';
import { Typography } from '@mui/material';
import { TypographyProps } from '@mui/material/Typography/Typography';

const SmallTitle: FC<TypographyProps> = ({
  children,
  ...props
}) => {
  return <Typography fontSize={16} color={'#7A7A7A;'} {...props}>{children}</Typography>;
};

export default SmallTitle;
