import {
    Box,
    Flex,
    Button,
    Text,
    Icon,
    HStack,
    Link,
    Container,
    Avatar,
    useColorModeValue,
    useColorMode
} from "@chakra-ui/react"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { FaGithubAlt } from "react-icons/fa";

const LinkItem = ({ href, children, ...props }) => {
    return (
        <Link href={href} p={2} {...props}>
            {children}
        </Link>
    )
}

const NavBar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Box bg={useColorModeValue('#ffffff40', '#20202380')} px={4}>
            <Container maxW='container.lg'>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Avatar size="sm" name="Voon Foo" />
                    <Flex alignItems={'center'}>
                        <HStack spacing={7} alignItems={'center'}>
                            <LinkItem>
                                Blog 
                            </LinkItem>
                            <LinkItem href="https://github.com/voonfoo/voonfoo.github.io" display="inline-flex" alignItems="center" style={{ gap: 4 }}>
                                Source <Icon as={FaGithubAlt} />
                            </LinkItem>
                            <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button>
                        </HStack>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    )
}

export default NavBar