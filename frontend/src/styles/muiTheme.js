import createTheme from "@mui/material/styles/createTheme";

import themeFile from "./theme.json";

const baseTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 1280, // small laptop
      md: 1440, // desktop
      lg: 1920 // large screens
    }
  }
});

const theme = createTheme(baseTheme, {
  palette: {
    primary: {
      main: themeFile.colors.primary
    },
    secondary: {
      main: themeFile.colors.secondary1,
      dark: themeFile.colors.secondary3,
      light: themeFile.colors.secondary2
    },
    error: {
      main: themeFile.colors.statusError
    },
    success: {
      main: themeFile.colors.statusSuccess
    },
    warning: {
      main: themeFile.colors.statusInProgress
    },
    info: {
      main: themeFile.colors.neutral2,
      light: themeFile.colors.neutral3,
      dark: themeFile.colors.neutral1
    },
    progressBar: {
      main: themeFile.colors.progressBar
    },
    mode: themeFile.mode
  },
  typography: {
    fontFamily: themeFile.font.fontFamilies.fontFamily1,
    button: {
      textTransform: "none"
    },
    h1: {
      fontSize: themeFile.font.fontSizes.heading1
    },
    h2: {
      fontSize: themeFile.font.fontSizes.heading2
    },
    h3: {
      fontSize: themeFile.font.fontSizes.heading3,
      fontWeight: 600
    },
    h4: {
      fontSize: themeFile.font.fontSizes["2xl"]
    },
    h5: {
      fontSize: themeFile.font.fontSizes.xl
    },
    h6: {
      fontSize: themeFile.font.fontSizes.l
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: themeFile.font.fontSizes.l,
          minWidth: themeFile.button.dimensions.widthBasic,
          minHeight: themeFile.button.dimensions.heightBasic
        },
        outlinedPrimary: {
          backgroundColor: themeFile.colors.white,
          borderRadius: themeFile.button.dimensions.radius,
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: themeFile.colors.primary,
          fontWeight: themeFile.font.fontWeights.bold
        },
        containedPrimary: {
          borderRadius: themeFile.button.dimensions.radius
        }
      }
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: themeFile.colors.black,
          borderTopStyle: themeFile.borderType.DASHED
        }
      }
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          "color": themeFile.colors.black,
          "fontFamily": themeFile.font.fontFamilies.fontFamily2,
          "fontSize": themeFile.font.fontSizes.base,
          "fontWeight": themeFile.font.fontWeights.bold,
          "&.Mui-active": {
            fontWeight: themeFile.font.fontWeights.bold
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: themeFile.colors.secondary2
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          "fontSize": themeFile.font.fontSizes.l,
          "&:first-of-type": {
            paddingLeft: 0
          }
        },
        head: {
          fontWeight: themeFile.font.fontWeights.bold
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: themeFile.input.background
        },
        input: {
          backgroundColor: themeFile.colors.neutral3
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          paddingTop: themeFile.input.dimensions.paddingSmY,
          paddingBottom: themeFile.input.dimensions.paddingSmY,
          [baseTheme.breakpoints.up("md")]: {
            paddingTop: themeFile.input.dimensions.paddingMdY,
            paddingBottom: themeFile.input.dimensions.paddingMdY
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          ".select-placeholder": {
            color: themeFile.select.placeholderColor
          }
        }
      }
    },
    MuiList: {
      defaultProps: {
        sx: {
          maxHeight: "200px"
        }
      }
    },
    MuiMenuItem: {
      defaultProps: {
        sx: {
          minHeight: "1rem",
          paddingY: 0
        }
      }
    },
    MuiDialog: {
      defaultProps: {
        PaperProps: {
          sx: {
            borderRadius: "1rem"
          }
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: themeFile.divider.borderColor
        }
      }
    }
  }
});

export default theme;
