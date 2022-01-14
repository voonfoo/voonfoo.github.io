import {
    Container,
    Heading,
    Text,
    VStack,
    StackDivider,
    Flex,
    useColorModeValue
} from "@chakra-ui/react"

const BlogItem = ({ headerText, date, summary }) => {
    return (
        <Container maxW='container.md'>
            <VStack spacing={2} alignItems={'start'}>
                <Heading as='h2'>{headerText}</Heading>
                <Text
                    fontSize={15}
                    textColor={'gray.600'}>
                    {date}
                </Text>
                <Text>
                    {summary}
                </Text>
            </VStack>
        </Container>
    )
}

const Blog = () => {
    const color = useColorModeValue('#eaeaea', 'gray.700')
    return (
        <Container maxW='full' minH='100vh'>
            <Flex h={250}
                alignItems={'center'}
                borderBottom={'1px'}
                borderColor={color}
                justifyContent={'center'}>
                <VStack spacing={5}>
                    <Heading as='h1'>Blog</Heading>
                    <Text>Where I Talk to Myself</Text>
                </VStack>
            </Flex>
            <VStack
                pt='30px'
                pb='50px'
                divider={<StackDivider borderColor={color} />}
                spacing={10}
            >
                <BlogItem
                    headerText='Hello World'
                    date="Wednesday, 2th January 2022 (about 2 days ago)"
                    summary='hello' />                
     
            </VStack>
        </Container>
    )
}

export default Blog