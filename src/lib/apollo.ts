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

import * as AbsintheSocket from '@absinthe/socket'
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { DocumentNode, split } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import { createUploadLink } from 'apollo-upload-client'
import { getMainDefinition } from 'apollo-utilities'
import { Socket as PhoenixSocket } from 'phoenix'

import config from '../config'
import tokenHandler from './token'

// TODO: fetch temporary token from manuscripts-api

const httpLink = new HttpLink({
  uri: config.beacon.http,
})

const wsLink = createAbsintheSocketLink(
  AbsintheSocket.create(
    new PhoenixSocket(config.beacon.ws, {
      params: {
        Authorization: tokenHandler.get(),
      },
    })
  )
)

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    Authorization: `Bearer ${tokenHandler.get()}`,
  },
}))

const filesServerLink = createUploadLink({
  uri: config.leanWorkflow.url,
  credentials: 'include',
})

const hasSubscription = ({ query }: { query: DocumentNode }) => {
  const definition = getMainDefinition(query)

  return (
    definition.kind === 'OperationDefinition' &&
    definition.operation === 'subscription'
  )
}

const beaconOrFiles = (operation: any) => {
  const context = operation.getContext()
  if (
    config.leanWorkflow &&
    config.leanWorkflow.url &&
    context &&
    context.clientPurpose == 'leanWorkflowManager'
  ) {
    return false
  }
  return true
}

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: split(
    hasSubscription,
    wsLink,
    split(beaconOrFiles, authLink.concat(httpLink), filesServerLink)
  ),
})
