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
import {
  Link as RouterLink,
  NavLink,
  Navigate,
  useNavigate
} from 'react-router-dom';
import useQueryParams from '../hooks/useQueryParams.js';
import { useAuth } from '../lib/auth';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
// import useCustomBodyStyles from '../hooks/useCustomBodyStyles.js';
import useLogin from '../hooks/mutations/useLogin.js';
import Logo from '../components/Logo';

const Login = () => {
  useDocumentTitle('Login | shakedown');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [query] = useQueryParams(['redirect']);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const login = useLogin();

  const validateForm = () => {
    return credentials.username.length > 0 && credentials.password.length > 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleLoginSubmit = async () => {
    //e.preventDefault();
    if (!validateForm) return;
    login.mutate(
      {
        credentials
        // opts: {
        //   redirectTo: query.redirect || "/",
        // },
      },
      {
        onSuccess: () => navigate(query.redirect || '/')
      }
    );
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
              <CardTitle>Log In</CardTitle>
              {/* <Text mb={1}>Email Address</Text>
              <Input
                mb={3}
                type="email"
                name="email"
                value={credentials.email}
                placeholder="Email Address"
                onChange={handleInputChange}
              /> */}
              <Text mb={1}>Username</Text>
              <Input
                mb={3}
                type="username"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleInputChange}
              />
              <Text mb={1}>Password</Text>
              <Input
                mb={3}
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleInputChange}
              />
              <Box mb={3}>
                <Link
                  as={RouterLink}
                  to="/auth/forgot-password"
                  variant="brand"
                >
                  Forgot Password?
                </Link>
              </Box>
              {login.isError && (
                <Alert status="error" mb={3}>
                  <AlertIcon />
                  {login.error}
                </Alert>
              )}
              <Button
                variant="solid"
                colorScheme="brand"
                isLoading={login.isLoading}
                loadingText="Logging in..."
                isDisabled={!validateForm() || login.isLoading}
                isFullWidth
                onClick={handleLoginSubmit}
              >
                Log In
              </Button>
              <Divider my={3} />
              <Box>
                <Text>
                  {`Don't have an account? `}
                  <Link
                    as={RouterLink}
                    to={
                      query.redirect
                        ? `/auth/register?redirect=${encodeURIComponent(
                            query.redirect
                          )}`
                        : '/auth/register'
                    }
                    variant="brand"
                  >
                    Sign Up
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

export default Login;
