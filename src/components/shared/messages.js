
let openSnackbar = false;
let snackbarMessage = '';

export const getSnackbarState = () => ({
  openSnackbar,
  snackbarMessage,
});

export const setSnackbarState = (open, message) => {
  openSnackbar = open;
  snackbarMessage = message;
};
