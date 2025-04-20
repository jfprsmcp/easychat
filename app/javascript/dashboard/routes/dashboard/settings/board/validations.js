import { required, minLength } from '@vuelidate/validators';

export const validSorterCharacters = (str = '') => !!str && !str.includes(' ');

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
  if (!validation.name.validSorterCharacters) {
    return 'BOARD.FORM.NAME.VALID_ERROR';
  }
};

export default {
  name: {
    required,
    minLength: minLength(3),
    validSorterCharacters,
  },
  color: {
    required,
  }
};
