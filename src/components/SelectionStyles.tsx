import React, {useEffect} from "react";
import {useStore} from "../store";
import {scrollIntoViewIfNeeded} from "../lib/scroll";

export const SelectionStyles: React.FC = () => {
  const [{selectedSuggestionID}, dispatch] = useStore((state) => ({
    selectedSuggestionID: state.selectedSuggestionID
  }))

  useEffect(() => {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const editor = target.closest('#editor')
      if (!editor) {
        return
      }
      const suggestion = target.closest('[data-track-id]') as HTMLElement
      dispatch({
        selectedSuggestionID: suggestion?.dataset.trackId
      })
    })
  }, []);

  useEffect(() => {
    if (!selectedSuggestionID) {
      return
    }
    const suggestion = document.querySelector(`[data-track-id="${selectedSuggestionID}"]`)
    suggestion && scrollIntoViewIfNeeded(suggestion)
  }, [selectedSuggestionID])

  const style = selectedSuggestionID ? `
[data-track-id="${selectedSuggestionID}"] {
  background: #bce7f6 !important;
  border-width: 2px 0 2px 0 !important;
  border-color: #20aedf !important;
  border-radius: 3px !important;
  border-style: solid !important;
}
` : ''

  return (
    <style>
      {style}
    </style>
  )
}
