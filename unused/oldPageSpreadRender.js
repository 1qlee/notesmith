{selectedPage === 1 ? (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    ref={leftPageRef}
    height={canvasPageHeight}
    width={canvasPageWidth}
    viewBox={`0 0 ${canvasPageWidth} ${canvasPageHeight}`}
    x="0"
    y="0"
  >
    <Holes pageSide="left" />
    <CoverPage
      bookData={bookData}
      canvasPageWidth={canvasPageWidth}
      canvasPageHeight={canvasPageHeight}
    />
  </svg>
) : (
  <>
    {currentPageSide === "left" ? (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="page-background-left"
          width={canvasPageWidth}
          height={canvasPageHeight}
          x="1"
          y="1"
          style={{outline: `1px solid ${colors.primary.sixHundred}`}}
        >
          <rect width={canvasPageWidth} height={canvasPageHeight - 2} fill={colors.white}></rect>
          <Holes pageSide="left" />
        </svg>
        {pageData.template ? (
          <Template
            bookData={bookData}
            currentPageSide={currentPageSide}
            pageData={pageData}
            rightPageXPosition={rightPageXPosition}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
            workingPageHeight={workingPageHeight}
            workingPageWidth={workingPageWidth}
            minimumMargin={minimumMargin}
          />
        ) : (
          <PageSvg
            minimumMargin={minimumMargin}
            pageData={pageData}
            pageRef={leftPageRef}
            pageSide="left"
            pageSvg={canvasPages[selectedPage - 1]}
            rightPageXPosition={rightPageXPosition}
            workingPageHeight={workingPageHeight}
            workingPageWidth={workingPageWidth}
          />
        )}
      </>
    ) : (
      <>
        <svg
          id="page-background-left"
          width={canvasPageWidth}
          height={canvasPageHeight}
          x="1"
          y="1"
        >
          <rect width={canvasPageWidth} height={canvasPageHeight} fill={colors.white}></rect>
          <Holes pageSide="left" />
        </svg>
        <PageSvg
          minimumMargin={minimumMargin}
          pageData={pageData}
          pageRef={leftPageRef}
          pageSide="left"
          pageSvg={canvasPages[selectedPage - 2]}
          workingPageHeight={workingPageHeight}
          workingPageWidth={workingPageWidth}
          rightPageXPosition={rightPageXPosition}
        />
      </>
    )}
  </>
)}
{selectedPage === bookData.numOfPages ? (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    ref={leftPageRef}
    height={canvasPageHeight}
    width={canvasPageWidth}
    viewBox={`0 0 ${canvasPageWidth} ${canvasPageHeight}`}
    x={canvasPageWidth + 2}
    y="0"
  >
    <CoverPage
      bookData={bookData}
      canvasPageWidth={canvasPageWidth}
      canvasPageHeight={canvasPageHeight}
    />
  </svg>
) : (
  <>
    {currentPageSide === "right" ? (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="page-background-right"
          width={canvasPageWidth}
          height={canvasPageHeight}
          x={canvasPageWidth + 2}
          y="1"
          style={{outline: `1px solid ${colors.primary.sixHundred}`}}
        >
          <rect width={canvasPageWidth - 3} height={canvasPageHeight - 2} fill={colors.white}></rect>
          <Holes pageSide="right" canvasPageWidth={canvasPageWidth} canvasPageHeight={canvasPageHeight} />
        </svg>
        {pageData.template ? (
          <Template
            bookData={bookData}
            currentPageSide={currentPageSide}
            pageData={pageData}
            rightPageXPosition={rightPageXPosition}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
            workingPageHeight={workingPageHeight}
            workingPageWidth={workingPageWidth}
            minimumMargin={minimumMargin}
          />
        ) : (
          <PageSvg
            minimumMargin={minimumMargin}
            pageData={pageData}
            pageRef={rightPageRef}
            pageSide="right"
            pageSvg={canvasPages[selectedPage - 1]}
            rightPageXPosition={rightPageXPosition}
            workingPageHeight={workingPageHeight}
            workingPageWidth={workingPageWidth}
          />
        )}
      </>
    ) : (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="page-background-right"
          width={canvasPageWidth}
          height={canvasPageHeight}
          x={canvasPageWidth + 2}
          y="1"
        >
          <rect width={canvasPageWidth - 3} height={canvasPageHeight - 2} fill={colors.white}></rect>
          <Holes pageSide="right" canvasPageWidth={canvasPageWidth} canvasPageHeight={canvasPageHeight} />
        </svg>
        <PageSvg
          minimumMargin={minimumMargin}
          pageData={pageData}
          pageRef={rightPageRef}
          pageSide="right"
          pageSvg={canvasPages[selectedPage]}
          rightPageXPosition={rightPageXPosition}
          workingPageHeight={workingPageHeight}
          workingPageWidth={workingPageWidth}
        />
      </>
    )}
  </>
)}
