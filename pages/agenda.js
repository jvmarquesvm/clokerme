import { Button } from "@chakra-ui/button"
import { useAuth } from './../components'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Agenda() {

    const [auth, { logout }] = useAuth()
    const router = useRouter()

    useEffect(() => {
      !auth.user && router.push('/')
    }, [auth.user])

    return (
        <div>
            Agenda
            <Button onClick={logout}>Sair</Button>
        </div>
    )
}