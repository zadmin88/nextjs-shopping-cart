import React from 'react';
import { useRouter } from 'next/router';
import { Progress, Card, CardHeader, CardBody, Box } from '@chakra-ui/react';

const OrderConfirmationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  return (
    <Box>
      <Progress value={3} max={3} />
      <Card>
        <CardHeader>Thank you for yout order!</CardHeader>
        <CardBody>
          <p>Order Id: {id}</p>
        </CardBody>
      </Card>
    </Box>
  );
};

export default OrderConfirmationPage;
