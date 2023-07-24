import React from "react"
import PageIcons from "../PageIcons"

import { ControlsContent } from "../Controls"

function Templatesbar({
  pageData,
  setPageData,
}) {
  return (
    <>
      <ControlsContent>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:"repeat(auto-fit, minmax(60px, 1fr))",
            gap:"16px",
          }}
        >
          <PageIcons
            checkActiveVar={pageData.template}
            isProductPage={false}
            setData={setPageData}
            data={pageData}
            showLabels={true}
          />
        </div>
      </ControlsContent>
    </>
  )
}

export default Templatesbar