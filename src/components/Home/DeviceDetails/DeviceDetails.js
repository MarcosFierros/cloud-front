import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Flex, HStack, Button, Icon, Select, Text, AspectRatio,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Input,
  useDisclosure,
  FormLabel,
  Image,
  useToast
} from "@chakra-ui/react"
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import axios from 'axios';

function DeviceDetails({ match }) {
  const history = useHistory();

  useEffect(() => {
    setCharging(true);
    fetchDoorbells().then( (result) => {
      if (result.success) setDoorbells(result.doorbells)
    });
    fetchDoorbell(match.params.id).then( (result) => {
      console.log(result.data.Item);
      if (result.success) {
        setSelectedDoorbell(result.data.Item)
        setCharging(false)
      }
    });
  }, [])

  const [doorbells, setDoorbells] = useState([]);
  const [selectedDoorbell, setSelectedDoorbell] = useState();
  const [charging, setCharging] = useState(true);
  const [file, setFile] = useState(null)
  const [arrivedPerson, setArrivedPerson] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const changeDoorbell = (event) => {
    console.log(event.target.value);
    history.push(`/devices/${event.target.value}`);
    setCharging(true);
    fetchDoorbell(event.target.value).then( (result) => {
      if (result.success) {
        setSelectedDoorbell(result.data.Item)
        setCharging(false)
      }
    });
  }

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

  const fetchDoorbell = async (id) => {
    const params = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(`https://bx2ul38ps6.execute-api.us-east-1.amazonaws.com/cloud/doorbell-controller/${id}`, params)
    const result = await response.json();
    return result;
  }  

  const uploadImg = async () => {
    try {
      if (!file) {
        throw new Error('Select a file first!');
      }
      const formData = new FormData();
      formData.append('file', file[0]);
      const res = await axios.post(`https://bx2ul38ps6.execute-api.us-east-1.amazonaws.com/cloud/image-controller/compare-image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res);
      setArrivedPerson(res.data.Key);
    } catch (error) {
      console.log(error);
    }
  }

  const openDoor = async () => {
    const params = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "doorbell": {
          "doorbell_id": selectedDoorbell.doorbell_id,
          "doorName": selectedDoorbell.doorName,
          "liveUrl": selectedDoorbell.liveUrl,
          "opened": selectedDoorbell.opened
        },
        "compareImage": arrivedPerson
      })
    }
    const response = await fetch(`https://bx2ul38ps6.execute-api.us-east-1.amazonaws.com/cloud/open-door-controller`, params)
    const result = await response.json();
    console.log(result);
    if(result.body.opened) {
      toast({
        title: 'Door opened',
        description: "The person that arrived is registered",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      setCharging(true);
      fetchDoorbell(match.params.id).then( (result) => {
        if (result.success) {
          setSelectedDoorbell(result.data.Item)
          setCharging(false)
        }
      });
    } else {
      toast({
        title: 'Error',
        description: "We don't know this person",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
    setArrivedPerson('')
    setFile(null)
    onClose()
  }

  const closeDoor = async () => {
    const params = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "doorName": selectedDoorbell.doorName,
          "liveUrl": selectedDoorbell.liveUrl,
          "opened": false,
      })
    }
    const response = await fetch(`https://bx2ul38ps6.execute-api.us-east-1.amazonaws.com/cloud/doorbell-controller/${selectedDoorbell.doorbell_id}`, params)
    const result = await response.json();
    console.log(result);
    setCharging(true);
    fetchDoorbell(match.params.id).then( (result) => {
      if (result.success) {
        setSelectedDoorbell(result.data.Item)
        setCharging(false)
      }
    });
  }

  return (
    <Flex  w="full" h="full" flexDirection="column" spacing="25px" >
      { charging ? <>Please wait...</> : <>
            <HStack w="full" spacing="20px" px={10} pt={10}>
              <Select placeholder="Select doorbell" colorScheme="teal" value={match.params.id} onChange={changeDoorbell}>
                { doorbells.map((doorbell, index) => {
                  return (
                    <option key={index} value={doorbell.doorbell_id}>{ doorbell.doorName }</option>
                  )
                })}
              </Select>
              { selectedDoorbell.opened ? <>
                <Button colorScheme="teal" onClick={closeDoor}>
                  Close Doorbell
                </Button>
                <HStack color="green.400">
                  <Icon as={ AiFillUnlock } fontSize="2xl" />
                  <Text>Abierto</Text>
                </HStack> </>: <>
                <Button colorScheme="teal" onClick={onOpen}>
                  Open Doorbell
                </Button>
                <HStack color="red.400">
                  <Icon as={ AiFillLock } fontSize="2xl" />
                  <Text>Cerrado</Text>
                </HStack>
              </>}
            </HStack>
            <Flex w="full" h="full" flex="1" px="10em" alignItems="center" justifyContent="center" >
              <AspectRatio w="full" ratio={16/9}>
                <iframe
                  title="live-feed"
                  src={selectedDoorbell.liveUrl}
                  allowFullScreen
                />
              </AspectRatio>
            </Flex>

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Open Doorbell</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Stack spacing={3}>
                    <FormLabel>Who arrived?...</FormLabel>
                    <Input type="file" onChange={event => setFile(event.target.files)}/>
                    { arrivedPerson != '' ?
                      <AspectRatio maxW="400px" w="full" mb="20px">
                        <Image src={`https://cloud-faces.s3.amazonaws.com/${arrivedPerson}`} />
                      </AspectRatio>
                    : ''}
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  <Button variant='ghost' mr={3} onClick={onClose}>
                    Close
                  </Button>
                  { arrivedPerson != '' ?
                    <Button colorScheme='green' onClick={openDoor}>Open</Button>
                    : <Button colorScheme='teal' onClick={uploadImg}>Submit</Button>
                  }
                </ModalFooter>
              </ModalContent>
            </Modal>

      </> }

    </Flex>
  );
}

export default DeviceDetails;