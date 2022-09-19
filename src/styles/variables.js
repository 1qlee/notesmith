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
    shadow: "rgba(74,100,98,0.35)",
    hover: "#EBEEEE",
    active: "#d0dddd",
    white: "#eef6f6",
    whiteLight: "#cde5e4",
    oneHundred: "#dde4e3",
    twoHundred: "#7C8F8E",
    threeHundred: "#607675",
    fourHundred: "#4A6462",
    fiveHundred: "#33504F",
    sixHundred: "#22403F",
    sevenHundred: "#1c3635",
    eightHundred: "#192f2f",
    nineHundred: "#152828"
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
    solidTiny: "1px 1px 0 #212121",
    solidSmall: "2px 2px 0 #212121",
    solid: "4px 4px 0 #212121",
    float: "rgba(0,0,0,0.07)",
    layeredSmall: "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.03), 0 4px 4px rgba(0,0,0,0.06), 0 8px 8px rgba(0,0,0,0.07)",
    layered: "0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.03), 0 8px 8px rgba(0,0,0,0.06), 0 16px 16px rgba(0,0,0,0.07)",
    layeredLarge: "0 12px 12px rgba(0,0,0,0.02), 0 24px 24px rgba(0,0,0,0.03), 0 48px 48px rgba(0,0,0,0.06), 0 96px 96px rgba(0,0,0,0.07)",
    inset: "rgba(0,0,0,0.4)",
    dark: "rgba(0,0,0,0.6)",
    modal: "0 2px 12px rgba(0,0,0,0.25)",
    focus: "0 0 0 2px #212121, inset 1px 1px 0px 0px #fff, inset 1px -1px 0px 0px #fff, inset -1px -1px 0px 0px #fff, inset -1px 1px 0px 0px #fff"
  },
  highlighter: "#d8ff00"
}

const fonts = {
  primary: "'Crimson Pro', Georgia, serif",
  secondary: "'Inter', Helvetica, Tahoma, sans-serif"
}

const widths = {
  logo: "160px",
  sidebar: "300px",
  caption: "300px",
  notification: "450px",
  modal: "480px",
  form: "600px",
  tablet: "800px",
  desktop: "1440px",
  widescreen: "2560px",
  content: {
    index: "440px",
    normal: "700px",
  },
  breakpoint: {
    index: "936px"
  }
}

const spacing = {
  normal: "1rem",
  medium: "2rem",
  large: "3rem",
  xlarge: "6rem",
  section: "8rem",
}

const regex = {
  email: RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: RegExp(/^.{8,256}$/)
}

const convertToDecimal = (num, places) => {

  return ((num * 1.0) / 100).toFixed(places)
}

const convertToMM = pixels => {
  return parseFloat((pixels * .2645833333).toFixed(3))
}

const convertToPx = mm => {
  return parseFloat((mm * 3.7795275591).toFixed(3))
}

const convertFloatFixed = (number, places) => {
  return parseFloat(number.toFixed(places))
}

export { colors, widths, spacing, regex, convertToMM, convertToPx, convertToDecimal, convertFloatFixed, fonts }
