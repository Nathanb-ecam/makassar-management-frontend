import React from 'react';
import {Float, Text, Button, HStack} from "@chakra-ui/react"

import { Blockquote, BlockquoteIcon } from '../components/ui/blockquote';

const Dashboard = () => {
  return( 
    // <div className="page">  
    <>
      <Blockquote
      margin="5rem"
      variant="plain"
      colorPalette="teal"
      showDash
      icon={
        <Float placement="top-start" offsetX="-5" offsetY="2">
          <BlockquoteIcon />
        </Float>
      }
      cite="Uzumaki Naruto"
      >
        If anyone thinks he is something when he is nothing, he deceives himself.
        Each one should test his own actions. Then he can take pride in himself,
        without comparing himself to anyone else.
      </Blockquote>
  
    </>

    // </div>
  );
};

export default Dashboard;
