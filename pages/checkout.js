import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import ShippingAddressForm from '../components/forms/Shipping';
import {
  Progress,
  Card,
  CardHeader,
  CardFooter,
  Heading,
  CardBody,
  Stack,
  Box,
} from '@chakra-ui/react';
import { OrderReview } from '../components/OrderReview';
import { PaymentMethod } from '../components/Payment';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const activeStep = useSelector((state) => state.currentStep);

  const steps = [
    { name: 'Shipping', component: <ShippingAddressForm /> },
    { name: 'Payment', component: <PaymentMethod /> },
    { name: 'Review', component: <OrderReview /> },
  ];

  return (
    <Stack spacing={4}>
      <Progress value={activeStep} max={steps.length} />
      <Box mx='auto'>
        <Card w='xl' m='auto'>
          <CardHeader>{steps[activeStep].name}</CardHeader>
          <CardBody>{steps[activeStep].component}</CardBody>
        </Card>
      </Box>
    </Stack>
  );
};

export default CheckoutPage;
