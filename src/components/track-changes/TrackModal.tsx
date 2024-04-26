/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2023 Atypon Systems LLC. All Rights Reserved.
 */
import {
  Affiliation,
  BibliographyItem,
  Footnote,
  ObjectTypes,
} from '@manuscripts/json-schema'
import { ButtonGroup, TextButton } from '@manuscripts/style-guide'
import { NodeAttrChange } from '@manuscripts/track-changes-plugin'
import { ManuscriptNode, getModelsByType } from '@manuscripts/transform'
import _ from 'lodash'
import React, {
  forwardRef,
  MutableRefObject,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { usePopper } from 'react-popper'
import styled from 'styled-components'

import { filterAttrsChange } from '../../lib/attrs-change-filter'
import { useStore } from '../../store'
import EditIcon from '../projects/icons/EditIcon'

interface Props {
  changeId: string
  isVisible: boolean
  setVisible: (to: boolean) => void
  children?: React.ReactChild
}

type PropRef = HTMLElement

function isValidValue(val: any, oldVal: any) {
  if (val || typeof val === 'boolean') {
    if ((val === false || val === 'No') && !oldVal) {
      // if old attribute was undefined (i.e. falsy) and it's not "false" - don't consider it to be a change
      return false
    }
    return true
  }
  return false
}

const modalWidth = 368
const modalXOffset = 90

export const TrackModal = forwardRef<PropRef, Props>((props, ref) => {
  const { changeId, isVisible, setVisible, children } = props

  const [
    { selectedAttrsChange, trackState, files, trackModelMap, doc },
    dispatch,
  ] = useStore((store) => ({
    selectedAttrsChange: store.selectedAttrsChange,
    trackState: store.trackState,
    files: store.files,
    trackModelMap: store.trackModelMap,
    doc: store.doc,
  }))

  useEffect(() => {
    if (selectedAttrsChange == changeId) {
      dispatch({ selectedAttrsChange: undefined })
    }
  }, [dispatch, changeId, selectedAttrsChange])

  const inputRef = ref as MutableRefObject<HTMLInputElement>

  const virtualReference = useMemo(() => {
    return {
      getBoundingClientRect() {
        const original = inputRef.current.getBoundingClientRect()
        const rectLike = {} as Mutable<DOMRect>
        for (const x in original) {
          const k = x as keyof DOMRect
          // @ts-ignore
          rectLike[k] = original[k]
        }
        rectLike.top -= rectLike.height
        rectLike.right = rectLike.left
        rectLike.left -= modalWidth + modalXOffset
        rectLike.width = modalWidth + modalXOffset
        return rectLike
      },
    }
  }, [inputRef])

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>()
  const { styles, attributes } = usePopper(virtualReference, popperElement, {
    strategy: 'fixed',
  })

  useEffect(() => {
    const captureOutside = (e: MouseEvent) => {
      if (
        e.target &&
        !popperElement?.contains(e.target as Node) &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setVisible(false)
      }
    }
    document.addEventListener('click', captureOutside)
    return () => {
      document.removeEventListener('click', captureOutside)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const change = trackState?.changeSet.get(changeId)

  const affiliations = getModelsByType<Affiliation>(
    trackModelMap,
    ObjectTypes.Affiliation
  )

  const references = getModelsByType<BibliographyItem>(
    trackModelMap,
    ObjectTypes.BibliographyItem
  )

  const footnotes = getModelsByType<Footnote>(
    trackModelMap,
    ObjectTypes.Footnote
  )

  const attrChange = change as NodeAttrChange

  const nodeOfChange = useMemo(() => {
    let foundNode: ManuscriptNode | null = null
    doc.descendants((node) => {
      if (foundNode) {
        return true
      }
      if (
        node.attrs.id === attrChange.newAttrs.id ||
        node.attrs.id === attrChange.oldAttrs.id
      ) {
        foundNode = node
      }
    })

    return foundNode
  }, [doc, attrChange.newAttrs.id, attrChange.oldAttrs.id])

  if (!trackState || !isVisible) {
    return null
  }
  if (change?.type !== 'node-attr-change') {
    return null
  }

  if (!nodeOfChange) {
    console.error(
      "Unable to find model corresponding to this change. Modal won't render."
    )
    return null
  }

  const { newAttrs, oldAttrs } = filterAttrsChange(
    nodeOfChange,
    change as NodeAttrChange,
    files,
    affiliations,
    references,
    footnotes
  )

  return (
    <div
      ref={setPopperElement}
      style={{ zIndex: 100, ...styles.popper }}
      {...attributes.popper}
    >
      <TrackModalWrapper data-cy="suggestion-details-modal">
        <Header>
          <LabelContainer>
            <EditIcon />
            <Label>Changed</Label>
          </LabelContainer>
          <ButtonGroup>{children ? children : null}</ButtonGroup>
        </Header>

        <ChangesList>
          {Object.entries(newAttrs).map(([key], index) =>
            isValidValue(newAttrs[key].value, oldAttrs[key]?.value) &&
            (!oldAttrs[key] ||
              !_.isEqual(oldAttrs[key].value, newAttrs[key].value)) ? (
              <Attribute key={index}>
                <AttributeLabel>{newAttrs[key].label}:</AttributeLabel>
                {oldAttrs[key]?.value ? (
                  <div>
                    <DeleteLabel>Deleted: </DeleteLabel>
                    <OldAttribute>{oldAttrs[key].value}</OldAttribute>
                  </div>
                ) : null}
                <div>
                  <InsertLabel>Inserted: </InsertLabel>
                  <AttributeValue>
                    {newAttrs[key].value || oldAttrs[key].value}
                  </AttributeValue>
                </div>
              </Attribute>
            ) : null
          )}
        </ChangesList>
      </TrackModalWrapper>
    </div>
  )
})

export default TrackModal

const InsertLabel = styled.span`
  color: #36b260;
`
const DeleteLabel = styled.span`
  color: #f35143;
`

const TrackModalWrapper = styled.div`
  width: ${modalWidth}px;
  min-height: 136px:
  max-height: 380px;
  border-radius: ${(props) => props.theme.grid.radius.default};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
`

export const TrackChangesButton = styled(TextButton)`
  font-size: ${(props) => props.theme.font.size.normal};
  color: ${(props) => props.theme.colors.text.tertiary};
  text-decoration: underline;
  margin-right: ${(props) => props.theme.grid.unit * 2}px;

  &:hover,
  &:focus {
    color: ${(props) => props.theme.colors.text.tertiary} !important;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.06);
`

const Label = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.medium};
  font-weight: ${(props) => props.theme.font.weight.normal};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  font-style: normal;
  padding: 2px;
`

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
`

const Attribute = styled.div`
  padding: ${(props) => props.theme.grid.unit * 3}px;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
  }
`

const AttributeLabel = styled.span`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.small};
  font-weight: ${(props) => props.theme.font.weight.bold};
  font-style: normal;
  line-height: 16px;
`

const AttributeValue = styled(AttributeLabel)`
  font-weight: ${(props) => props.theme.font.weight.normal};
`

const OldAttribute = styled(AttributeValue)`
  text-decoration: line-through;
`

const ChangesList = styled.div`
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 4}px;
  max-height: ${(props) => props.theme.grid.unit * 124}px;
  overflow: auto;
`
