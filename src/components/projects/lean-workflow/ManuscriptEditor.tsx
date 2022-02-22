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
import React, { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../../store'
import ManuscriptPageContainer from './ManuscriptPageContainerLW'
import CouchSource from '../../../couch-data/CouchSource'
import { getCurrentUserId } from '../../../lib/user'
import { Loading } from '../../Loading'

const ManuscriptEditor = (props) => {
  //  1. Initialise store, that will take data from abstract away data source
  //  Research Sagas, MobX or just context and

  // retrieve project by submission id
  const [state] = useStore()
  return (
    <ManuscriptPageContainer
      {...props}
      tags={tags}
      comments={comments}
      keywords={keywords}
      library={library}
      manuscript={manuscript}
      manuscripts={manuscripts}
      notes={notes}
      project={project}
      projects={projects} // not needed as only a single article has to be editable
      projectsCollection={projectsCollection} // to be ABSTRACTED with DATA LEVEL
      user={user}
      collaborators={collaborators}
      collaboratorsById={collaboratorProfiles} // buildCollaboratorProfiles(collaborators, user, '_id')
      userProjects={userProjects} // this is not needed
      userProjectsCollection={userProjectCollection} // to be ABSTRACTED with DATA LEVEL
      tokenActions={tokenActions} // wtf is this
    />
  )
}

export default ManuscriptEditor
