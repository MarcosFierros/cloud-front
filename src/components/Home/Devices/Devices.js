import React, { useState, useEffect } from 'react';
import { VStack, Button, Box, Icon } from "@chakra-ui/react"
import { BiBellPlus, BiBell } from 'react-icons/bi';
import { Link } from "react-router-dom";

function Devices({ match }) {

  useEffect(() => {
    setDoorbells(new Array(2).fill(0));
  }, [])

  const [doorbells, setDoorbells] = useState([]);

  return (
    <VStack  w="full" h="full" justifyContent="Center" alignItems="center" spacing="25px">
        <Box>
          <Icon as={ BiBellPlus } fontSize="4xl" color="teal.400" mr="10px"/>
          <Button colorScheme="teal">Add doorbell</Button>
        </Box>
        { doorbells.map((doorbell, index) => {
          return ( 
            <Box key={index}>
              <Icon as={ BiBell } fontSize="4xl" color="teal.400" mr="10px"/>
              <Link to={`devices/${index}`}>
                <Button colorScheme="teal">Doorbell {index + 1}</Button>
              </Link>
            </Box>
          )
        })}
    </VStack>
  );
}

export default Devices;