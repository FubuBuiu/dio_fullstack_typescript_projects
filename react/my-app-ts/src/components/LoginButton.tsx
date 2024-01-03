import { Button } from "@chakra-ui/react";

export function LoginButton({ event }: { event: () => void }) {
    return (
        <Button
            onClick={event}
            padding={'3px'}
            width={'100%'}
            borderRadius={'5px'}
            color={'white'}
            bg={'#E4105D'}
            _hover={{ backgroundColor: '#b00c48' }}>
            Button
        </Button>
    )
}