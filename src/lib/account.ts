import { RxDatabase } from 'rxdb'
import * as api from './api'
import tokenHandler from './token'
import { registerWayfId } from './wayf'

export const login = async (
  email: string,
  password: string,
  db: RxDatabase
) => {
  try {
    tokenHandler.remove()
  } catch (e) {
    console.error(e) // tslint:disable-line:no-console
    // TODO: removing the token from localStorage failed
  }

  try {
    await db.remove()
  } catch (e) {
    console.error(e) // tslint:disable-line:no-console
    // TODO: removing the local database failed
  }

  const {
    data: { token: accessToken },
  } = await api.login(email, password)

  tokenHandler.set({ access_token: accessToken })

  await registerWayfId(accessToken)
}

export const logout = async (db: RxDatabase) => {
  try {
    await api.logout()
  } catch (e) {
    console.error(e) // tslint:disable-line:no-console
    // TODO: request to the API server failed
  }

  try {
    tokenHandler.remove()
  } catch (e) {
    console.error(e) // tslint:disable-line:no-console
    // TODO: removing the token from localStorage failed
  }

  try {
    await db.remove()
  } catch (e) {
    console.error(e) // tslint:disable-line:no-console
    // TODO: removing the local database failed
  }

  // TODO: clear localStorage
}

export const resetPassword = async (email: string, token: string) => {
  const {
    data: { token: accessToken },
  } = await api.resetPassword(email, token)

  tokenHandler.set({
    access_token: accessToken,
  })

  await registerWayfId(accessToken)
}
