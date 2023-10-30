import {
  FormLabel,
  Input,
  FormControl,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Box,
  Link,
} from "@chakra-ui/react";
import AuthWrap from "./auth-wrap";
import styled from "@emotion/styled";
import { Link as ReactRouterLink } from "react-router-dom";
import { useFormik } from "formik";

const FormStyled = styled.form`
  width: 400px;
  padding: 0 20px;
`;

const Login = () => {
  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    onSubmit: (data) => {
      console.log(data);
    },
  });
  return (
    <AuthWrap>
      <FormStyled onSubmit={formik.handleSubmit}>
        <Box mb={3}>
          <Heading textAlign="center">Welcome back</Heading>
          <Text
            textAlign="center"
            color={useColorModeValue("blackAlpha.600", "whiteAlpha.300")}
            mt={2}
          >
            We've missed you! Please sign in to catch up on what you've missed
          </Text>
        </Box>
        <VStack spacing={6} align="flex-start">
          <FormControl>
            <FormLabel htmlFor="userName">Username</FormLabel>
            <Input
              type="text"
              variant="filled"
              placeholder="Enter your name..."
              name="userName"
              id="userName"
              _focus={{
                backgroundColor: `${useColorModeValue(
                  "whiteAlpha.900",
                  "blackAlpha.300",
                )}`,
              }}
              onChange={formik.handleChange}
              value={formik.values.userName}
            />
          </FormControl>
          <FormControl w="full">
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password..."
              name="password"
              variant="filled"
              id="password"
              _focus={{
                backgroundColor: `${useColorModeValue(
                  "whiteAlpha.900",
                  "blackAlpha.300",
                )}`,
              }}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <Text
              textAlign="right"
              fontSize="14px"
              fontWeight="500"
              mt={2}
              color={useColorModeValue("blue.500", "pink.400")}
            >
              Forgot Password
            </Text>
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full">
            Login
          </Button>
        </VStack>
        <Text mt={4} textAlign="center">
          Don't have account yet ?{" "}
          <Link
            as={ReactRouterLink}
            color={useColorModeValue("blue.500", "pink.400")}
            to="/register"
          >
            Sign up{" "}
          </Link>{" "}
          now to join our community
        </Text>
      </FormStyled>
    </AuthWrap>
  );
};

export default Login;
