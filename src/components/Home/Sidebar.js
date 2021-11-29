import React from 'react';
import { VStack, Flex, Center, Heading, Icon, Text } from "@chakra-ui/react"
import { SiUpcloud } from 'react-icons/si';
import { FaMobileAlt, FaImage, FaVideo, FaCog, FaUserAlt } from 'react-icons/fa';

import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <VStack bgGradient="linear(to-r, gray.100, gray.200)" w="300px" h='100vh' p={10}>
      <Center>
        <Link to="/">
          <Flex justifyContent="center" flexDirection="row" alignItems="center">
            <Icon as={ SiUpcloud } fontSize="4xl" color="teal.400" mr="10px" mb="5px"/>
            <Heading 
              as="h1"
              size="lg"
              bgGradient="linear(to-r, teal.400, cyan.800, purple.400)" 
              bgClip="text"
              fontWeight="extrabold"
            >
              cloud-app-2
            </Heading>
          </Flex>
        </Link>
      </Center>
      <VStack spacing="24px" w="full" pt="50px">
          <Link to="/devices">
            <Flex w="full" className="sidebar-item" justifyContent="center" flexDirection="row">
                  <Icon as={ FaMobileAlt } fontSize="2xl" className="active-icon" />
                  <Text>Devices</Text>
            </Flex>
          </Link>
          <Link to="/images">
            <Flex w="full" className="sidebar-item" justifyContent="center" flexDirection="row">
                  <Icon as={ FaImage } fontSize="2xl" className="active-icon" />
                  <Text>Images</Text>
            </Flex>
          </Link>
          <Link to="/videos">
            <Flex w="full" className="sidebar-item" justifyContent="center" flexDirection="row">
                  <Icon as={ FaVideo } fontSize="2xl" className="active-icon" />
                  <Text>Videos</Text>
            </Flex>
          </Link>
          <Link to="/settings">
            <Flex w="full" className="sidebar-item" justifyContent="center" flexDirection="row">
                  <Icon as={ FaCog } fontSize="2xl" className="active-icon" />
                  <Text>Settings</Text>
            </Flex>
          </Link>
          <Link to="/myaccount">
            <Flex w="full" className="sidebar-item" justifyContent="center" flexDirection="row">
                  <Icon as={ FaUserAlt } fontSize="2xl" className="active-icon" />
                  <Text>My Account</Text>
            </Flex>
          </Link>
      </VStack>
    </VStack>
  );
}

export default Sidebar;