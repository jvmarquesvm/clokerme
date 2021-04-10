import { Container, Spinner } from '@chakra-ui/react'
import { useAuth } from './../components'
import { Login, Agenda } from './../components'

export default function Home() {
  const [auth] = useAuth()

  if(auth.loading) {
    return (
      <Container p={4} centerContent>
        <Spinner />
      </Container>
    )
  }

  return auth.user ? <Agenda /> : <Login />
}