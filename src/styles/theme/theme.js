"use client";

import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#5538f4",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: '0px !important',
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          maxWidth: '800px !important',
          maxHeight: '650px !important',
        }
      }
    }
  },
  typography: {
    fontFamily: [
      'Poppins',
      'sans-serif'
    ].join(','),
  }
});

export const tooltipTheme = createTheme({
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: "0px !important",
          margin: "0px !important",
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: '0px !important',
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: "16px !important",
        }
      }
    }
  }
});

export const cancelButton = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5538f4",
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#e0e0e0 !important",
          boxShadow: "none !important",
          "&:hover": {
            boxShadow: "none !important",
            backgroundColor: "#d5d5d5 !important",
          },
          color: "#000000 !important",
          height: "40px !important",
          fontWeight: "500 !important",
          fontSize: 16,
        },
      },
    },
  },
});

export const activeButton = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5538f4",
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          color: "white !important",
          backgroundColor: "#5538f4 !important",
          boxShadow: "none !important",
          "&:hover": {
            backgroundColor: "#25a19d !important",
            boxShadow: "none !important",
          },
          height: "40px !important",
          fontWeight: "700 !important",
          fontSize: 16,
        },
      },
    },
  },
});


export const inactiveButton = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5538f4",
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          boxShadow: "none !important",
          "&:hover": {
            boxShadow: "none !important",
            backgroundColor: "#25a19d !important",
            color: "#FFFFFF !important"
          },
          color: "#656464 !important",
          backgroundColor: "transparent !important",
          height: "40px !important",
          fontWeight: "700 !important",
          fontSize: 16,
        },
      },
    },
  },
});


export const smallEdit = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5538f4",
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#5538f4 !important",
          boxShadow: "none !important",
          "&:hover": {
            boxShadow: "none !important",
            backgroundColor: "#25a19d !important",
          },
          color: "#FFFFFF !important",
          height: "32px !important",
          width: "32px !important",
          fontWeight: "500 !important",
          fontSize: 16,
          minWidth: "35px !important",
          display: "inherit !important",
        },
      },
    },
  },
});

export const secondaryButton = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5538f4",
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#E5AF5A !important",
          boxShadow: "none !important",
          "&:hover": {
            boxShadow: "none !important",
            backgroundColor: "#D09E52 !important",
          },
          color: "#FFFFFF !important",
          height: "40px !important",
          fontWeight: "500 !important",
          fontSize: 16,
        },
      },
    },
  },
});

export const primaryButton = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5538f4",
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          color: "white !important",
          backgroundColor: "#5538f4 !important",
          boxShadow: "none !important",
          "&:hover": {
            backgroundColor: "#25a19d !important",
            boxShadow: "none !important",
          },
          height: "40px !important",
          fontWeight: "500 !important",
          fontSize: 16,
        },
      },
    },
  },
});

export const closeBtn = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#829191",
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          color: "white !important",
          backgroundColor: "#829191 !important",
          boxShadow: "none !important",
          "&:hover": {
            backgroundColor: "#687676 !important",
            boxShadow: "none !important",
          },
          height: "40px !important",
          fontWeight: "500 !important",
          fontSize: 16,
        },
      },
    },
  },
});