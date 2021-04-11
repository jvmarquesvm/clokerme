import { Button, Modal, ModalBody, ModalFooter, ModalOverlay, 
         ModalContent, ModalHeader, ModalCloseButton } from '@chakra-ui/react'
import { Input } from '../Input'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { format } from 'date-fns'

const setSchedule = async ({ date, ...data }) => axios({
    method: 'post',
    url: '/api/schedule',
    data: { 
        ...data,
        date: format( date, 'yyyy-MM-dd' ),
        username: window.location.pathname.replace('/',''), 
    },
})

export const TimeBlock = ({ time, date, disabled }) => {
    
    const [isOpen, setIsOpen] = useState(false) 
    const toggle = () => setIsOpen(prevState => !prevState)

    const { values, handleSubmit, handleChange, errors, touched, handleBlur, isSubmitting } = useFormik({
        onSubmit: async (values)  =>  { 
            try {
                await setSchedule( {...values, time, date } ) 
                toggle()
            } catch(error){
                console.log(error)
            }
        },
        initialValues: {
            name: '',
            email: ''
        },
        validationSchema: yup.object().shape({
                            phone: yup.string().required('Preenchimento Obrigatório'),
                            name: yup.string().required('Preenchimento Obrigatório')
        })
    })


    return (
        <Button p={8}  bg="blue.500"  color="white"  onClick={toggle}  disabled={disabled} >
            {time}
            { !disabled && <ModalTimeBlock isOpen={isOpen} onClose={toggle}  
                               onComplete={handleSubmit} isSubmitting={isSubmitting} >
                <>
                    <Input placeholder="Digite seu nome:" size="lg" name="name" 
                           value={values.name} onChange={handleChange} error={errors.name} 
                           label="Nome:" touched={touched.name}
                           onBlur={handleBlur} disabled={isSubmitting} />
                    <Input placeholder="(99) 9 9999-9999" name="phone" 
                           label="Telefone:" value={values.phone}  onChange={handleChange} 
                           size="lg" mt={4} error={errors.phone} 
                           onBlur={handleBlur}  disabled={isSubmitting} />
                </>
            </ModalTimeBlock> }
        </Button>        
    )
}

const ModalTimeBlock = ({ isOpen, onClose, onComplete, children, isSubmitting }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            
            <ModalHeader>Faça sua Reserva</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
                {children}
            </ModalBody>

            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onComplete} isLoading={isSubmitting} >
                    Reservar Horário
                </Button>
                { !isSubmitting && <Button variant="ghost" onClick={onClose}>  
                    Cancelar
                </Button> }
            </ModalFooter>

        </ModalContent>
    </Modal>
)
