import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools"

const styles = {
    global: props => ({
        body: {
            bg: mode('#FFFFFF', '#202023')(props)
        }
    })
}

const config = {
    initialColorMode: 'light',
    useSystemColorMode: false
}

const theme = extendTheme({ config, styles })
export default theme