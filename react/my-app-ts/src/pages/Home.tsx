import { Box, Card, CardBody, CardFooter, CardHeader, Center, Divider, Text } from "@chakra-ui/react";
import { LoginForm } from "../components/LoginForm";
import { LoginButton } from "../components/LoginButton";
import { login } from "../services/login";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../components/AppContext";
import { useNavigate } from "react-router-dom";
import { setLocalStorageValue } from "../services/storage";

export function Home() {
    const [userValue, setUserValue] = useState<string>('');
    const [passwordValue, setPasswordValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { userId, setIsLoggedIn, isLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();

    const handleUserValidation = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        const response = await login(email, password);
        setIsLoading(false);
        if (response !== undefined) {
            setIsLoggedIn(true);
            setLocalStorageValue({ login: response });
            navigate(`/account/${response}`);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate(`/account/${userId}`);
        }

    }, [isLoggedIn, navigate, userId]);

    return (
        <Center height={'100%'} position={'relative'}>
            <Card position={'absolute'} left={5} top={5} color={'grey'} border={'1px solid'} borderRadius={'5px'} padding={'10px'}>
                <CardHeader textAlign={'center'}>Existing accounts</CardHeader>
                <CardBody marginTop={'10px'} >
                    <Center >
                        <Box>
                            <Text>
                                User: user@dio.com
                            </Text>
                            <Text>
                                Password: user123
                            </Text>
                        </Box>
                        <Divider orientation={"vertical"} height={'50px'} width={'2px'} marginX={'10px'} bg={'grey'} />
                        <Box>
                            <Text>
                                User: admin@dio.com
                            </Text>
                            <Text>
                                Password: admin123
                            </Text>
                        </Box>
                    </Center>
                </CardBody>
            </Card>
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
                    <LoginButton isLoading={isLoading} event={() => handleUserValidation(userValue, passwordValue)} />
                </CardFooter>
            </Card>
        </Center>
    )
}