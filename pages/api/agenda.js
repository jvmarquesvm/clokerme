import { firebaseServer } from './../../config/firebase/server'

const db = firebaseServer.firestore()
const agenda = db.collection('agenda')

export default async (req, res) => {
    console.log( req.headers.authorization )
    const [ , tokenSplitado ] = req.headers.authorization.split(' ')
    if(!tokenSplitado){
        return res.status(401)
    }
    
    try {
        const { user_id } = await firebaseServer.auth().verifyIdToken( tokenSplitado)
        console.log('Retorno do firebase: user_id ', user_id)

        const snapshot = await agenda.where('userId', '==' , user_id)
                                     .where('when', '==', req.query.when).get()

        res.status(200).json(snapshot.docs)
    } catch ( error ){        
        console.log('ERRO NA AGENDA: ', error)
        return res.status(401)
    }
}