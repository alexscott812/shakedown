import React, { useState } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Input,
  Link,
  Divider,
  Text,
  GridItem,
  Flex
} from '@chakra-ui/react';
import Grid from '../components/Grid';
import Card from '../components/Card.js';
import CardTitle from '../components/CardTitle.js';
import CardBody from '../components/CardBody.js';
import PageContainer from '../components/PageContainer.js';
import { Link as RouterLink, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import useQueryParams from '../hooks/useQueryParams.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useMutation } from 'react-query';
import Logo from '../components/Logo';

const Register = () => {
  useDocumentTitle('Register | shakedown');

  const { register, isAuthenticated } = useAuth();
  const [query] = useQueryParams(['redirect']);
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  const mutation = useMutation((data) => register(data));

  const validateForm = () => {
    return (
      userInfo.username.length > 0 &&
      userInfo.email.length > 0 &&
      userInfo.password.length > 0 &&
      userInfo.confirm_password.length > 0
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };

  const handleRegisterSubmit = (e) => {
    if (!validateForm()) return;
    mutation.mutate({ userInfo });
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <PageContainer>
      <Grid>
        <GridItem colStart={[1, 1, 4, 5]} colSpan={[12, 12, 6, 4]}>
          <Card>
            <CardBody>
              <Flex justifyContent="center" p={4}>
                <Logo as={NavLink} to={isAuthenticated ? '/home' : '/'} />
                {/* <Heading
                  color={useColorModeValue('brand.500', 'brand.200')}
                  as={NavLink}
                  to={isAuthenticated ? '/home' : '/'}
                  size="md"
                  fontWeight="extrabold"
                >
                  <Icon
                    as={FaBolt}
                    boxSize={4}
                    color={useColorModeValue('brand.500', 'brand.200')}
                    mr={1}
                  />
                  shakedown
                </Heading> */}
              </Flex>
              <Divider my={3} />
              <CardTitle>Register</CardTitle>
              {/* <Text mb={1}>First Name</Text>
              <Input
                mb={3}
                type="first_name"
                name="first_name"
                value={userInfo.first_name}
                placeholder="First Name"
                onChange={handleInputChange}
              />
              <Text mb={1}>Last Name</Text>
              <Input
                mb={3}
                type="last_name"
                name="last_name"
                value={userInfo.last_name}
                placeholder="Last Name"
                onChange={handleInputChange}
              /> */}
              <Text mb={1}>Username</Text>
              <Input
                mb={3}
                type="username"
                name="username"
                value={userInfo.username}
                placeholder="Username"
                onChange={handleInputChange}
              />
              <Text mb={1}>Email Address</Text>
              <Input
                mb={3}
                type="email"
                name="email"
                value={userInfo.email}
                placeholder="Email Address"
                onChange={handleInputChange}
              />
              <Text mb={1}>Password</Text>
              <Input
                mb={3}
                type="password"
                name="password"
                value={userInfo.password}
                placeholder="Password"
                onChange={handleInputChange}
              />
              <Text mb={1}>Confirm Password</Text>
              <Input
                mb={3}
                type="password"
                name="confirm_password"
                value={userInfo.confirm_password}
                placeholder="Confirm Password"
                onChange={handleInputChange}
              />
              {mutation.isError && (
                <Alert status="error" mb={3}>
                  <AlertIcon />
                  {mutation.error}
                </Alert>
              )}
              <Button
                variant="solid"
                colorScheme="brand"
                isLoading={mutation.isLoading}
                loadingText="Registering..."
                isDisabled={!validateForm() || mutation.isLoading}
                isFullWidth
                onClick={handleRegisterSubmit}
              >
                Register
              </Button>
              <Divider my={3} />
              <Box>
                <Text>
                  {'Already have an account? '}
                  <Link
                    as={RouterLink}
                    to={
                      query.redirect
                        ? `/auth/login?redirect=${encodeURIComponent(
                            query.redirect
                          )}`
                        : '/auth/login'
                    }
                    variant="brand"
                  >
                    Log In
                  </Link>
                </Text>
              </Box>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageContainer>
  );
};

export default Register;
