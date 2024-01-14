import { Button } from "@chakra-ui/react";

export function LoginButton({ event, isLoading = false }: { event: () => void; isLoading?: boolean }) {
    return (
        <Button
            isLoading={isLoading}
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