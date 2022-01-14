import {
    Box,
    Flex,
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    Container,
    HStack,
    Link,
    Avatar,
    useColorModeValue,
    MenuList
} from "@chakra-ui/react"
import { HamburgerIcon } from "@chakra-ui/icons"
import { FaGithubAlt } from "react-icons/fa";
import { DarkModeSwitch } from "./DarkModeSwitch";

const LinkItem = ({ href, children, ...props }) => {
    return (
        <Link href={href} p={2} {...props}>
            {children}
        </Link>
    )
}

const NavBar = () => {
    return (
        <Box
            bg={useColorModeValue('#ffffff40', '#20202380')}
            px={4}
            position={'fixed'}
            w='100%'
            css={{ backdropFilter: 'blur(10px)' }}>
            <Container maxW='container.lg'>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Avatar size="sm" name="Voon Foo" src="profile.jpg" />
                    <Flex alignItems={'center'}>
                        <HStack mr={5} spacing={7} alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
                            <LinkItem>
                                Blog
                            </LinkItem>
                            <LinkItem href="https://github.com/voonfoo/voonfoo.github.io" display="inline-flex" alignItems="center" style={{ gap: 4 }}>
                                Source <Icon as={FaGithubAlt} />
                            </LinkItem>
                        </HStack>
                        <Box flex={1} spacing={7}>
                            <DarkModeSwitch />
                            <Box ml={2} display={{ base: 'inline-block', md: "none" }}>
                                <Menu isLazy id="navbar-menu">
                                    <MenuButton
                                        as={IconButton}
                                        icon={<HamburgerIcon />}
                                        aria-label="Options" />
                                    <MenuList>
                                        <MenuItem as={Link}>Blog</MenuItem>
                                    </MenuList>
                                </Menu>
                            </Box>
                        </Box>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    )
}

export default NavBar