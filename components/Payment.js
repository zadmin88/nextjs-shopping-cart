import React, { useState } from 'react';
import { Radio, RadioGroup, Stack, Flex, Button, Box } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';

export const PaymentMethod = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const [paymentMethod, setPaymentMethod] = useState(
    store.paymentMethod ? store.paymentMethod : ''
  );

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
    dispatch({ type: 'checkout/paymentMethod', payload: value });
  };

  const prevStep = () => {
    dispatch({ type: 'checkout/prevStep' });
  };

  const nextStep = () => {
    dispatch({ type: 'checkout/nextStep' });
  };

  return (
    <Box display='flex' flexDirection='column'>
      <RadioGroup onChange={handlePaymentMethodChange} value={paymentMethod}>
        <Stack direction='column'>
          <Radio value='paypal'>Paypal</Radio>
        </Stack>
      </RadioGroup>
      <Flex justifyContent='space-between'>
        <Button mt='4' onClick={prevStep}>
          Back
        </Button>
        <Button mt='4' onClick={nextStep}>
          Next
        </Button>
      </Flex>
    </Box>
  );
};
