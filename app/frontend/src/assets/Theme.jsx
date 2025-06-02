import { ThemeProvider } from "styled-components";

const theme = {
  colors: {
    // Blues
    primaryBlue: "#004883", // buttons, text
    brightBlue: "#1976d2", // focus outline
    lightNavy: "#e6edf3", // background
    darkNavy: "#01033F", // dark langing page background

    // Yellows
    primaryYellow: "#FFD400",
    paleYellow: "#FFCB46",
    orange: "#358E0E",

    // Neutrals
    white: "#ffffff", // white
    smokeGrey: "#D1CBC5", // light background
    lightGrey: "#F3F3F8", // abi chat background
    grey: "#D0D5DD", // borders
    darkGrey: "#555555", // unselected text
    lightBlack: "#344054", // text
    black: "#101828", // near black, used for text in inputs

    // Reds
    primaryRed: "#dc2626",

    // Greens
    primaryGreen: "#16A34A", // primary success color
    lightGreen: "#D1FAE5", // light green background
    darkGreen: "#065F46", // dark green used for text or dark backgrounds
  },
  gradients: {
    seaGradient: "linear-gradient(to bottom, #04426F,#04003C)",
  },
  boxShadows: {
    small: "0px 0.0625rem 0.125rem 0px rgba(16, 24, 40, 0.13)", // dropdown, buttons
    // card
    medium:
      "0px 0.0625rem 0.125rem 0px rgba(16, 24, 40, 0.13), 0px 0.0625rem 0.1875rem 0px rgba(16, 24, 40, 0.1)",
    large: "0px 0px 1rem 0px #00000014", // questionnaire cards, abichat
    extraLarge:
      "0px 0.125rem 0.25rem 0px rgba(16, 24, 40, 0.13), 0px 0.125rem 0.375rem 0px rgba(16, 24, 40, 0.11), 0px 0px 1.5rem 0px #00000012",
  },
  borderRadius: {
    small: "0.5rem", // dropdown, button, input
    medium: "0.75rem", // switch
    large: "0.9rem", // large buttons, card
    xLarge: "2rem", // large card
    circle: "50%", // switch
  },
  fonts: {
    montserrat: "Montserrat, sans-serif",
    lora: "Lora",
    helvetica: "Helvetica",
    inter: "Inter, sans-serif",
  },
  fontSizes: {
    xsmall: "0.75rem", // 12px
    small: "0.875rem", // 14px
    medium: "1rem", // 16px
    large: "1.125rem", // 18px
    xlarge: "1.25rem", // 20px
    xxlarge: "1.5rem", // 24px
    xxxlarge: "2rem", // 32px
  },
  fontWeights: {
    light: 100,
    normal: 400,
    bold: 500,
    bolder: 600,
  },
  spacings: {
    // when 1rem = 16px
    0: "0rem" /* 0px */,
    1: "0.25rem" /* 4px */,
    2: "0.375rem" /* 6px */,
    3: "0.5rem" /* 8px */,
    4: "0.625rem" /* 10px */,
    5: "0.75rem" /* 12px */,
    6: "0.875rem" /* 14px */,
    7: "1rem" /* 16px */,
    8: "1.25rem" /* 20px */,
    9: "1.5rem" /* 24px */,
    10: "1.75rem" /* 28px */,
    11: "2rem" /* 32px */,
    12: "2.5rem" /* 40px */,
    13: "3rem" /* 48px */,
    14: "4rem" /* 64px */,
    15: "5rem" /* 80px */,
  },
  transitions: {
    all: "all 300ms cubic-bezier(0.32, 0.72, 0, 1);",
  },
  util: {
    maxWidth: "1440px",
  },
};

export default function Theme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
