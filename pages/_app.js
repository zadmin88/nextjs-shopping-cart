import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { CartProvider } from '../context/CartContext';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { wrapper } from '../redux/store';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <PayPalScriptProvider deferLoading={true}>
          <CartProvider>
            <Provider store={store}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </Provider>
          </CartProvider>
        </PayPalScriptProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}
