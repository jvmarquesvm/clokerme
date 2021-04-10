import { firebaseServer } from '../../config/firebase/server'

const db = firebaseServer.firestore()
const profile = db.collection('profile')
const agenda = db.collection('agenda')

export default async (req, res) => {
    
    try {
        const profileDoc = await profile.where('username', '==', req.query.username).get()

        const snapshot = await agenda.where('userId', '==' , profileDoc.user_id)
                                     .where('when', '==', req.query.when)
                                     .get()

        res.status(200).json(snapshot.docs)
    } catch ( error ){        
        console.log('ERRO No SCHEDULE: ', error)
        return res.status(401)
    }
}