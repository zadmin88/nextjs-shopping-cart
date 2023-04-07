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
  FormHelperText,
  Input,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import * as yup from 'yup';
import { signIn } from 'next-auth/react';

const signUpSchema = yup.object().shape({
  name: yup
    .string()
    .min(4, 'name must be at least 4 characters')
    .required('name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Valitade form
    try {
      await signUpSchema.validate(
        {
          name,
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

    fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          // console.log('User created successfully');
          signIn('credentials', {
            email: email,
            password: password,
            callbackUrl: '/',
          })
            .then((result) => {
              console.log(result);
            })
            .catch((err) => {
              setError({ api: err.toString() });
            });
        } else {
          console.log('User creation failed');
          setError({ api: 'Could not create an account, Please try later' });
        }
      })
      .catch((error) => console.log(('Signup API error: ', error)));
    setName('');
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
          <Heading>Create your account</Heading>
          <HStack spacing='1' justify='center'>
            <Text>Already have an account?</Text>
            <Link href='/login' passHref>
              <Button variant='link' colorScheme='pink'>
                Sing In
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
                <FormLabel htmlFor='name'>Name</FormLabel>
                <Input
                  id='name'
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />{' '}
                <FormHelperText color={'red.500'} id='name-helper-text'>
                  {error.name}
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='email'>Email address</FormLabel>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />{' '}
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
                />{' '}
                <FormHelperText color={'red.500'} id='password-helper-text'>
                  {error.password}
                </FormHelperText>
              </FormControl>
            </Stack>

            <Stack>
              <Button colorScheme='pink' type='submit'>
                Sign Up
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default SignUpPage;
