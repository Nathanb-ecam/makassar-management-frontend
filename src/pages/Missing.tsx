import React from 'react'
import {  Center, Text , Stack } from "@chakra-ui/react"


const Missing = () => {
  return (
    <Center bg="var(--primary)" h='100vh' color="white">
      <Stack direction='row' gap="5">
        <Text fontWeight='bold'>404</Text>
        <Text fontWeight='bold'>|</Text>
        <Text fontWeight='semibold'>Page not found</Text>
      </Stack>
    
    </Center>
  )
}

export default Missing