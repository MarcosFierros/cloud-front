import React, { useState, useEffect } from 'react';
import { Flex, HStack, Button, Select, AspectRatio } from "@chakra-ui/react"
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function Videos({ match }) {

  useEffect(() => {
    setDoorbells(new Array(2).fill(0));
  }, [])

  const [doorbells, setDoorbells] = useState([]);

  const changeDoorbell = () => {
    console.log("change");
  }

  return (
    <Flex  w="full" h="full" flexDirection="column" spacing="25px" >
      <HStack w="full" spacing="20px" px={10} pt={10}>
        <Select placeholder="Select doorbell" colorScheme="teal" value={match.params.id} onChange={changeDoorbell}>
          { doorbells.map((doorbell, index) => {
            return (
              <option key={index} value={index}>Doorbell {index + 1}</option>
            )
          })}
        </Select>
        <Button leftIcon={<FaArrowLeft />} colorScheme="teal" px={10}>Prev. Video</Button>
        <Button rightIcon={<FaArrowRight />} colorScheme="teal" px={10}>Next Video</Button>
      </HStack>
      <Flex w="full" h="full" flex="1" px="10em" alignItems="center" justifyContent="center" >
        <AspectRatio w="full" ratio={16/9}>
          <iframe
            title="live-feed"
            src="https://www.youtube.com/embed/iBmUjyHla3U"
            allowFullScreen
          />
        </AspectRatio>
      </Flex>
      
    </Flex>
  );
}

export default Videos;