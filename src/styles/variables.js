const colors = {
  gray: {
    oneHundred: "#F7FAFC",
    twoHundred: "#EDF2F7",
    threeHundred: "#E2E8F0",
    fourHundred: "#CBD5E0",
    fiveHundred: "#A0AEC0",
    sixHundred: "#718096",
    sevenHundred: "#4A5568",
    eightHundred: "#2D3748",
    nineHundred: "#1A202C"
  },
  primary: {
    oneHundred: "#e9ecec",
    twoHundred: "#a7b4b3",
    threeHundred: "#7b8e8e",
    fourHundred: "#657b7b",
    fiveHundred: "#4f6968",
    sixHundred: "#234342",
    sevenHundred: "#1c3635",
    eightHundred: "#152828",
    nineHundred: "#093737",
    link: "#00847f"
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
  paper: {
    cream: "#F7F5ED"
  },
  white: "#fff",
  cream: "#fffdd0",
  kraft: "#8a5842",
  black: "#000",
  shadow: {
    float: "rgba(0,0,0,0.2)",
    inset: "rgba(0,0,0,0.4)",
    dark: "rgba(0,0,0,0.6)"
  },
  highlighter: "#ffff00"
}

const widths = {
  desktop: "1440px"
}

const spacing = {
  normal: "1rem",
  medium: "2rem",
  large: "3rem",
  section: "6rem"
}

const regex = {
  email: RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: RegExp(/^.{8,256}$/)
}

export { colors, widths, spacing, regex }
