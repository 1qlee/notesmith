const colors = {
  gray: {
    oneHundred: "#F5F5F5",
    twoHundred: "#EEEEEE",
    threeHundred: "#E0E0E0",
    fourHundred: "#BDBDBD",
    fiveHundred: "#9E9E9E",
    sixHundred: "#757575",
    sevenHundred: "#616161",
    eightHundred: "#424242",
    eightHundredFifty: "#2f2f2c",
    nineHundred: "#212121"
  },
  primary: {
    hover: "#e4f1e4",
    active: "#bcdcbc",
    white: "#eef6f6",
    whiteLight: "#cde5e4",
    oneHundred: "#e9ecec",
    twoHundred: "#a7b4b3",
    threeHundred: "#7b8e8e",
    fourHundred: "#657b7b",
    fiveHundred: "#4f6968",
    sixHundred: "#234342",
    sevenHundred: "#1c3635",
    eightHundred: "#152828",
    nineHundred: "#093737"
  },
  blue: {
    oneHundred: "#d1e3fa",
    twoHundred: "#bad5f8",
    threeHundred: "#a3c7f6",
    fourHundred: "#76abf1",
    fiveHundred: "#488fed",
    sixHundred: "#1a73e8",
    sevenHundred: "#155cba",
    eightHundred: "#10458b",
    nineHundred: "#0a2e5d"
  },
  red: {
    oneHundred: "#FFF5F5",
    twoHundred: "#FED7D7",
    threeHundred: "#FEB2B2",
    fourHundred: "#FC8181",
    fiveHundred: "#F56565",
    sixHundred: "#E53E3E",
    sevenHundred: "#C53030",
    eightHundred: "#9B2C2C",
    nineHundred: "#742A2A"
  },
  green: {
    oneHundred: "#F0FFF4",
    twoHundred: "#C6F6D5",
    threeHundred: "#9AE6B4",
    fourHundred: "#68D391",
    fiveHundred: "#48BB78",
    sixHundred: "#38A169",
    sevenHundred: "#2F855A",
    eightHundred: "#276749",
    nineHundred: "#22543D"
  },
  purple: {
    oneHundred: "#FAF5FF",
    twoHundred: "#E9D8FD",
    threeHundred: "#D6BCFA",
    fourHundred: "#B794F4",
    fiveHundred: "#9F7AEA",
    sixHundred: "#805AD5",
    sevenHundred: "#6B46C1",
    eightHundred: "#553C9A",
    nineHundred: "#44337A"
  },
  yellow: {
    oneHundred: "#FEF3C7",
    twoHundred: "#FDE68A",
    threeHundred: "#FCD34D",
    fourHundred: "#FBBF24",
    fiveHundred: "#F59E0B",
    sixHundred: "#D97706",
    sevenHundred: "#B45309",
    eightHundred: "#92400E",
    nineHundred: "#78350F"
  },
  paper: {
    offWhite: "#F7F5ED",
    cream: "#fffee5"
  },
  link: {
    normal: "#00706c",
    hover: "#011f1e"
  },
  white: "#fff",
  kraft: "#8a5842",
  black: "#000",
  shadow: {
    float: "rgba(0,0,0,0.2)",
    inset: "rgba(0,0,0,0.4)",
    dark: "rgba(0,0,0,0.6)",
    modal: "0 7px 14px 0 rgba(60,66,87,.08), 0 3px 6px 0 rgba(0,0,0,.12)"
  },
  highlighter: "#ffff00"
}

const widths = {
  sidebar: "300px",
  modal: "480px",
  tablet: "800px",
  desktop: "1440px",
  content: {
    index: "600px"
  },
  breakpoint: {
    index: "936px"
  }
}

const spacing = {
  normal: "1rem",
  medium: "2rem",
  large: "3rem",
  section: "8rem"
}

const regex = {
  email: RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: RegExp(/^.{8,256}$/)
}

const convertToMM = pixels => {
  return pixels * .264583
}

const convertToPx = mm => {
  return mm * 3.7795275591
}

export { colors, widths, spacing, regex, convertToMM, convertToPx }
