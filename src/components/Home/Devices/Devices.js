import React, { useState, useEffect } from 'react';
import { VStack, Button, Box, Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Input
} from "@chakra-ui/react"
import { BiBellPlus, BiBell } from 'react-icons/bi';
import { Link } from "react-router-dom";
import { useDisclosure } from '@chakra-ui/react'

function Devices({ match }) {

  useEffect(() => {
    fetchDoorbells().then( (result) => {
      console.log(result);
      if (result.success)
        setDoorbells(result.doorbells)
    });
  }, [])

  const fetchDoorbells = async () => {
    const params = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch('https://bx2ul38ps6.execute-api.us-east-1.amazonaws.com/cloud/doorbell-controller', params)
    const result = await response.json();
    return result;
  }

  const createDoorbell = async (event) => {
    const params = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "doorName": doorName,
        "liveUrl": liveUrl,
        "opened": false
      })
    }
    const response = await fetch('https://bx2ul38ps6.execute-api.us-east-1.amazonaws.com/cloud/doorbell-controller', params)
    const result = await response.json();
    onClose();
    setDoorName('');
    setLiveurl('');
    fetchDoorbells().then( (result) => {
      if (result.success)
        setDoorbells(result.doorbells)
    });
    console.log(result);
  }

  const deleteDoorbell = async (id) => {
    console.log(id);
    const params = {
      method: "DELETE",
    }
    const response = await fetch(`https://bx2ul38ps6.execute-api.us-east-1.amazonaws.com/cloud/doorbell-controller/${id}`, params)
    const result = await response.json();
    fetchDoorbells().then( (result) => {
      if (result.success)
        setDoorbells(result.doorbells)
    });
    console.log(result);
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [doorbells, setDoorbells] = useState([]);
  const [doorName, setDoorName] = useState('');
  const [liveUrl, setLiveurl] = useState('');

  return (
    <VStack  w="full" h="full" justifyContent="Center" alignItems="center" spacing="25px">
        <Box>
          <Icon as={ BiBellPlus } fontSize="4xl" color="teal.400" mr="10px"/>
          <Button colorScheme="teal" onClick={onOpen} >Add doorbell</Button>
        </Box>
        { doorbells.map((doorbell, index) => {
          return ( 
            <Box key={index}>
              <Icon as={ BiBell } fontSize="4xl" color="teal.400" mr="10px"/>
              <Link to={`devices/${doorbell.doorbell_id}`}>
                <Button colorScheme="teal" mr="10px">{ doorbell.doorName }</Button>
              </Link>
              <Button colorScheme="red" onClick={() => deleteDoorbell(doorbell.doorbell_id)}>Delete</Button>
            </Box>
          )
        })}
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Doorbell</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Input placeholder='Doorbell Name' type="text" value={doorName} onChange={event => setDoorName(event.target.value)}/>
              <Input placeholder='Live url' type="text"  value={liveUrl} onChange={event => setLiveurl(event.target.value)}/>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='teal' onClick={createDoorbell}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>

  );
}

export default Devices;