import { Button, Input, InputGroup, InputLeftAddon, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";

interface LoginFormProps {
    userValue: string;
    setUserValue: React.Dispatch<React.SetStateAction<string>>;
    passwordValue: string;
    setPasswordValue: React.Dispatch<React.SetStateAction<string>>
}

export function LoginForm({ userValue, setUserValue, passwordValue, setPasswordValue }: LoginFormProps) {
    const [show, setShow] = useState(false)
    return (
        <>
            <InputGroup marginBottom={'5px'}>
                <InputLeftAddon color={'white'} bg={'#E4105D'} padding={'5px'}>
                    User:
                </InputLeftAddon>
                <Input value={userValue} onChange={(event) => setUserValue(event.target.value)} width={'100%'} border={'1px solid'} borderRadius={'5px'} />
            </InputGroup>
            <InputGroup>
                <InputLeftAddon color={'white'} bg={'#E4105D'} padding={'5px'}>
                    Password:
                </InputLeftAddon>
                <Input value={passwordValue} onChange={(event) => setPasswordValue(event.target.value)} width={'100%'} border={'1px solid'} borderRadius={'5px'} type={show ? 'text' : 'password'} />
                <InputRightElement height={'100%'} marginRight={'5px'} >
                    <Button padding={'2px'} borderRadius={'5px'} color={'white'} bg={'#E4105D'} _hover={{ backgroundColor: '#b00c48' }} onClick={() => setShow(!show)}>
                        {show ? 'Hide' : 'Show'}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </>
    )
}