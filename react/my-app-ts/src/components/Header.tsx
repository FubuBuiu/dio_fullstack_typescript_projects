import { Text, Stack, Image, Button } from "@chakra-ui/react";
import chakraUILogo from "../images/chakra-ui-logo.png"
import { useContext } from "react";
import { AppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import { setLocalStorageValue } from "../services/storage";

export function Header() {
    const { setIsLoggedIn, isLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLougout = (): void => {
        setIsLoggedIn(false);
        setLocalStorageValue({ login: '' });
        navigate('/');
    };

    return (
        <Stack direction={'row'} height={'100%'} alignItems={'center'} bg={'#0A0A0A'}>
            <Text fontSize={'xx-large'} as={'h3'} color={'white'}>
                My Header Component using
            </Text>
            <Image width={'150px'} height={'fit-content'} src={chakraUILogo} />
            {isLoggedIn &&
                <Button position={'absolute'} right={0} marginRight={'20px'} color={'white'} bg={'#E4105D'}
                    _hover={{ backgroundColor: '#b00c48' }} padding={'8px'} borderRadius={'10px'} onClick={handleLougout}>Sair
                </Button>
            }
        </Stack>
    )
}