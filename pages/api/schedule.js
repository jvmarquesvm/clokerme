import { firebaseServer } from '../../config/firebase/server'
import { addHours, differenceInHours, format } from 'date-fns'

const db = firebaseServer.firestore()
const profile = db.collection('profile')
const agenda = db.collection('agenda')

const startAt = new Date(2021, 1, 1, 8, 0)
const endAt = new Date(2021, 1, 1, 17, 0)
const totalHours = differenceInHours(endAt, startAt)

const timeBlocks = []

for(let blockIndex = 0; blockIndex <= totalHours; blockIndex++){
    const time = format(addHours(startAt, blockIndex), 'HH:mm')
    timeBlocks.push(time)
}

export default async (req, res) => {
    console.log(timeBlocks)
     
    try {
        /*
        const profileDoc = await profile.where('username', '==', req.query.username).get()

        const snapshot = await agenda.where('userId', '==' , profileDoc.user_id)
                                     .where('when', '==', req.query.when)
                                     .get()*/
        
        //res.status(200).json(snapshot.docs)
        res.status(200).json(timeBlocks)
    } catch ( error ){        
        console.log('ERRO No SCHEDULE: ', error)
        return res.status(401)
    } 
    
}