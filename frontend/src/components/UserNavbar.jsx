import {
  Box,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Tabs,
  Tab,
  TabList,
  Tag,
  TagLeftIcon,
  TagLabel,
  Icon,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, QuestionIcon } from "@chakra-ui/icons";
import {
  AccountCircle,
  Assignment,
  AssignmentInd,
  ConnectWithoutContact,
  Email,
  FamilyRestroom,
  FolderCopy,
  Home,
  Logout,
} from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import usuarioService from "../services/UsuarioService";

const NavLink = ({ texto, link }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    color={useColorModeValue("white", "teal.200")}
    _hover={{
      textDecoration: "underline",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={link}
  >
    {texto}
  </Link>
);

export default function UserNavbar({ usuarioLogueado }) {
  const { logout, user } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const { idUsuario } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notificaciones, setNotificacion] = useState()
  const bgColors = useColorModeValue("teal.300", "blue.900");
  const colors = useColorModeValue("white", "blue.900");
  const btnRef = useRef();

  const itemsMenuSolicitante = [
    {
      hipervinculo: `/home/solicitante/${idUsuario}`,
      texto: "Inicio",
      icono: <Icon color="white" as={Home} boxSize={8} />,
    },
    {
      hipervinculo: `/home/solicitante/${idUsuario}/traductores`,
      texto: "Traductores Registrados",
      icono: (
        <Icon
          color="white"
          as={ConnectWithoutContact}
          bg="teal.300"
          boxSize={8}
        />
      ),
    },
    {
      hipervinculo: "/preguntas-frecuentes",
      texto: "Preguntas Frecuentes",
      icono: <QuestionIcon color="white" bg="teal.300" boxSize={8} />,
    },
    {
      hipervinculo: "/documentacion-cargada",
      texto: "Certificados",
      icono: <Icon color="white" as={FolderCopy} bg="teal.300" boxSize={8} />,
    },
    {
      hipervinculo: "/avo-profile",
      texto: "Mi AVO",
      icono: (
        <Icon color="white" as={FamilyRestroom} bg="teal.300" boxSize={8} />
      ),
    },
  ];

  const itemsMenuTraductor = [
    {
      hipervinculo: `/home/traductor/${idUsuario}`,
      texto: "Inicio",
      icono: <Icon color="white" as={Home} boxSize={8} />,
    },
    {
      hipervinculo: `/home/traductor/${idUsuario}/pedidos-pendientes`,
      texto: "Solicitudes pendientes",
      icono: <Icon color="white" as={Assignment} bg="teal.300" boxSize={8} />,
    }
  ];

  //const notificacionesanashe = ["Notificación 1", "Notificación 2"];

  const notificacionesUsuario = async () => {
    try{
      let notificacion = await usuarioService.traerNotificaciones(idUsuario)
      setNotificacion(notificacion)
    }catch(e){
      navigate("/network-error")
    }
  }

  const eliminarAlerta = async (idAlerta) => {
    await usuarioService.eliminarAlerta(idAlerta)
  }

  useEffect(() =>{
    notificacionesUsuario() //esto va a estar en loop infinito actualizando las notificaciones
  }, [notificaciones])

  return (
    <>
      <Box color={colors} bg={bgColors} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            ref={btnRef}
            bg={bgColors}
            size={"md"}
            icon={<HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ base: "none", md: "flex" }}
            onClick={isOpen ? onClose : onOpen}
            color={colors}
          />
          <HStack color="white" spacing={8} alignItems={"center"}>
            <Box>Tramitarte</Box>
          </HStack>
          <Flex
            justifyContent="space-between"
            gap=".8rem"
            alignItems={"center"}
          >
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Tag
                  borderRadius="45px"
                  size={"sm"}
                  key={"md"}
                  variant="solid"
                  bg="teal.300"
                >
                  <TagLeftIcon key={"fal"} boxSize="8" as={Email} color={notificaciones && notificaciones.length > 0 ? "red.500" : "white"} />
                  <TagLabel key={"rem"} ml={"-.4rem"} color={notificaciones && notificaciones.length > 0 ? "red.500" : "white"} fontSize={20}>
                    {notificaciones ? notificaciones.length : <div>0</div>}
                  </TagLabel>
                </Tag>
              </MenuButton>
              <MenuList color={useColorModeValue("blue.900", "white")}>
                {notificaciones && notificaciones.length === 0 ? <div>No hay notificaciones</div>:notificaciones && notificaciones.map((notificacion, index) => (
                  <>
                    <MenuItem
                      maxWidth={"17rem"}
                      display={"flex"}
                      justifyContent={"space-around"}
                      key={index}
                      _hover={{ bg: 'useColorModeValue("blue.900", "white")' }}
                    >
                      <IconButton
                        color="white"
                        bg="red.500"
                        h="5em"
                        marginRight={"10px"}
                        onClick={() => eliminarAlerta(notificacion.idNotificacion)}
                        icon={<CloseIcon />}
                      />
                      {notificacion.descripcion}
                    </MenuItem>
                  </>
                ))}
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  src={
                    user ? user.picture : JSON.parse(window.localStorage.getItem('usuarioLogueado')).fotoPerfil
                  }
                />
              </MenuButton>
              <MenuList color={useColorModeValue("blue.900", "white")}>
                <MenuItem
                  onClick={() => navigate(`/usuario/${idUsuario}`)}
                  icon={<AccountCircle />}
                >
                  Mi perfil
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  icon={<Logout />}
                >
                  Cerrar sesi&oacute;n
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent bg="teal.400">
              <DrawerCloseButton color="white" />
              <DrawerBody>
                <Box py={12}>
                  <Stack as={"nav"} spacing={4}>
                    {location.pathname.includes("solicitante") &&
                      itemsMenuSolicitante.map((item, index) => (
                        <Box
                          py={4}
                          borderBottom="1px solid"
                          borderColor="white"
                          key={index}
                        >
                          <NavLink
                            texto={item.texto}
                            link={item.hipervinculo}
                            
                          />
                        </Box>
                      ))}
                    {location.pathname.includes("traductor") &&
                      itemsMenuTraductor.map((item, index) => (
                        <Box
                          py={4}
                          borderBottom="1px solid"
                          borderColor="white"
                          key={index}
                        >
                          <NavLink
                            texto={item.texto}
                            link={item.hipervinculo}
                          />
                        </Box>
                      ))}
                  </Stack>
                </Box>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        ) : null}
      </Box>

      <Tabs
        borderRadius="20px"
        border="none"
        p="2%"
        h={16}
        w="100%"
        position="absolute"
        bottom={0}
        display={{ md: "none" }}
        variant="unstyled"
      >
        <TabList
          bg="teal.300"
          borderRadius="20px"
          border="none"
          justifyContent="space-evenly"
        >
          {location.pathname.includes("solicitante") &&
            itemsMenuSolicitante.map((item, index) => (
              <Tab key={index} onClick={() => navigate(item.hipervinculo)}>
                {item.icono}
              </Tab>
            ))}

          {location.pathname.includes("traductor") &&
            itemsMenuTraductor.map((item, index) => (
              <Tab key={index} onClick={() => navigate(item.hipervinculo)}>
                {item.icono}
              </Tab>
            ))}
        </TabList>
      </Tabs>
    </>
  );
}
