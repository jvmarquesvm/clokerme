import * as React from 'react' 
import { useState, useEffect, useContext } from 'react'
import { firebaseClient, persistenceMode } from './../../config/firebase/client' 
import axios from 'axios'

const AuthContext = React.createContext([{}, () => { }])
export const logout = () =>  firebaseClient.auth().signOut()

export const login = async ({ email, password }) => {
    console.log("Usuario fazendo login: " + email)
    firebaseClient.auth().setPersistence(persistenceMode)

    console.log("Email: " + email + " password: " + password)

    try {
      await firebaseClient.auth().signInWithEmailAndPassword(email, password)
      console.log("Login feito com sucesso: " + email )
      return firebaseClient.auth().currentUser
    } catch (error) {
      console.log('LOGIN ERROR:', error)
    }
}
/*
const logout = () => {
    console.log("Usuário Deslogando")
     try {
    } catch (error) {
      console.log('LOGOUT ERROR:', error)
    }
}
*/
export const signup = async ({ email, password, username }) => {
    console.log("Usuário Cadastrando")

    try {
        await firebaseClient.auth().createUserWithEmailAndPassword(email, password)
        console.log("Usuario criado no firebase " + email)

        const user =  await login({email, password})
        const token = await user.getIdToken()

        console.log("Token Recupeado " + token)

        const { data } = await axios({
                method: 'post',
                url: '/api/profile',
                data: { username },
                headers: { 'Authorization': `Bearer ${token}` },
              })
        console.log("Retorno da api: ", data)
    } catch (error) {
      console.log('SIGNUP ERROR:', error)
    }
}

export const useAuth = () => {
    const [auth] = useContext(AuthContext)
    return [auth, { login, logout, signup }]
}

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        loading: true,
        user: false
    })

      useEffect(() => {
        const unsubscribe = firebaseClient.auth().onAuthStateChanged(user => {
            setAuth({
                loading: false, user
            })
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    )

}