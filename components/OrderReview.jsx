import React, { useState, useContext, useEffect } from 'react';
import {
  Heading,
  Box,
  Stack,
  StackDivider,
  Text,
  Flex,
  Button,
  useToast,
  CircularProgress,
} from '@chakra-ui/react';
import { CartContext } from '../context/CartContext';
import { useSelector, useDispatch } from 'react-redux';
import { usePayPalScriptReducer, PayPalButtons } from '@paypal/react-paypal-js';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export const OrderReview = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [displayPaypalBtns, setDisplayPaypalBtns] = useState(false);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderIdDB, setOrderIdDB] = useState(null);
  //Get Cart context
  const { cart, clearCart } = useContext(CartContext);

  //Get CheckOut details
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const toast = useToast();

  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = itemsPrice * 0.15;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (displayPaypalBtns) {
      const loadPaymentScript = async () => {
        const response = await fetch('/api/keys/paypal', {
          method: 'GET',
          headers: {
            'Content-Typye': 'application/json',
          },
        });
        const { clientId } = await response.json();
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
      };

      loadPaymentScript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayPaypalBtns]);

  const prevStep = () => {
    dispatch({ type: 'checkout/prevStep' });
  };

  const handlePlaceOrder = async () => {
    setOrderLoading(true);
    //save the order details to the database
    const user_id = session.user._id;
    const orderItems = cart.map((cartItem) => {
      return {
        name: cartItem.title,
        description: cartItem.description,
        image: cartItem.image,
        quantity: cartItem.qty ? cartItem.qty : 1,
      };
    });

    const shippingAddress = state.shippingAddress;
    const isDelivered = false;
    const paymentMethod = 'paypal';
    const reqBody = {
      user_id,
      orderItems,
      shippingAddress,
      isPaid,
      isDelivered,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    };
    await fetch('/api/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setOrderIdDB(data._id);
        setDisplayPaypalBtns(true);
      })
      .catch((err) => setError(true));
    setOrderLoading(true);
  };

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: totalPrice,
            },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      setIsPaid(true);
      toast({
        title: 'Payment Successful',
        description: 'Thank you for your order',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });

      const { id: payment_id, status } = details;
      const email_address = details.payer.email_address;
      try {
        const response = await fetch('/api/payment/details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ payment_id, status, email_address }),
        });
        const data = response.json();
        clearCart();
        router.push(`/order/${orderIdDB}`);
      } catch (err) {
        setError(true);
      }
    });
  };

  const onError = (err) => {
    setError(true);
    toast({
      title: 'Something went wrong',
      description: { err },
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <Stack divider={<StackDivider />} spacing='4'>
      <Box>
        <Heading size='xs' textTransform={'uppercase'}>
          Shipping Address
        </Heading>
        <Text pt='2' fontSize='sm'>
          {state.shippingAddress.fullName}
        </Text>
        <Text pt='2' fontSize='sm'>
          {state.shippingAddress.address}
        </Text>
        <Text pt='2' fontSize='sm'>
          {state.shippingAddress.city}
          {state.shippingAddress.postalCode}
        </Text>
        <Text pt='2' fontSize='sm'>
          {state.shippingAddress.country}
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform={'uppercase'}>
          Payment Method
        </Heading>
        <Text pt='2' fontSize='sm'>
          {state.shippingAddress.paymentMethod
            ? state.shippingAddress.paymentMethod
            : 'Paypal'}
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform={'uppercase'}>
          Order Summary
        </Heading>
        <Text pt='2' fontSize='sm'>
          Items: ${itemsPrice}
        </Text>
        <Text pt='2' fontSize='sm'>
          Shipping: ${shippingPrice}
        </Text>
        <Text pt='2' fontSize='sm'>
          Tax: ${taxPrice}
        </Text>
        <Text pt='2' fontSize='sm'>
          Total: ${totalPrice}
        </Text>
        <Flex
          justify='center'
          align='center'
          pt='4'
          justifyContent='space-between'
        >
          {displayPaypalBtns ? (
            isPending ? (
              <CircularProgress isIndeterminate color='blue.300' />
            ) : (
              <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              />
            )
          ) : (
            <Button
              colorScheme='yellow'
              loading={orderLoading.toString()}
              size='sm'
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          )}
          <Button size='sm' onClick={prevStep}>
            Back
          </Button>
        </Flex>
      </Box>
    </Stack>
  );
};
