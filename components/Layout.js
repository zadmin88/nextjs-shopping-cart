import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Box,
  Flex,
  Text,
  Stack,
  Button,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import CartIcon from './CartIcon';
import { useSession, signOut } from 'next-auth/react';

const Layout = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: session, status } = useSession();

  return (
    <div>
      <Head>
        <title>E-commerce App</title>
      </Head>
      <Box>
        <Flex
          bg={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align={'center'}
        >
          <Flex flex={{ base: 1 }} justify={{ base: 'start', md: 'start' }}>
            <Link href={'/'} passHref>
              <Text
                fontFamily={'heading'}
                color={useColorModeValue('gray.800', 'white')}
              >
                Logo
              </Text>
            </Link>
          </Flex>
          <Stack
            flex={{ base: 1 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
          >
            {session && session.user.isAdmin && (
              <Button as='a' href='/dashboard'>
                Dashboard
              </Button>
            )}
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>

            <Link href={'/cart'} passHref>
              <CartIcon />
            </Link>
            <>
              {status === 'authenticated' ? (
                <Button
                  display={'inline-flex'}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'pink.400'}
                  href={'#'}
                  onClick={() => signOut()}
                  _hover={{ bg: 'pink.300' }}
                >
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button
                    as={'a'}
                    fontSize={'sm'}
                    fontWeight={400}
                    variant={'link'}
                    href={'/login'}
                  >
                    Sign In
                  </Button>

                  <Link href='/signup'>
                    <Button
                      display={{ base: 'none', md: 'inline-flex' }}
                      fontSize={'sm'}
                      fontWeight={600}
                      color={'white'}
                      bg={'pink.400'}
                      href={'/sign-up'}
                      _hover={{ bg: 'pink.300' }}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </>
          </Stack>
        </Flex>
      </Box>
      {children}
      <Box>
        <Flex
          bg={useColorModeValue('white', 'gray.600')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderTop={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align={'center'}
        >
          <Flex
            flex={{ base: 1 }}
            justify={{ base: 'center' }}
            alignItems={{ base: 'center' }}
          >
            <Text
              fontFamily={'heading'}
              color={useColorModeValue('gray.600', 'white')}
            >
              Copyright 2023. Webdecoded.
            </Text>
          </Flex>
        </Flex>
      </Box>
    </div>
  );
};

export default Layout;
