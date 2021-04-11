import { Logo, useAuth, formatDate, TimeBlock } from './../components'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useFetch } from '@refetty/react'
import { Container, Button, Box, IconButton, SimpleGrid, Spinner } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { addDays, subDays } from 'date-fns'
import format from 'date-fns/format'

const getSchedule = async ( when ) => axios({
                    method: 'get',
                    url: '/api/schedule',
                    params: {   username: window.location.pathname.replace('/',''),
                                date: format( when, 'yyyy-MM-dd')
                            },
                })


const Header = ({ children }) => (
    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" padding={4}>
        { children }
    </Box>
)

export default function Schedule() {

    const [auth, { logout }] = useAuth()
    const router = useRouter()
    const [ when, setWhen ] = useState( () => new Date())
    const [ data, { loading, status, error }, fetch ] = useFetch( getSchedule, {lazy: true} )

    console.log(`------->`, fetch)

    const addDay = () => setWhen( prevState => addDays( prevState, 1))
    const removeDay = () => setWhen( prevState => subDays( prevState, 1))

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
            <SimpleGrid p={4} columns={2} spacing={4}>
                {loading && <Spinner thickness="4px" speed="0.65" emptyColor="gray.200" color="blue.500" size="xl" />}
                {data?.map( ({ time, isBlocked }) => <TimeBlock key={time} time={time} date={when} disabled={isBlocked} /> )}
            </SimpleGrid>
        </Container>
    )
}