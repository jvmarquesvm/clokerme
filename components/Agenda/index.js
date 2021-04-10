import { Button } from "@chakra-ui/button"
import { useAuth } from './../Auth'

export const Agenda = () => {

    const [, { logout }] = useAuth()

    return (
        <div>
            Agenda
            <Button onClick={logout}>Sair</Button>
        </div>
    )
}