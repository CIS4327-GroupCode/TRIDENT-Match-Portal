import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    try{
      const rawUser = localStorage.getItem('trident_user')
      const rawToken = localStorage.getItem('trident_token')
      if(rawUser && rawToken){
        setUser(JSON.parse(rawUser))
        setToken(rawToken)
      }
    }catch(e){
      console.warn('failed to read auth from storage', e)
    }
  }, [])

  function login({ user: u, token: t }){
    setUser(u)
    setToken(t)
    try{
      localStorage.setItem('trident_user', JSON.stringify(u))
      localStorage.setItem('trident_token', t)
    }catch(e){ console.warn('failed to persist auth', e) }
  }

  function logout(){
    setUser(null)
    setToken(null)
    try{
      localStorage.removeItem('trident_user')
      localStorage.removeItem('trident_token')
    }catch(e){ /* ignore */ }
    // optional: redirect to home
    try{ window.location.href = '/' }catch(e){}
  }

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
  return useContext(AuthContext)
}

export default AuthContext
