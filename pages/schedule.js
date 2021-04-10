import { Logo, useAuth, formatDate } from './../components'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useFetch } from '@refetty/react'
import { Container, Button, Box, IconButton } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { addDays, subDays } from 'date-fns'

const getSchedule = async ( when ) => axios({
                    method: 'get',
                    url: '/api/schedule',
                    params: { when, username: window.location.pathname },
                })


const Header = ({ children }) => (
    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" padding={4}>
        { children }
    </Box>
)

export default function Agenda() {

    const [auth, { logout }] = useAuth()
    const router = useRouter()
    const [ when, setWhen ] = useState( () => new Date())
    const [ data, { loading, status, error }, fetch ] = useFetch( getSchedule, {lazy: true} )

    console.log(`------->`, fetch)

    const addDay = () => setWhen( prevState => addDays( prevState, 1))
    const removeDay = () => setWhen( prevState => subDays( prevState, 1))

    useEffect(() => {
      !auth.user && router.push('/')
    }, [auth.user])

    useEffect(() => {
        fetch(when)
    }, [when])

    return (
        <Container>
            <Header>
                <Logo size={150} />
                <Button onClick={logout}>Sair</Button>
            </Header>
            
            <Box display="flex" alignItems="center" mt={8}>   
                <IconButton icon={ <ChevronLeftIcon /> } bg="transparent" onClick={removeDay} />
                <Box flex={1} textAlign="center">{ formatDate(when, 'PPPP') }</Box>
                <IconButton icon={ <ChevronRightIcon />}  bg="transparent" onClick={addDay} />
            </Box>
        </Container>
    )
}