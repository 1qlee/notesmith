import styled from "styled-components"
import { colors, widths } from "../styles/variables"

const Content = styled.div`
  box-shadow: ${props => props.boxshadow};
  display: block;
  margin: ${props => props.margin};
  max-width: ${props => props.maxwidth};
  padding: ${props => props.padding ? props.padding : "0"};
  width: ${props => props.width};
  @media only screen and (max-width: ${widths.breakpoint.index}) {
    max-width: none;
  }
  &.has-border-bottom {
    border-bottom: 1px solid ${props => props.bordercolor};
  }
  h1,h2,h3,h4,h5,h6 {
    margin: 0 0 1rem;
    font-weight: 700;
    text-rendering: optimizeLegibility;
    line-height: 1.2;
    text-align: ${props => props.headingtextalign};
  }
  h1 {
    font-size: ${props => props.h1fontsize || "4rem"};
    color: ${props => props.h1color || colors.gray.nineHundred};
    font-weight: ${props => props.h1fontweight || "700"};
    margin: ${props => props.h1margin};
    @media only screen and (max-width: ${widths.tablet}) {
      font-size: 2.5rem;
    }
  }
  h2 {
    font-size: ${props => props.h2fontsize || "2rem"};
    color: ${props => props.h2color || colors.gray.nineHundred};
    font-weight: ${props => props.h2fontweight || "700"};
    margin: ${props => props.h2margin};
    @media only screen and (max-width: ${widths.tablet}) {
      font-size: 1.75rem;
    }
  }
  h3 {
    font-size: ${props => props.h3fontsize || "1.5rem"};
    color: ${props => props.h3color || colors.gray.nineHundred};
    font-weight: ${props => props.h3fontweight || "700"};
    margin: ${props => props.h3margin};
    @media only screen and (max-width: ${widths.tablet}) {
      font-size: 1.1rem;
    }
  }
  h4 {
    font-size: ${props => props.h4fontsize || "1rem"};
    color: ${props => props.h4color || colors.gray.nineHundred};
    font-weight: ${props => props.h4fontweight || "700"};
    margin: ${props => props.h4margin};
    &.is-column-heading {
      margin-bottom: 0.5rem;
      position: relative;
      &::after {
        background-color: ${props => props.headingColor || colors.gray.sixHundred};
        content: "";
        height: 1rem;
        left: -1rem;
        position: absolute;
        border-radius: 50% 1rem 100% 1rem;
        bottom: -0.25rem;
        opacity: 0.1;
        width: 100%;
      }
    }
  }
  h5 {
    color: ${props => props.h5color || colors.gray.nineHundred};
    display: block;
    font-family: "Inter", Helvetica, Tahoma, sans-serif;
    font-size: ${props => props.h5fontsize || "1rem"};
    font-weight: ${props => props.h5fontweight || "700"};
    letter-spacing: 1px;
    margin: ${props => props.h5margin};
    text-transform: uppercase;
  }
  ul {
    padding-left: 1.125rem;
  }
  li {
    margin: 0.5rem 0;
    font-size: ${props => props.lifontsize || "1rem"};
  }
  p {
    color: ${props => props.paragraphcolor || colors.gray.eightHundred};
    font-size: ${props => props.paragraphfontsize || "1rem"};
    line-height: ${props => props.paragraphlineheight || "1.5"};
    text-align: ${props => props.paragraphtextalign};
    margin-bottom: ${props => props.paragraphmarginbottom};
    @media only screen and (max-width: ${widths.tablet}) {
      font-size: 1rem;
    }
  }
  small {
    color: ${props => props.smallcolor || colors.gray.sevenHundred};
    font-size: ${props => props.smallfontsize};
    display: block;
    margin: 0.5rem 0;
  }
  a {
    color: ${props => props.linkcolor || colors.link.normal};
    font-size: ${props => props.linkfontsize};
    text-decoration: ${props => props.linktextdecoration};
    &:hover {
      cursor: pointer;
      opacity: 0.7;
    }
  }
`

export default Content
