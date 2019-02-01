import config from '../config'
import * as api from './api'
import { recreateDatabase, removeDatabase } from './db'
import { registerWayfId } from './wayf'

export const login = async (email: string, password: string) => {
  // TODO: decide whether to remove the local database at login

  try {
    await recreateDatabase()
  } catch (e) {
    console.error(e) // tslint:disable-line:no-console
    // TODO: removing the local database failed
  }

  const {
    data: { token },
  } = await api.login(email, password)

  await registerWayfId(token, config.wayf)

  return token
}

export const logout = async () => {
  try {
    await api.logout()
  } catch (e) {
    console.error(e) // tslint:disable-line:no-console
    // TODO: request to the API server failed
  }

  try {
    await removeDatabase()
  } catch (e) {
    console.error(e) // tslint:disable-line:no-console
    // TODO: removing the local database failed
  }

  // TODO: clear localStorage
}

export const resetPassword = async (
  password: string,
  verificationToken: string
) => {
  const {
    data: { token },
  } = await api.resetPassword(password, verificationToken)

  await registerWayfId(token, config.wayf)

  return token
}
