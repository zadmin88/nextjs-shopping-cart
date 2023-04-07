/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import {
  Container,
  Stack,
  Heading,
  HStack,
  Text,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  useBreakpointValue,
  useColorModeValue,
  FormHelperText,
} from '@chakra-ui/react';
import Link from 'next/link';
import * as yup from 'yup';
import { signIn } from 'next-auth/react';

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Valitade form
    try {
      await loginSchema.validate(
        {
          email,
          password,
        },
        {
          abortEarly: false,
        }
      );
    } catch (err) {
      const validationErrors = {};
      if (err instanceof yup.ValidationError) {
        err.inner.forEach(({ path, message }) => {
          validationErrors[path] = message;
        });
      }
      setError(validationErrors);
      return;
    }

    const result = await signIn('credentials', {
      email: email,
      password: password,
      callbackUrl: '/',
    });

    console.log(result);

    // if (result.error) {
    //   setError(result.error);
    // }

    setEmail('');
    setPassword('');
  };

  return (
    <Container
      maxW='lg'
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <Stack spacing='8'>
        <Stack spacing='6' textAlign='center'>
          <Heading>Log in to your accont</Heading>
          <HStack spacing='1' justify='center'>
            <Text>Don&apos;t have an account?</Text>
            <Link href='/signup' passHref>
              <Button variant='link' colorScheme='pink'>
                Sing up
              </Button>
            </Link>
          </HStack>
        </Stack>
      </Stack>
      <Box
        py={{ base: '0', sm: '8' }}
        px={{ base: '4', sm: '10' }}
        bg={useBreakpointValue({ base: 'trasparent', sm: 'bg-surface' })}
        boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
        borderRadius={{ base: 'none', sm: 'xl' }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing='6'>
            <Stack spacing='5'>
              <FormControl>
                <FormLabel htmlFor='email'>Email address</FormLabel>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormHelperText color={'red.500'} id='email-helper-text'>
                  {error.email}
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='password'>Password</FormLabel>
                <Input
                  id='password'
                  type='password'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <FormHelperText color={'red.500'} id='password-helper-text'>
                  {error.password}
                </FormHelperText>
              </FormControl>
            </Stack>
            <HStack justify='space-between'>
              <Button variant='link' colorScheme='pink' size='sm'>
                Forgot password?
              </Button>
            </HStack>
            <Stack>
              <Button colorScheme='pink' type='submit'>
                Sign In
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
