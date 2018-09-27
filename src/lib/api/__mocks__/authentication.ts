export const login = async (email: string, password: string) => {
  // mock login request: respond with token

  return {
    data: {
      token: '123',
    },
  }
}

export const logout = async () => {
  // mock logout request: no response data
}

export const resetPassword = async (email: string, token: string) => {
  // mock reset password request: respond with token

  return {
    data: {
      token: '123',
    },
  }
}
