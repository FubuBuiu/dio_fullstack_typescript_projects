import { Avatar, Button, Card, CardBody, CardHeader, Center, Divider, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { CardUserInfoItem } from "./CardUserInfoItem";
import { IUser } from "../api";

export function CardUserInformation(userData: IUser) {
    const [show, setShow] = useState(false)
    const togglePasswordVisibility = () => setShow(!show)
    return (
        <Card width={'500px'} backgroundColor={'white'} borderRadius={'15px'} padding={'10px'} color={'#E4105D'}>
            <CardHeader >
                <Center>
                    <Avatar backgroundColor={'#E4105D'} width={'170px'} />
                </Center>
            </CardHeader>
            <CardBody>
                <CardUserInfoItem title={'Nome'} content={userData.name} />
                <Divider height={'4px'} backgroundColor={'#CCCCCC'}
                    borderRadius={'999px'} marginY={'5px'} />
                <CardUserInfoItem title={'Email'} content={userData.email} />
                <Divider height={'4px'} backgroundColor={'#CCCCCC'}
                    borderRadius={'999px'} marginY={'5px'} />
                <Card padding={'5px'}>
                    <CardHeader fontSize={'20px'} fontWeight={'bold'}>
                        Senha
                    </CardHeader>
                    <CardBody fontSize={'25px'}>
                        <InputGroup >
                            <Input
                                width={'80%'}
                                value={userData.password}
                                disabled
                                backgroundColor={'transparent'}
                                type={show ? 'text' : 'password'}
                            />
                            <InputRightElement height={'100%'} width={'80px'}>
                                <Button backgroundColor={"#E4105D"}
                                    color={'white'}
                                    fontSize={'20px'}
                                    height={'100%'} width={'100%'}
                                    borderRadius={'8px'}
                                    onClick={togglePasswordVisibility}>
                                    {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </CardBody>
                </Card>
            </CardBody>
        </Card >
    )
}