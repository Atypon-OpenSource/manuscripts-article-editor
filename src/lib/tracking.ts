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

interface Tracking {
  category: string
  action: string
  label?: string
  value?: string
}

interface InvitationsTracking extends Tracking {
  category: 'Invitations'
  action: 'Share' | 'Send' | 'Accept'
}

interface ManuscriptsTracking extends Tracking {
  category: 'Manuscripts'
  action: 'Create' | 'Import' | 'Export'
}

type TrackEvent = (f: InvitationsTracking | ManuscriptsTracking) => void

export const trackEvent: TrackEvent = ({ category, action, label, value }) => {
  if (window.ga) {
    window.ga('send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
    })
  }
}

export const changeOperationAlias = (operation: string): string => {
  switch (operation) {
    case 'delete': {
      return 'Deleted'
    }
    case 'insert':
    case 'wrap_with_node': {
      return 'Inserted'
    }
    case 'set_attrs': {
      return 'Updated'
    }
    case 'node_split': {
      return 'Split'
    }
    case 'change_node': {
      return 'Convert To'
    }
    case 'move': {
      return 'Move'
    }
    default: {
      return 'null'
    }
  }
}
