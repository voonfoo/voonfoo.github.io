import { Box } from "@chakra-ui/react"
import Footer from "../Footer"
import NavBar from "../NavBar"

const Main = ({ children, router }) => {
    return (
        <Box as="main" pb={8}>
            <NavBar />
            {children}
            <Footer/>
        </Box>
    )
}

export default Main