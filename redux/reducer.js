import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  currentStep: 0,
  shippingAddress: {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
  paymentMethod: '',
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      // Attention! This will overwrite client state! Real apps should use proper reconciliation.
      return { ...state, ...action.payload };
    case 'address/saveShippingAddress':
      return { ...state, shippingAddress: action.payload };
    case 'checkout/nextStep':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'checkout/prevStep':
      return { ...state, currentStep: state.currentStep - 1 };
    case 'checkout/paymentMethod':
      return { ...state, paymentMethod: action.payload };
    default:
      return state;
  }
};
