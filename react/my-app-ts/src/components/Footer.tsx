import { Image, Stack, Text } from "@chakra-ui/react";
import chakraUILogo from "../images/chakra-ui-logo.png"

export function Footer() {
    return (
        <Stack direction={'row'} height={'100%'} alignItems={'center'} bg={'#0A0A0A'}>
            <Text fontSize={'xx-large'} color={'white'}>
                My Footer Component using
            </Text>
            <Image width={'150px'} height={'fit-content'} src={chakraUILogo} />
        </Stack>
    )
}