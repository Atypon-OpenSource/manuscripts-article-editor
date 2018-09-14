import { AxiosRequestConfig } from 'axios'
import { stringify } from 'qs'
import {
  ChangePasswordResponse,
  ChangePasswordValues,
} from '../components/ChangePasswordForm'
import { DeleteAccountValues } from '../components/DeleteAccountForm'
import { LoginResponse, LoginValues } from '../components/LoginForm'
import {
  PasswordHiddenValues,
  PasswordValues,
  ResetPasswordResponse,
} from '../components/PasswordForm'
import { RecoverValues } from '../components/RecoverForm'
import { SignupValues } from '../components/SignupForm'
import config from '../config'
import client from './client'
import { DeviceValues } from './deviceId'
import token from './token'
import { registerWayfId } from './wayf'

export interface VerifyValues {
  token: string
}

/* tslint:disable-next-line:no-any */
const buildFormRequestConfig = (url: string, data: any): AxiosRequestConfig => {
  return {
    url,
    method: 'POST',
    data: stringify(data),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  }
}

export const fetchUser = () => {
  return client.get('/user').then(response => response.data)
}

export const signup = (data: SignupValues) =>
  client.post('/registration/signup', data)

export const login = (data: LoginValues & DeviceValues) =>
  client
    .post<LoginResponse>('/auth/login', data, {
      headers: config.api.headers,
      withCredentials: true,
    })
    .then(response => {
      token.set({
        access_token: response.data.token,
      })

      registerWayfId(response.data.token)

      return response
    })

export const deleteAccount = (data: DeleteAccountValues) =>
  client
    .delete('/user', {
      data,
    })
    .then(() => {
      token.remove()
    })

export const changePassword = (data: ChangePasswordValues & DeviceValues) =>
  client.post<ChangePasswordResponse>('/auth/changePassword', data)

export const recoverPassword = (data: RecoverValues) =>
  client.post('/auth/sendForgottenPassword', data)

export const resetPassword = (
  data: PasswordValues & PasswordHiddenValues & DeviceValues
) =>
  client
    .post<ResetPasswordResponse>('/auth/resetPassword', data, {
      headers: config.api.headers,
      withCredentials: true,
    })
    .then(response => {
      token.set({
        access_token: response.data.token,
      })

      registerWayfId(response.data.token)

      return response
    })

export const refresh = () => {
  const tokenData = token.get()

  if (!tokenData) return Promise.resolve()

  const requestConfig = buildFormRequestConfig('/token', {
    grant_type: 'refresh',
  })

  return client.request(requestConfig).then(response => {
    token.set(response.data)
  })
}

export const refreshSyncSession = () => {
  return client.post('/auth/refreshSyncSessions', null, {
    withCredentials: true,
  })
}

export const logout = () =>
  client.post('/auth/logout').then(() => {
    token.remove()
  })

const convertUserID = (userID: string) => userID.replace('_', '|')

export const addProjectUser = (
  projectID: string,
  userID: string,
  role: string
) =>
  client.post(`/project/${encodeURIComponent(projectID)}/addUser`, {
    role,
    userId: convertUserID(userID),
  })

export const updateUserRole = (
  projectID: string,
  userID: string,
  newRole: string | null
) =>
  client.post(`/project/${encodeURIComponent(projectID)}/roles`, {
    newRole,
    managedUserId: convertUserID(userID),
  })

// TODO: find a better place for this
interface InvitedUsersData {
  email: string
  name?: string
}

export const projectInvite = (
  projectID: string,
  invitedUsers: InvitedUsersData[],
  role: string,
  message: string
) =>
  client.post(`/invitation/project/${encodeURIComponent(projectID)}/invite`, {
    invitedUsers,
    role,
    message,
  })

export const projectUninvite = (invitationID: string) =>
  client.delete(`/invitation`, {
    data: {
      invitationId: invitationID,
    },
  })

export const requestProjectInvitationToken = (
  projectID: string,
  role: string
) =>
  client
    .get(
      `/invitation/project/${encodeURIComponent(
        projectID
      )}/${encodeURIComponent(role)}`
    )
    .then(response => response.data.token)

export const acceptProjectInvitationToken = (token: string) =>
  client
    .post('/invitation/project/access', { token })
    .then(response => response.data)

export const acceptProjectInvitation = (
  invitationId: string,
  password?: string,
  name?: string
) =>
  client.post('/invitation/accept', {
    invitationId,
    password,
    name,
  })

export const rejectProjectInvitation = (invitationId: string) =>
  client
    .post('/invitation/reject', { invitationId })
    .then(response => response.data)

export const verify = (data: VerifyValues) =>
  client.post('/registration/verify', data)

export const resendVerificationEmail = (email: string) =>
  client.post(`/registration/verify/resend`, { email })
