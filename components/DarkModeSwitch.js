import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import {
	IconButton,
	useColorMode,
	useColorModeValue
} from '@chakra-ui/react'

export const DarkModeSwitch = () => {
	const { toggleColorMode } = useColorMode();
	return (
		<IconButton 
			aria-label='Toggle Dark Mode'
			colorScheme={useColorModeValue('purple', 'orange')}
			icon={useColorModeValue(<MoonIcon/>, <SunIcon/>)}
			onClick={toggleColorMode}> 
		</IconButton>
	)
}