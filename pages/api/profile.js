import { firebaseServer } from './../../config/firebase/server'

const db = firebaseServer.firestore()
const profile = db.collection('profiles')

export default async (req, res) => {
 try {
    console.log('Body:', req.body)
    console.log('Auth:', req.headers.authorization)

    const [ ,token ] = req.headers.authorization.split(' ')
    console.log("Token Splitado: " + token)
    const { user_id } = await firebaseServer.auth().verifyIdToken(token)

    console.log("UID:" + user_id)
    
    profile.doc(req.body.username).set({
      userId: user_id,
      username: req.body.username
    })

    console.log("Usuario gravado no firestore com sucesso " + req.body.username)

    res.status(200).json({ name: 'John Doe' })
  } catch ( error){
    console.log('ERRO NO PROFILE:', error)
  }
}