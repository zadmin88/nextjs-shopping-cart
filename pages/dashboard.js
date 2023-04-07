import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Container,
  Spinner,
  Flex,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Tbody,
  Td,
  Th,
} from '@chakra-ui/react';

const DashboardPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (session && !session.user.isAdmin) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getOrders() {
    setLoading(true);
    try {
      const response = await fetch('/api/list-orders');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  if (loading) {
    return (
      <Flex justifyContent='center' alignItems='center'>
        <Spinner />
      </Flex>
    );
  }
  console.log(orders);
  return (
    <Container>
      <TableContainer>
        <Table variant='simple'>
          <TableCaption>Orders</TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Payment Method</Th>
              <Th>Total Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order._id}>
                <Td>{order._id}</Td>
                <Td>{order.paymentMethod}</Td>
                <Td>{order.totalPrice}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DashboardPage;
