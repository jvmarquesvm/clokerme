import Link from 'next/link'
import { useFormik } from 'formik'
import * as  yup from 'yup'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Container , Box , Input, Button,
         Text, FormLabel, FormHelperText, 
         FormControl
        } from '@chakra-ui/react'

import { Logo, useAuth } from './../components'

const validationSchema = yup.object().shape({
    email: yup.string().email('E-mail inválido').required('Preenchimento Obrigatório'),
    password: yup.string().required('Preenchimento Obrigatório'),
})

export default function Login() {

  const[ auth, { login }] = useAuth()
  const router = useRouter()

  const {  values, errors, touched, handleChange,  handleBlur, 
           handleSubmit, isSubmitting 
  } = useFormik ({ onSubmit: login,
                   validationSchema, 
                   initialValues: { email: '',
                                     usename: '',
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

      <Box>
        <FormControl id="email" p={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input size="lg" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
          {touched.email && <FormHelperText textColor="#e74c3c">{errors.email}</FormHelperText>}
        </FormControl>

        <FormControl id="password" p={4} isRequired>
          <FormLabel>Senha</FormLabel>
          <Input size="lg" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
          {touched.password && <FormHelperText textColor="#e74c3c">{errors.password}</FormHelperText>}
        </FormControl>

        <Box p={4}>
          <Button colorScheme="blue" width="100%" onClick={handleSubmit} isLoading={isSubmitting}>Entrar</Button>
        </Box>
      </Box>

      <Link href="/signup">Ainda não tem uma conta? Cadastre-se</Link>
    </Container>
  )
}
