import {
  Button, createTheme, IconButton, styled,
} from '@mui/material';

export const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat',
    h1: {
      fontSize: '2.8125rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 800,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
  },
});

export const StyledButton = styled(Button)(() => ({
  borderColor: theme.palette.grey[900],
  color: theme.palette.grey[900],
  ':hover': {
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.grey[900],
    color: theme.palette.grey[900],
  },
}));

export const StyledIconButton = styled(IconButton)(() => ({
  borderColor: theme.palette.grey[900],
  color: theme.palette.grey[900],
  ':hover': {
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.grey[900],
    color: theme.palette.grey[900],
  },
}));
