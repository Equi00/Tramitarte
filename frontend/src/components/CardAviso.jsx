import { Card, CardHeader, Heading } from "@chakra-ui/react"

const CardAviso = ({text}) => {

    return(
        <Card
        borderRadius="45px"
        bg="rgba(255, 255, 255, 0.8)"
        align="center"
        p="1.6rem"
      >
        <CardHeader>
          <Heading textAlign="center" size="md">{text}</Heading>
        </CardHeader>
      </Card>
    )
}

export default CardAviso