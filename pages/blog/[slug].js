import { Container, Text, Box, Flex } from "@chakra-ui/react"
import { getPostBySlug, getAllPosts } from "../../lib/api"

const BlogPost = ({ post }) => {
    return (
        <Box minH="100vh">

            <Container alignItems={"center"}>
                <Text>{post.content}</Text>
            </Container>
        </Box>
    )
}

export async function getStaticProps({ params }) {
    const post = getPostBySlug(params.slug, [
        'title',
        'date',
        'slug',
        'content'
    ])

    return {
        props: {
            post: {
                ...post,
            }
        }
    }
}

export async function getStaticPaths() {
    const posts = getAllPosts(['slug'])

    return {
        paths: posts.map((post) => {
            return {
                params: {
                    slug: post.slug,
                },
            }
        }),
        fallback: false,
    }
}

export default BlogPost