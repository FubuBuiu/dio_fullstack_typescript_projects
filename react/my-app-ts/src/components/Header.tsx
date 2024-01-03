import { Text, Stack, Image } from "@chakra-ui/react";
import chakraUILogo from "../images/chakra-ui-logo.png"

export function Header() {
    return (
        <Stack direction={'row'} height={'100%'} alignItems={'center'} bg={'#0A0A0A'}>
            <Text fontSize={'xx-large'} as={'h3'} color={'white'}>
                My Header Component using
            </Text>
            <Image width={'150px'} height={'fit-content'} src={chakraUILogo} />
        </Stack>
    )
}