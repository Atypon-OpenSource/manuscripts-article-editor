/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import {
  CommentWithUserColor,
  ICreateCommentRequest,
  IUpdateCommentRequest,
  UserWithColor,
} from '@manuscripts/quarterback-types'
import randomColor from 'randomcolor'
import create from 'zustand'
import { combine } from 'zustand/middleware'

import * as commentApi from './api/comment'
import { useAuthStore } from './useAuthStore'

interface CommentState {
  commentsMap: Map<string, CommentWithUserColor>
  changeComments: Map<string, CommentWithUserColor[]>
  userColorsMap: Map<string, string>
  usersMap: Map<string, UserWithColor>
  openCommentLists: Set<string>
}

const ANONYMOUS_USER = {
  name: 'Anonymous',
  color: randomColor({
    luminosity: 'dark',
  }),
}

function computeChangeComments(commentsMap: Map<string, CommentWithUserColor>) {
  const changeMap = new Map<string, CommentWithUserColor[]>()
  Array.from(commentsMap.values()).forEach((c) => {
    const prev = changeMap.get(c.change_id)
    if (prev) {
      changeMap.set(c.change_id, [...prev, c])
    } else {
      changeMap.set(c.change_id, [c])
    }
  })
  return changeMap
}

export const useCommentStore = create(
  combine(
    {
      commentsMap: new Map(),
      changeComments: new Map(),
      userColorsMap: new Map(),
      usersMap: new Map(),
      openCommentLists: new Set(),
    } as CommentState,
    (set, get) => ({
      init() {
        set({
          commentsMap: new Map(),
          changeComments: new Map(),
          userColorsMap: new Map(),
          usersMap: new Map(),
          openCommentLists: new Set(),
        })
      },
      setUsers(collaboratorsById: Map<string, UserProfile>) {
        const { user } = useAuthStore.getState()
        const usersMap = new Map<string, UserWithColor>()
        if (user) {
          usersMap.set(user.id, user)
        }
        collaboratorsById.forEach((u) => {
          // Skip current user
          if (usersMap.has(u._id)) {
            return
          }
          const color = randomColor({
            luminosity: 'dark',
          })
          usersMap.set(u._id, {
            id: u._id,
            name: u.bibliographicName.given || u.userID,
            color,
          })
        })
        set({ usersMap })
      },
      toggleCommentListOpen: (id: string) => {
        set((state) => {
          const { openCommentLists } = state
          if (openCommentLists.has(id)) {
            openCommentLists.delete(id)
          } else {
            openCommentLists.add(id)
          }
          return { openCommentLists }
        })
      },
      listComments: async (docId: string) => {
        const resp = await commentApi.listComments(docId)
        if ('data' in resp) {
          set((state) => {
            const { usersMap } = state
            const commentsMap = new Map(
              resp.data.comments.map((c) => {
                const user = usersMap.get(c.user_model_id) || ANONYMOUS_USER
                const comment: CommentWithUserColor = {
                  ...c,
                  user,
                }
                return [c.id, comment]
              })
            )
            return {
              commentsMap,
              changeComments: computeChangeComments(commentsMap),
            }
          })
        }
        return resp
      },
      createComment: async (
        payload: ICreateCommentRequest,
        user: UserWithColor
      ) => {
        const resp = await commentApi.createComment(payload)
        if ('data' in resp) {
          set((state) => {
            const { commentsMap } = state
            commentsMap.set(resp.data.id, {
              ...resp.data,
              user: {
                name: user.name,
                color: user.color,
              },
            })
            return {
              commentsMap,
              changeComments: computeChangeComments(commentsMap),
            }
          })
        }
        return resp
      },
      updateComment: async (
        commentId: string,
        values: IUpdateCommentRequest
      ) => {
        const resp = await commentApi.updateComment(commentId, values)
        if ('data' in resp) {
          set((state) => {
            const { commentsMap } = state
            const old = commentsMap.get(commentId)
            if (old) {
              commentsMap.set(commentId, { ...old, ...values })
              return {
                commentsMap,
                changeComments: computeChangeComments(commentsMap),
              }
            }
            return state
          })
        }
        return resp
      },
      deleteComment: async (snapId: string) => {
        const resp = await commentApi.deleteComment(snapId)
        if ('data' in resp) {
          set((state) => {
            const { commentsMap } = state
            commentsMap.delete(snapId)
            return {
              commentsMap,
              changeComments: computeChangeComments(commentsMap),
            }
          })
        }
        return resp
      },
    })
  )
)
