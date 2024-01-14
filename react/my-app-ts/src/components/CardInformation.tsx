import { Card, CardBody, CardHeader, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

export function CardInformation({ header, body }: { header: ReactNode | string; body: ReactNode | string }) {
    return (
        <Card color={'black'} backgroundColor={'white'} padding={'15px'} width={'300px'} borderRadius={'15px'}>
            <CardHeader marginBottom={'10px'}>
                <Text lineHeight={1} fontSize={25} fontWeight={'bold'}>
                    {header}
                </Text>
            </CardHeader>
            <CardBody fontSize={18}>
                {body}
            </CardBody>
        </Card>
    )
}