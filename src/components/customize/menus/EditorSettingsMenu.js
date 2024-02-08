import React, { useEffect, useRef } from "react"
import { useEditorDispatch } from "../context/editorContext"

import DropdownMenu from "./DropdownMenu"

const EditorSettingsMenu = ({ toolRef }) => {
  const dispatch = useEditorDispatch()
  const menuRef = useRef(null)
  const groups = [
    [
      {
        label: "Back to books",
        value: "back",
        link: "/account/books"
      },
    ],
    [
      {
        label: 'View',
        value: 'view',
        children: [
          [
            { label: 'Pages', value: 'view_pages', toggleable: true },
            { label: 'Controls', value: 'view_controls', toggleable: true },
          ]
        ]
      },
    ]
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (toolRef && toolRef.current) {
          if (toolRef.current.contains(event.target)) {
            return
          }
        }

        dispatch({
          type: "toggle",
          updates: {
            showSettingsMenu: false,
          }
        })
        dispatch({
          type: "change-mode",
          mode: "select",
        })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [toolRef.current])

  return (
    <div
      ref={menuRef}
    >
      <DropdownMenu
        groups={groups}
        className="is-main"
      />
    </div>
  )
}

export default EditorSettingsMenu