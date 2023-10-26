import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"

const Content = styled.div`
  background-color: ${props => props.backgroundcolor};
  border: ${props => props.border};
  border-bottom: ${props => props.borderbottom};
  box-shadow: ${props => props.boxshadow};
  display: block;
  margin: ${props => props.margin};
  max-width: ${props => props.maxwidth};
  padding: ${props => props.padding ? props.padding : "0"};
  position: relative;
  text-align: ${props => props.textalign};
  word-wrap: normal;
  width: ${props => props.width};
  &.has-border-bottom {
    border-bottom: ${colors.borders.black}};
  }
  &.has-border-top {
    border-top: ${colors.borders.black}};
  }
  h1,h2,h3,h4,h5,h6 {
    margin: 0 0 32px;
    font-weight: 400;
    text-rendering: optimizeLegibility;
    line-height: ${props => props.headinglineheight || "1.3"};
    text-align: ${props => props.headingtextalign};
    font-family: ${props => props.headingfontfamily};
    text-transform: ${props => props.headingtexttransform};
    letter-spacing: ${props => props.headingletterspacing};
  }
  h1 {
    font-size: ${props => props.h1fontsize || "4.209rem"};
    color: ${props => props.h1color || colors.gray.nineHundred};
    font-weight: ${props => props.h1fontweight || "700"};
    margin: ${props => props.h1margin};
  }
  h2 {
    font-size: ${props => props.h2fontsize || "3.157rem"};
    color: ${props => props.h2color || colors.gray.nineHundred};
    font-weight: ${props => props.h2fontweight || "700"};
    margin: ${props => props.h2margin};
  }
  h3 {
    font-size: ${props => props.h3fontsize || "2.369rem"};
    color: ${props => props.h3color || colors.gray.nineHundred};
    font-weight: ${props => props.h3fontweight || "700"};
    margin: ${props => props.h3margin};
  }
  h4 {
    font-size: ${props => props.h4fontsize || "1.777rem"};
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
    font-size: ${props => props.h5fontsize || "1rem"};
    font-weight: ${props => props.h5fontweight || "700"};
    font-family: ${fonts.secondary};
    margin: ${props => props.h5margin};
  }
  ul {
    padding-left: 1.125rem;
  }
  li {
    margin: ${props => props.limargin || "4px 0"};
    font-size: ${props => props.lifontsize || "1rem"};
    color: ${props => props.licolor};
  }
  p {
    color: ${props => props.paragraphcolor || colors.gray.nineHundred};
    font-size: ${props => props.paragraphfontsize || "1rem"};
    font-family: ${props => props.paragraphfontfamily};
    font-weight: ${props => props.paragraphfontweight};
    line-height: ${props => props.paragraphlineheight || "1.75"};
    text-align: ${props => props.paragraphtextalign};
    text-transform: ${props => props.paragraphtexttransform};
    margin-bottom: ${props => props.paragraphmargin};
    &:not(:last-child) {
      margin-bottom: ${props => props.paragraphmarginbottom || "16px"};
    }
  }
  small {
    color: ${props => props.smallcolor || colors.gray.sixHundred};
    font-size: ${props => props.smallfontsize || "0.75rem"};
    font-family: ${props => props.smallfontfamily};
    line-height: 1.5;
    display: block;
    margin: ${props => props.smallmargin || "8px 0"};
  }
  a {
    color: ${props => props.linkcolor};
    font-size: ${props => props.linkfontsize};
    font-family: ${props => props.linkfontfamily};
    text-decoration: ${props => props.linktextdecoration};
    &:hover {
      cursor: pointer;
      color: ${props => props.linkhovercolor};
    }
  }
  blockquote {
    font-size: ${props => props.blockquotefontsize};
  }
`

export default Content
