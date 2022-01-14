import { Box } from "@chakra-ui/react";

const Footer = () => {
    return (
        <Box align="center" opacity={0.5} fontSize={'sm'}>
            &copy; {new Date().getFullYear()} Voon Foo. All Rights Reserved.
        </Box>
    )
}

export default Footer