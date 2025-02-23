import { Card, CardHeader, Heading } from "@chakra-ui/react"

const WarningCard = ({text}) => {

    return(
        <Card
        borderRadius="45px"
        bg="rgba(255, 255, 255, 0.8)"
        justifyContent="center"
        p="1.6rem"
      >
        <CardHeader>
          <Heading textAlign="center" size="md">{text}</Heading>
        </CardHeader>
      </Card>
    )
}

export default WarningCard