import {
    Container,
    Box,
    Heading,
    Text,
    VStack,
    StackDivider,
    Flex,
    useColorModeValue
} from "@chakra-ui/react"
import BlogPreview from "../components/BlogPreview"
import { getAllPosts } from "../lib/api"

const Blog = ({ allPosts }) => {
    const color = useColorModeValue('#eaeaea', 'gray.700')
    return (
        <Box minH='100vh'>
            <Flex h={200}
                alignItems={'center'}
                borderBottom={'1px'}
                borderColor={color}
                justifyContent={'center'}
                >
                <VStack spacing={5}>
                    <Heading as='h1'>.blog</Heading>
                    <Text>happiness and sorrow</Text>
                </VStack>
            </Flex>
            <VStack
                pb='50px'
                divider={<StackDivider borderColor={color} padding={0}/>}
                align={'stretch'}
                spacing={0}
                >
                    {allPosts.map((post) => (
                        <BlogPreview title={post.title} date={post.date} excerpt={post.excerpt} slug={post.slug}/>
                    ))}
            </VStack>
        </Box>
    )
}

export async function getStaticProps() {
    const allPosts = getAllPosts([
        'title',
        'date',
        'excerpt',
        'slug'
    ])

    return {
        props: { allPosts },
    }
}

export default Blog