import React, { useState, useEffect, useRef } from "react"
import { colors, convertToPx } from "../../styles/variables"
import { Minus, Plus } from "phosphor-react"

import { StyledFieldset, StyledSelect, StyledLabel, StyledInput } from "../form/FormComponents"
import { ProductDetails } from "../shop/ShopComponents"
import Content from "../Content"
import Button from "../Button"
import Icon from "../Icon"

const EditPageForm = ({ setEditMode, setPageType, setPageData, pageData }) => {
  return (
    <ProductDetails>
      <Content>
        <h2>Customize Pages</h2>
      </Content>
      <form>
        <h3>Choose a template</h3>
        <p>{pageData.type}</p>
        <StyledFieldset
          className="is-vertical"
          margin="0 0 1rem"
        >
          <StyledLabel>Templates</StyledLabel>
          <StyledSelect
            padding="0.5rem"
            borderRadius="0.25rem"
            value={pageData.type}
            onChange={e => setPageData({...pageData, type: e.target.value})}
          >
            <option value="Blank">Blank</option>
            <option value="Lined">Lined</option>
            <option value="Dots">Dot grid</option>
          </StyledSelect>
        </StyledFieldset>
        {pageData.type === "Blank" && (
          null
        )}
        {pageData.type === "Lined" && (
          <>
            <h3>Edit template styling</h3>
            <StyledFieldset
              className="is-vertical"
              margin="0 0 1rem"
            >
              <StyledFieldset
                className="is-vertical"
                margin="0 0 1rem"
              >
                <StyledLabel>Rows</StyledLabel>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={pageData.rows}
                  onChange={e => setPageData({...pageData, rows: e.target.value})}
                />
              </StyledFieldset>
              <StyledFieldset
                className="is-vertical"
                margin="0 0 1rem"
              >
                <StyledLabel>Top margin</StyledLabel>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={pageData.marginTop}
                  onChange={e => setPageData({...pageData, marginTop: e.target.value})}
                />
              </StyledFieldset>
              <StyledFieldset
                className="is-vertical"
                margin="0 0 1rem"
              >
                <StyledLabel>Left margin</StyledLabel>
                <input
                  type="number"
                  step="1"
                  value={pageData.marginLeft}
                  onChange={e => setPageData({...pageData, marginLeft: e.target.value})}
                />
              </StyledFieldset>
              <StyledFieldset
                className="is-vertical"
                margin="0 0 1rem"
              >
                <StyledLabel>Spacing</StyledLabel>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={pageData.spacing}
                  onChange={e => setPageData({...pageData, spacing: e.target.value})}
                />
              </StyledFieldset>
              <StyledFieldset
                className="is-vertical"
                margin="0 0 1rem"
              >
                <StyledLabel>Opacity</StyledLabel>
                <input
                  type="range"
                  min="0.2"
                  step="0.1"
                  max="1"
                  value={pageData.opacity}
                  onChange={e => setPageData({...pageData, opacity: e.target.value})}
                />
              </StyledFieldset>
              <StyledFieldset
                className="is-vertical"
                margin="0 0 1rem"
              >
                <StyledLabel>Thickness</StyledLabel>
                <input
                  type="range"
                  min="0.3"
                  step="0.1"
                  max="5"
                  value={pageData.thickness}
                  onChange={e => setPageData({...pageData, thickness: e.target.value})}
                />
              </StyledFieldset>
            </StyledFieldset>
          </>
        )}
        {pageData.type === "Dots" && (
          <>
            <h3>Edit template styling</h3>
            <StyledFieldset
              className="is-vertical"
              margin="0 0 1rem"
            >
              <StyledFieldset
                className="is-vertical"
                margin="0 0 1rem"
              >
                <StyledLabel>Rows</StyledLabel>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={pageData.rows}
                  onChange={e => setPageData({...pageData, rows: e.target.value})}
                />
              </StyledFieldset>
              <StyledFieldset
                className="is-vertical"
                margin="0 0 1rem"
              >
                <StyledLabel>Columns</StyledLabel>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={pageData.columns}
                  onChange={e => setPageData({...pageData, columns: e.target.value})}
                />
              </StyledFieldset>
              <StyledFieldset
                className="is-vertical"
                margin="0 0 1rem"
              >
                <StyledLabel>Top margin</StyledLabel>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={pageData.marginTop}
                  onChange={e => setPageData({...pageData, marginTop: e.target.value})}
                />
              </StyledFieldset>
              <StyledFieldset
                className="is-vertical"
                margin="0 0 1rem"
              >
                <StyledLabel>Left margin</StyledLabel>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={pageData.marginLeft}
                  onChange={e => setPageData({...pageData, marginLeft: e.target.value})}
                />
              </StyledFieldset>
              <StyledFieldset
                className="is-vertical"
                margin="0 0 1rem"
              >
                <StyledLabel>Spacing</StyledLabel>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={pageData.spacing}
                  onChange={e => setPageData({...pageData, spacing: e.target.value})}
                />
              </StyledFieldset>
              <StyledFieldset
                className="is-vertical"
                margin="0 0 1rem"
              >
                <StyledLabel>Opacity</StyledLabel>
                <input
                  type="range"
                  min="0.2"
                  step="0.1"
                  max="1"
                  value={pageData.opacity}
                  onChange={e => setPageData({...pageData, opacity: e.target.value})}
                />
              </StyledFieldset>
              <StyledFieldset
                className="is-vertical"
                margin="0 0 1rem"
              >
                <StyledLabel>Dot radius</StyledLabel>
                <input
                  type="range"
                  min="0.3"
                  step="0.1"
                  max="5"
                  value={pageData.thickness}
                  onChange={e => setPageData({...pageData, thickness: e.target.value})}
                />
              </StyledFieldset>
            </StyledFieldset>
          </>
        )}
        <h3>Apply template to pages</h3>
        <StyledFieldset
          className="is-vertical"
          margin="0 0 1rem"
        >
          <StyledLabel>Pages</StyledLabel>
          <input
            type="number"
            min="1"
            step="1"
          />
          <input
            type="number"
            min="1"
            step="1"
          />
        </StyledFieldset>
      </form>
      <Button
        onClick={e => {
          e.preventDefault()
          setEditMode(false)
        }}
      >
        Return
      </Button>
    </ProductDetails>
  )
}

export default EditPageForm
