/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

export interface OAuthProvider {
  id: string
  name: string
  authUrl: string
  tokenUrl: string
  scopes: string[]
  clientId?: string
}

export interface OAuthToken {
  access_token: string
  refresh_token?: string
  expires_at?: number
  token_type: string
  scope: string
}

export interface IntegrationConnection {
  provider: string
  connected: boolean
  user?: {
    id: string
    email?: string
    name?: string
  }
  token?: OAuthToken
  connectedAt?: string
  lastSync?: string
}

export const OAUTH_PROVIDERS: Record<string, OAuthProvider> = {
  google: {
    id: 'google',
    name: 'Google',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  },
  github: {
    id: 'github',
    name: 'GitHub',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scopes: ['repo', 'user:email', 'gist'],
  },
  dropbox: {
    id: 'dropbox',
    name: 'Dropbox',
    authUrl: 'https://www.dropbox.com/oauth2/authorize',
    tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
    scopes: ['files.content.write', 'files.content.read'],
  },
  onedrive: {
    id: 'onedrive',
    name: 'OneDrive',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scopes: ['Files.ReadWrite', 'User.Read'],
  },
}

export class OAuthManager {
  private static readonly STORAGE_KEY = 'manuscripts_integrations'
  
  static getConnections(): Record<string, IntegrationConnection> {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  }

  static saveConnection(providerId: string, connection: IntegrationConnection) {
    const connections = this.getConnections()
    connections[providerId] = connection
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(connections))
  }

  static disconnect(providerId: string) {
    const connections = this.getConnections()
    delete connections[providerId]
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(connections))
  }

  static isConnected(providerId: string): boolean {
    const connections = this.getConnections()
    return connections[providerId]?.connected || false
  }

  static getToken(providerId: string): OAuthToken | null {
    const connections = this.getConnections()
    return connections[providerId]?.token || null
  }

  static async initiateOAuth(
    providerId: string,
    clientId: string,
    redirectUri: string
  ): Promise<void> {
    const provider = OAUTH_PROVIDERS[providerId]
    if (!provider) {
      throw new Error(`Unknown OAuth provider: ${providerId}`)
    }

    const state = this.generateState()
    sessionStorage.setItem('oauth_state', state)
    sessionStorage.setItem('oauth_provider', providerId)

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: provider.scopes.join(' '),
      state,
      access_type: 'offline',
      prompt: 'consent',
    })

    window.location.href = `${provider.authUrl}?${params.toString()}`
  }

  static async handleCallback(
    code: string,
    state: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<IntegrationConnection> {
    const savedState = sessionStorage.getItem('oauth_state')
    const providerId = sessionStorage.getItem('oauth_provider')

    if (!savedState || savedState !== state) {
      throw new Error('Invalid OAuth state')
    }

    if (!providerId) {
      throw new Error('No OAuth provider found')
    }

    const provider = OAUTH_PROVIDERS[providerId]
    const tokenResponse = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const token: OAuthToken = await tokenResponse.json()

    const userInfo = await this.fetchUserInfo(providerId, token.access_token)

    const connection: IntegrationConnection = {
      provider: providerId,
      connected: true,
      user: userInfo,
      token,
      connectedAt: new Date().toISOString(),
    }

    this.saveConnection(providerId, connection)
    sessionStorage.removeItem('oauth_state')
    sessionStorage.removeItem('oauth_provider')

    return connection
  }

  private static async fetchUserInfo(
    providerId: string,
    accessToken: string
  ): Promise<{ id: string; email?: string; name?: string }> {
    switch (providerId) {
      case 'google':
        const googleRes = await fetch(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        const googleData = await googleRes.json()
        return {
          id: googleData.id,
          email: googleData.email,
          name: googleData.name,
        }

      case 'github':
        const githubRes = await fetch('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const githubData = await githubRes.json()
        return {
          id: githubData.id.toString(),
          email: githubData.email,
          name: githubData.name || githubData.login,
        }

      default:
        return { id: 'unknown' }
    }
  }

  private static generateState(): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
      ''
    )
  }

  static async refreshToken(
    providerId: string,
    clientId: string,
    clientSecret: string
  ): Promise<OAuthToken> {
    const connection = this.getConnections()[providerId]
    if (!connection?.token?.refresh_token) {
      throw new Error('No refresh token available')
    }

    const provider = OAUTH_PROVIDERS[providerId]
    const response = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: connection.token.refresh_token,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const newToken: OAuthToken = await response.json()
    connection.token = newToken
    this.saveConnection(providerId, connection)

    return newToken
  }
}
