import React from "react"
import { Grid } from "styled-css-grid"
import PageIcons from "../PageIcons"

function Templatesbar({
  pageData,
  setPageData,
}) {
  return (
    <Grid
      columns="repeat(auto-fit, minmax(60px, 1fr))"
      columnGap="16px"
      rowGap="16px"
    >
      <PageIcons
        checkActiveVar={pageData.template}
        isProductPage={false}
        setData={setPageData}
        data={pageData}
        showLabels={true}
      />
    </Grid>
  )
}

export default Templatesbar