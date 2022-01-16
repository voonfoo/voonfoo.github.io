import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    Link
} from "@chakra-ui/react"

const BlogPreview = ({ title, date, excerpt, slug }) => {
    return (
        <Box _hover={{ boxShadow: 'base' }}>
            <Container maxW='container.md' pt='50px' pb='50px'>
                <VStack spacing={5} alignItems={'start'}>
                    <Link href={`/blog/${slug}`}>
                        <Heading as='h2' _hover={{ cursor: 'pointer' }}>{title}</Heading>
                    </Link>
                    <Text
                        fontSize={15}
                        textColor={'gray.500'}>
                        {date}
                    </Text>
                    <Text>
                        {excerpt}
                    </Text>
                </VStack>
            </Container>
        </Box>

    )
}

export default BlogPreview