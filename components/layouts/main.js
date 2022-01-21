import { Box, Container } from "@chakra-ui/react"
import Footer from "../Footer"
import NavBar from "../NavBar"

const Main = ({ children, router }) => {
    return (
        <Box as="main" pb={8}>
            <NavBar />
            <Box pt={20}>

            {children}
            <Footer />
            </Box>
        </Box>
    )
}

export default Main