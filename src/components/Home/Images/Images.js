import React, { useState, useEffect } from 'react';
import { Flex, HStack, Image, Select, AspectRatio } from "@chakra-ui/react"

function Images({ match }) {

  useEffect(() => {
    setDoorbells(new Array(2).fill(0));
    setImages(new Array(10).fill(0));
  }, [])

  const [doorbells, setDoorbells] = useState([]);
  const [images, setImages] = useState([]);

  return (
    <Flex  w="full" h="full" flexDirection="column" spacing="25px" >
      <HStack w="full" spacing="20px" px={10} pt={10}>
        <Select placeholder="Select doorbell" colorScheme="teal">
          { doorbells.map((doorbell, index) => {
            return (
              <option key={index} value={index}>Doorbell {index + 1}</option>
            )
          })}
        </Select>
      </HStack>
      <Flex w="full" h="full" flex="1" alignContent="space-between" justifyContent="space-around" flexWrap="wrap" overflow="scroll" p={10}>
        { images.map((image, index) => {
            return ( 
                <AspectRatio key={index} maxW="400px" w="full" ratio={16 / 9} mb="20px">
                  <Image src="https://via.placeholder.com/1920x1080.png"/>
                </AspectRatio>
            )
          }
        )}
      </Flex>
      
    </Flex>
  );
}

export default Images;