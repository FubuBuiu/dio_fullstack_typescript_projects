import { Card, CardBody, CardHeader } from "@chakra-ui/react";

interface ICardUserInfoItem {
    title: string;
    content: string;
}

export function CardUserInfoItem({ title, content }: ICardUserInfoItem) {
    return (
        <Card padding={'5px'}>
            <CardHeader fontSize={'20px'} fontWeight={'bold'}>
                {title}
            </CardHeader>
            <CardBody fontSize={'25px'}>
                {content}
            </CardBody>
        </Card>
    )
}