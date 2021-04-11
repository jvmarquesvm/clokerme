import { Button, Modal, ModalBody, ModalFooter, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton } from '@chakra-ui/react'
import { useState } from 'react'

export const TimeBlock = ({ time }) => {
    const [isOpen, setIsOpen] = useState(false) 
    const toggle = () => setIsOpen(prevState => !prevState)
    return (
        <Button p={8} bg="blue.500" color="white" onClick={toggle}  >
            {time}
            <ModalTimeBlock isOpen={isOpen} onClose={toggle} time={time} />
        </Button>        
    )
}

const ModalTimeBlock = ({ isOpen, onClose, time }) => (
       <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Horário: {time}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Reservar Horário
            </Button>
            <Button variant="ghost">Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
)