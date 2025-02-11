import { Box, Image } from '@chakra-ui/react';
import logo from '../../assets/logo.png';
import './logo-animado.css';

function LogoAnimado() {
    return <Image
            alt={"logo"}
            borderRadius="full"
            objectFit={"cover"}
            boxSize='100%'
            align={"center"}
            w={"100%"}
            h={"100%"}
            src={logo}
            className='ball'
          />
    ;
}

export default LogoAnimado;
