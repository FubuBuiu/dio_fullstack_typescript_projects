import { Button, Center, Spinner } from "@chakra-ui/react";
import { BackArrow } from "../svg/BackArrow";
import { CardUserInformation } from "../components/CardUserInfo";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IUser, getUserInformationApi } from "../api";
import { AppContext } from "../components/AppContext";

export function Profile() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<IUser | undefined>(undefined);
    const { isLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const goToAccountPage = () => {
        navigate(`/account/${id}`)
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
    }, [id, isLoggedIn, navigate]);

    return (
        <Center height={'100%'} position={'relative'}>
            {isLoading ?
                <Spinner style={{ color: 'white', height: '50px', width: '50px' }} />
                :
                <>
                    < Button position={'absolute'}
                        left={0} top={0} marginTop={'20px'} marginLeft={'20px'} onClick={goToAccountPage}>
                        <BackArrow width={50} color={'white'} />
                    </Button >
                    <CardUserInformation {...userData!} />
                </>
            }
        </Center >
    )
}