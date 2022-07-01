/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */
import { Model } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'

import { Importer } from '../components/projects/Importer'
import config from '../config'
import { createToken, createUserProfile } from '../lib/developer'
import { useStore } from '../store'
import { useModal } from './ModalHookableProvider'
import { importManuscript } from './projects/ImportManuscript'

const DropdownAction = styled.div`
  padding: 10px 20px;
  display: block;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
  }
`

// const DropdownInfo = styled.div`
//   padding: 10px 20px;
//   white-space: nowrap;
// `

// const PlainLink = styled.a`
//   color: inherit;
//   text-decoration: none;
// `

const Development = () => {
  const [store] = useStore((store) => store)

  const { addModal } = useModal()
  const history = useHistory()

  const importerHander = importManuscript(
    history,
    store.saveNewManuscript,
    undefined,
    (projectID, manuscriptID) => {
      alert(
        `Imported successfully: projectID: ${projectID}, manuscriptID: ${manuscriptID}.`
      )
    }
  )

  const openImporter = () => {
    addModal('importer', ({ handleClose }) => (
      <Importer
        handleComplete={handleClose}
        importManuscript={(models: Model[], redirect = true) =>
          importerHander(models)
        }
      />
    ))
  }

  return (
    <div>
      <h2>Development</h2>
      <div>
        {!store.user && config.rxdb.enabled && (
          <>
            <DropdownAction
              onClick={() => {
                createToken()
                alert('Created token')
              }}
            >
              Create token
            </DropdownAction>
            <DropdownAction
              onClick={async () => {
                await createUserProfile(store.createUser)
                alert('Created user profile. The app will be reloaded now.')
                window.location.assign('/')
              }}
            >
              Create user profile
            </DropdownAction>
          </>
        )}
        {!store.user && !config.rxdb.enabled && (
          <>
            <p>You need to logged in first</p>
          </>
        )}
        <br />
        {store.user && !store.project && (
          <button onClick={() => openImporter()}>Import a manuscript</button>
        )}
      </div>
    </div>
  )
}

export default Development
