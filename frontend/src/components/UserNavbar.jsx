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
import userService from "../services/UserService";

const NavLink = ({ text, link }) => (
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
    {text}
  </Link>
);

export default function UserNavbar({ loggedUser }) {
  const { logout, user } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notifications, setNotifications] = useState()
  const bgColors = useColorModeValue("teal.300", "blue.900");
  const colors = useColorModeValue("white", "blue.900");
  const btnRef = useRef();

  const itemsMenuRequester = [
    {
      hyperlink: `/home/requester/${userId}`,
      text: "Home",
      icon: <Icon color="white" as={Home} boxSize={8} />,
    },
    {
      hyperlink: `/home/requester/${userId}/translators`,
      text: "Registered Translators",
      icon: (
        <Icon
          color="white"
          as={ConnectWithoutContact}
          bg="teal.300"
          boxSize={8}
        />
      ),
    },
    {
      hyperlink: "/frequently-asked-questions",
      text: "Frequently Asked Questions",
      icon: <QuestionIcon color="white" bg="teal.300" boxSize={8} />,
    },
    {
      hyperlink: "/documentation-uploaded",
      text: "Certificates",
      icon: <Icon color="white" as={FolderCopy} bg="teal.300" boxSize={8} />,
    },
    {
      hyperlink: "/avo-profile",
      text: "My AVO",
      icon: (
        <Icon color="white" as={FamilyRestroom} bg="teal.300" boxSize={8} />
      ),
    },
  ];

  const itemsMenuTranslator = [
    {
      hyperlink: `/home/translator/${userId}`,
      text: "Home",
      icon: <Icon color="white" as={Home} boxSize={8} />,
    },
    {
      hyperlink: `/home/translator/${userId}/pending-orders`,
      text: "Pending Orders",
      icon: <Icon color="white" as={Assignment} bg="teal.300" boxSize={8} />,
    }
  ];

  const userNotifications = async () => {
    try{
      let notifications = await userService.getNotifications(userId)
      setNotifications(notifications)
    }catch(e){
      navigate("/network-error")
    }
  }

  const deleteAlert = async (alertId) => {
    await userService.deleteAlert(alertId)
  }

  useEffect(() =>{
    userNotifications() //This will be in an infinite loop updating notifications
  }, [notifications])

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
            <Box>Process</Box>
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
                  <TagLeftIcon key={"fal"} boxSize="8" as={Email} color={notifications && notifications.length > 0 ? "red.500" : "white"} />
                  <TagLabel key={"rem"} ml={"-.4rem"} color={notifications && notifications.length > 0 ? "red.500" : "white"} fontSize={20}>
                    {notifications ? notifications.length : <div>0</div>}
                  </TagLabel>
                </Tag>
              </MenuButton>
              <MenuList color={useColorModeValue("blue.900", "white")}>
                {notifications && notifications.length === 0 ? <div>No notifications</div>:notifications && notifications.map((notification, index) => (
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
                        onClick={() => deleteAlert(notification.id)}
                        icon={<CloseIcon />}
                      />
                      {notification.description}
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
                    user ? user.picture : JSON.parse(window.localStorage.getItem('loggedUser')).photo
                  }
                />
              </MenuButton>
              <MenuList color={useColorModeValue("blue.900", "white")}>
                <MenuItem
                  onClick={() => navigate(`/user/${userId}`)}
                  icon={<AccountCircle />}
                >
                  Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  icon={<Logout />}
                >
                  Log out
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
                    {location.pathname.includes("requester") &&
                      itemsMenuRequester.map((item, index) => (
                        <Box
                          py={4}
                          borderBottom="1px solid"
                          borderColor="white"
                          key={index}
                        >
                          <NavLink
                            text={item.text}
                            link={item.hyperlink}
                            
                          />
                        </Box>
                      ))}
                    {location.pathname.includes("translator") &&
                      itemsMenuTranslator.map((item, index) => (
                        <Box
                          py={4}
                          borderBottom="1px solid"
                          borderColor="white"
                          key={index}
                        >
                          <NavLink
                            text={item.text}
                            link={item.hyperlink}
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
          {location.pathname.includes("requester") &&
            itemsMenuRequester.map((item, index) => (
              <Tab key={index} onClick={() => navigate(item.hyperlink)}>
                {item.icon}
              </Tab>
            ))}

          {location.pathname.includes("translator") &&
            itemsMenuTranslator.map((item, index) => (
              <Tab key={index} onClick={() => navigate(item.hyperlink)}>
                {item.icon}
              </Tab>
            ))}
        </TabList>
      </Tabs>
    </>
  );
}
