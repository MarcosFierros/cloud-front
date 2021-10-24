import React from 'react';
import Sidebar from './Sidebar';
import Devices from './Devices/Devices'
import DeviceDetails from './DeviceDetails/DeviceDetails';
import Images from './Images/Images';
import Videos from './Videos/Videos';
import Settings from './Settings/Settings';
import MyAccount from './MyAccount/MyAccount';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Flex, Box } from "@chakra-ui/react";

import './Home.css';

function Home() {
  return (
    <Router>
      <Flex h='100vh' p={0} bg="gray.100" overflow="hidden">
        <Sidebar/>
        <Box flex='1' overflow="hidden">
          <Switch>
            <Route path="/" exact component={Devices}/>
            <Route path="/devices" exact component={Devices}/>
            <Route path="/devices/:id" exact component={DeviceDetails}/>
            <Route path="/images" exact component={Images}/>
            <Route path="/videos" exact component={Videos}/>
            <Route path="/settings" exact component={Settings}/>
            <Route path="/myaccount" exact component={MyAccount}/>
          </Switch>
        </Box>
      </Flex>
    </Router>
  );
}

export default Home;