import { Card, CardBody, CardFooter, CardHeader, Flex, Text } from "@chakra-ui/react";
import { LoginForm } from "./LoginForm";
import { LoginButton } from "./LoginButton";
import { login } from "../services/login";
import { useState } from "react";

export function LoginCard() {
    const [userValue, setUserValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    return (
        <Flex bg={'#15161B'} width={'100vw'} height={'100%'} justifyContent={'center'}
            alignItems={'center'}>
            <Card borderRadius={10} padding={2} bg={'white'} width={'400px'} height={'fit-content'}>
                <CardHeader mb={'20px'}>
                    <Text fontSize={'x-large'} textAlign={'center'} fontWeight={'bold'} textTransform={'uppercase'}>
                        Login
                    </Text>
                </CardHeader>
                <CardBody marginBottom={'10px'}>
                    <LoginForm userValue={userValue} setUserValue={setUserValue} passwordValue={passwordValue} setPasswordValue={setPasswordValue} />
                </CardBody>
                <CardFooter>
                    <LoginButton event={() => login(userValue)} />
                </CardFooter>
            </Card>
        </Flex>
    )
    // 930a3c
}