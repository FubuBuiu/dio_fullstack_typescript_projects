import { useContext, useEffect, useState } from "react"
import { AppContext } from "../components/AppContext"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Center, Flex, Spinner } from "@chakra-ui/react";
import { IUser, getUserInformationApi } from "../api";
import { CardInformation } from "../components/CardInformation";
import { actualDate, actualTime, formatMoney } from "../services/helper";

export function Account() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<IUser | undefined>(undefined);
    const { isLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const goToProfilePage = (): void => {
        navigate(location.pathname + '/profile');
    };

    useEffect(() => {
        const getUserData = async () => {
            setIsLoading(true);
            if (!isLoggedIn || id === undefined) {
                navigate('/');
            } else {
                await getUserInformationApi(id).then((userData) => {
                    setUserData(userData);
                })
                setIsLoading(false);
            }
        }

        getUserData();
    }, [navigate, id, isLoggedIn]);
    return (
        <Center width={'100%'} height={'100%'} gap={'10px'}>
            {isLoading ?
                <Spinner style={{ color: 'white', height: '50px', width: '50px' }} />
                :
                <>
                    <CardInformation header={<>
                        Bem vindo{' '}
                        <span style={{ color: '#E4105D' }}>{userData?.name}</span>
                    </>} body={
                        <>
                            <Flex direction={'column'}>
                                {actualDate() + "----" + actualTime()}
                                <Button color={'white'} bg={'#E4105D'}
                                    _hover={{ backgroundColor: '#b00c48' }} padding={'8px'} borderRadius={'10px'} onClick={goToProfilePage}>Perfil</Button>
                            </Flex>
                        </>
                    } />
                    <CardInformation header={'Saldo'} body={
                        formatMoney(userData?.balance)
                    } />
                </>
            }
        </Center>
    )
}