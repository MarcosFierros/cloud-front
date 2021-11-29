import React, { useState, useEffect } from 'react';
import { Flex, HStack, Image, Select, AspectRatio,
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
  Button,
  VStack
} from "@chakra-ui/react"
import axios from 'axios';

function Images({ match }) {

  useEffect(() => {
    setCharging(true);
    fetchDoorbells().then( (result) => {
      if (result.success) setDoorbells(result.doorbells)
      if (result.doorbells.length > 0 ) {
        setSelectedDoorbell(result.doorbells[0])
        fetchImages(result.doorbells[0].doorbell_id).then( imgResult => {
          if (imgResult.success) setImages(imgResult.images)
          setCharging(false)
        })
      }
      setCharging(false)
    });
  }, [])

  const [doorbells, setDoorbells] = useState([]);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedDoorbell, setSelectedDoorbell] = useState();
  const [charging, setCharging] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure()

  const changeDoorbell = (event) => {
    setCharging(true);
    fetchDoorbell(event.target.value).then( (result) => {
      if (result.success) {
        setSelectedDoorbell(result.data.Item)
        fetchImages(event.target.value).then( imgResult => {
          if (imgResult.success) setImages(imgResult.images)
          setCharging(false)
        })
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

  const fetchImages = async (id) => {
    const params = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(`https://bx2ul38ps6.execute-api.us-east-1.amazonaws.com/cloud/image-controller/images/${id}`, params)
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
      const res = await axios.post(` https://bx2ul38ps6.execute-api.us-east-1.amazonaws.com/cloud/image-controller/image/${selectedDoorbell.doorbell_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res);
      setCharging(true);
      fetchImages(selectedDoorbell.doorbell_id).then( imgResult => {
        if (imgResult.success) setImages(imgResult.images)
        setCharging(false)

      })
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  const deleteImg = async (id) => {
    const params = {
      method: "DELETE",
    }
    const response = await fetch(`https://bx2ul38ps6.execute-api.us-east-1.amazonaws.com/cloud/image-controller/image/${id}`, params)
    const result = await response.json();
    console.log(result);

    setCharging(true);
    fetchImages(selectedDoorbell.doorbell_id).then( imgResult => {
      if (imgResult.success) setImages(imgResult.images)
      setCharging(false)
    })
    setFile(null);
  }

  return (
    <Flex  w="full" h="full" flexDirection="column" spacing="25px" >
      { charging ? <>Please wait...</> : <>
        <HStack w="full" spacing="20px" px={10} pt={10}>
        <Select placeholder="Select doorbell" colorScheme="teal" value={selectedDoorbell.doorbell_id} onChange={changeDoorbell}>
          { doorbells.map((doorbell, index) => {
            return (
              <option key={index} value={doorbell.doorbell_id}>{ doorbell.doorName }</option>
            )
          })}
        </Select>
        <Button colorScheme="teal" onClick={onOpen}>
          Add image
        </Button>
      </HStack>
      <Flex w="full" h="full" flex="1" alignContent="space-between" justifyContent="space-around" flexWrap="wrap" overflow="scroll" p={10}>
        { images.map((image, index) => {
            return ( <>
                <VStack  key={index} w="400px" spacing="20px" px={10} pt={10}>
                  <AspectRatio maxW="400px" w="full">
                    <Image src={`https://cloud-faces.s3.amazonaws.com/${image.name}`}/>
                  </AspectRatio>
                  <Button colorScheme="red" onClick={ () => deleteImg(image.image_id)}>Delete</Button>
                </VStack>
              </>
            )
          }
        )}
      </Flex>
      </>}
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <FormLabel>Image:</FormLabel>
              <Input type="file" onChange={event => setFile(event.target.files)}/>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='teal' onClick={uploadImg}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Images;