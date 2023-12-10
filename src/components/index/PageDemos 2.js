import React from "react"
import PageDemo1 from "../../assets/index/page-demo-1.svg"
import PageDemo2 from "../../assets/index/page-demo-2.svg"
import PageDemo3 from "../../assets/index/page-demo-3.svg"
import PageDemo4 from "../../assets/index/page-demo-4.svg"
import PageDemo5 from "../../assets/index/page-demo-5.svg"

const PageDemos = ({ currentPage }) => {
  let pageComponent

  switch (currentPage) {
    case 1:
      pageComponent = <PageDemo1 />
      break;
    case 2:
      pageComponent = <PageDemo2 />
      break;
    case 3:
      pageComponent = <PageDemo3 />
      break;
    case 4:
      pageComponent = <PageDemo4 />
      break;
    case 5:
      pageComponent = <PageDemo5 />
      break;
    default:
      pageComponent = <PageDemo1 />
      break;
  }

  return pageComponent
};

export default PageDemos
