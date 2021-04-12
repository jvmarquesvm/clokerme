import Link from 'next/link'
import { useFormik } from 'formik'
import * as  yup from 'yup'
//import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Container, Box, Input, Button, Text, FormControl,
         FormLabel, FormHelperText, InputLeftAddon, InputGroup
       } from '@chakra-ui/react'

import { Agenda, Logo, useAuth } from '../components'

const validationSchema = yup.object().shape({
    email: yup.string().email('E-mail inválido').required('Preenchimento Obrigatório'),
    password: yup.string().required('Preenchimento Obrigatório'),
    username: yup.string().required('Preenchimento obrigatório'),
})

export default function Home() {
  const [ auth, {signup}] = useAuth()
  const router = useRouter()


  const {  values, errors, touched,
           handleChange, handleBlur, handleSubmit, isSubmitting 
  } = useFormik ({ onSubmit: signup,
                validationSchema, initialValues: {
                          email: '',
                          username: '',
                          password: ''
                        }
  })

  useEffect(() => {
    auth.user && router.push('/agenda')
  }, [auth.user])
 
  return (
    <Container p={4} centerContent>
      <Logo />
      <Box p={4} mt={8}>
        <Text>Crie sua agenda compartilhada</Text>
      </Box>

      <FormControl id="email" p={4} isRequired>
        <FormLabel>Email</FormLabel>
        <Input size="lg" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="Seu melhor email" />
        {touched.email && <FormHelperText textColor="#e74c3c">{errors.email}</FormHelperText>}
      </FormControl>

      <FormControl id="password" p={4} isRequired>
        <FormLabel>Senha</FormLabel>
        <Input size="lg" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} placeholder="Crie sua senha" />
        {touched.password && <FormHelperText textColor="#e74c3c">{errors.password}</FormHelperText>}
      </FormControl>

      <FormControl id="username" p={4} isRequired>
        <InputGroup size="lg">
          <InputLeftAddon children="jonhscloker.club/" />
          <Input type="username" value={values.username} onChange={handleChange} onBlur={handleBlur} placeholder="Crie seu Id" />
        </InputGroup>
        {touched.username && <FormHelperText textColor="#e74c3c">{errors.username}</FormHelperText>}
      </FormControl>
      
      <Button  m={4} colorScheme="blue" width="100%" onClick={handleSubmit} isLoading={isSubmitting}>Entrar</Button>      
      
      <Link  href="/">Já tem uma conta? Entre já!!</Link>
    </Container>
  )
}
