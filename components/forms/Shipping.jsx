import Reac, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
  Button,
  FormHelperText,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';

const shippingAddressSchema = Yup.object().shape({
  fullName: Yup.string().required('Name is require'),
  address: Yup.string().required('address is require'),
  city: Yup.string().required('city is require'),
  postalCode: Yup.number().required('postalCode is require'),
  country: Yup.string().required('country is require'),
});

const ShippingAddressForm = () => {
  const dispatch = useDispatch();
  const address = useSelector((state) => state.shippingAddress);
  const [error, setError] = useState({});
  const [formValues, setFormValues] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    address ? setFormValues(address) : '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the form fields
    try {
      await shippingAddressSchema.validate(formValues, {
        abortEarly: false,
      });
    } catch (err) {
      const validationErrors = {};
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach(({ path, message }) => {
          validationErrors[path] = message;
        });
      }
      setError(validationErrors);
      return;
    }
    dispatch({ type: 'address/saveShippingAddress', payload: formValues });
    //re-direct to the next form
    dispatch({ type: 'checkout/nextStep' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel htmlFor='fullName'>Full Name</FormLabel>
        <Input
          placeholder='Jhon Doe'
          name='fullName'
          value={formValues.fullName}
          onChange={handleChange}
        ></Input>
        <FormHelperText color={'red.500'} id='fullName-helper-text'>
          {error.fullName}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor='address'>Address</FormLabel>
        <Input
          placeholder='123 main St'
          name='address'
          value={formValues.address}
          onChange={handleChange}
        ></Input>
        <FormHelperText color={'red.500'} id='address-helper-text'>
          {error.address}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor='city'>City</FormLabel>
        <Input
          placeholder='Ghotic city'
          name='city'
          value={formValues.city}
          onChange={handleChange}
        ></Input>
        <FormHelperText color={'red.500'} id='city-helper-text'>
          {error.city}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor='postalCode'>Postal Code</FormLabel>
        <Input
          placeholder='12345'
          name='postalCode'
          value={formValues.postalCode}
          onChange={handleChange}
        ></Input>
        <FormHelperText color={'red.500'} id='postalCode-helper-text'>
          {error.postalCode}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor='country'>Country</FormLabel>
        <Select
          placeholder='Select a country'
          name='country'
          value={formValues.country}
          onChange={handleChange}
        >
          <option value='us'>United States</option>
          <option value='mx'>Mexico</option>
          <option value='ca'>Canada</option>
        </Select>
        <FormHelperText color={'red.500'} id='country-helper-text'>
          {error.country}
        </FormHelperText>
      </FormControl>
      <Flex display={'flex'} justifyContent='flex-end'>
        <Button type='submit' mt={4}>
          Cotinue
        </Button>
      </Flex>
    </form>
  );
};

export default ShippingAddressForm;
