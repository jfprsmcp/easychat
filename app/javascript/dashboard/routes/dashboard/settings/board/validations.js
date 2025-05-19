import { required, minLength } from '@vuelidate/validators';

export const getStateNameErrorMessage = validation => {
  if (!validation.name.$error) {
    return '';
  }
  if (!validation.name.required) {
    return 'BOARD.FORM.NAME.REQUIRED_ERROR';
  }
  if (!validation.name.minLength) {
    return 'BOARD.FORM.NAME.MINIMUM_LENGTH_ERROR';
  }
};

export default {
  name: {
    required,
    minLength: minLength(3)
  },
  color: {
    required,
  }
};
