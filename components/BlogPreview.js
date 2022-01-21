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
        <Box>
            <Container maxW='container.md' pt='50px' pb='50px'>
                <VStack spacing={5} alignItems={'start'}>
                    <Link href={`/blog/${slug}`}>
                        <Heading as='h2' _hover={{ cursor: 'pointer' }}>{title}</Heading>
                    </Link>
                    <Text
                        fontSize={15}
                        textColor={'gray.500'}>
                        {new Date(date).toLocaleString('en-us')}
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