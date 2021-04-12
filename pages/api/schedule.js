import { firebaseServer } from '../../config/firebase/server'
import { addHours, differenceInHours, format } from 'date-fns'

const db = firebaseServer.firestore()
const profile = db.collection('profiles')
const agenda = db.collection('agenda')

const startAt = new Date(2021, 1, 1, 8, 0)
const endAt = new Date(2021, 1, 1, 17, 0)
const totalHours = differenceInHours(endAt, startAt)

const timeBlocksList = []

for(let blockIndex = 0; blockIndex <= totalHours; blockIndex++){
    const time = format(addHours(startAt, blockIndex), 'HH:mm')
    timeBlocksList.push(time)
}

const getUserId = async ( username ) => {
    console.log("getUserId: usuario ", username)

    if(!username){
        return false
    }

    const profileDoc = await profile 
        .where('username', '==', username)
        .get()

    if( !profileDoc.docs.length ){
        return false
    }

    console.log("Documentos recuperado Firebase: ", profileDoc.docs[0].data())
    const { userId } = profileDoc.docs[0].data()
    return userId
}

const setSchedule = async (req, res) => {
    try {
        const userId = await getUserId(req.body.username)
        const docId = `${userId}#${req.body.date}#${req.body.time}`

        const doc = await agenda.doc(docId).get()

        if (doc.exists) {
             res.status(400).json({message: 'Horario já reservado!!' })
             return
        }
        console.log("Chamando servico de gravar na agenda")
        
        const block = await agenda.doc(docId).set({
            userId,
            date: req.body.date,
            time: req.body.time,
            name: req.body.name,
            phone: req.body.phone,
        })
        console.log("Finalizando servico de gravar na agenda")
        return res.status(200).json(block)
    } catch(error){
        console.log("Erro API Schedule: ", error )
        return res.status(400).json("Error - Horario já resevado", error)
    }
}

const getSchedule = async (req, res) => {
    try {
        console.log("Usuario que chegou getSchedule:", req.query.username)
        const userId = await getUserId(req.query.username)

        if(!userId){
            return res.status(401).json({message: 'Usuario nao encontrado'})
        }

        console.log("getSchedule: usuario",  userId)
        console.log("getSchedule: data", req.query.date)

        const snapshot = await agenda.where('userId', '==', userId)
                                       .where('date', '==', req.query.date)
                                       .get()

        const docs = snapshot.docs.map( doc => doc.data() )
        const result = timeBlocksList.map( time => ({ 
                time,
                isBlocked: !!docs.find( doc => doc.time === time )
                           //Boolean(docs.find( doc => doc.time === time ) )
            }) 
        )

        return res.status(200).json(result)
    } catch (error) {
        console.log('FB ERROR:', error)
        return res.status(401).json({message: 'Nao Autorizado!!'})
    }

}

const methods = {
    POST: setSchedule,
    GET: getSchedule,
}

export default async (req, res) => methods[req.method]
            ? methods[req.method](req, res)
            : res.status(405)
