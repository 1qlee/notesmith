import React from "react"
import { colors } from "../../../styles/variables"
import { Grid } from "styled-css-grid"
import PageIcons from "../PageIcons"

import { ControlsContent, ControlsFooter } from "../Controls"
import Button from "../../ui/Button"

function Templatesbar({
  pageData,
  setPageData,
  handleApplyTemplateButton,
}) {
  return (
    <>
      <ControlsContent>
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
      </ControlsContent>
      <ControlsFooter>
        <Button
          backgroundcolor={colors.gray.nineHundred}
          color={colors.gray.oneHundred}
          padding="16px"
          width="100%"
          disabled={!pageData.template}
          onClick={() => handleApplyTemplateButton()}
        >
          Apply template
        </Button>
      </ControlsFooter>
    </>
  )
}

export default Templatesbar