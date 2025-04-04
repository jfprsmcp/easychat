import { required, minLength } from '@vuelidate/validators';

export const validSorterCharacters = (str = '') => !!str && !str.includes(' ');

export const getSorterTitleErrorMessage = validation => {
  if (!validation.name.$error) {
    return '';
  }
  if (!validation.name.required) {
    return 'SORTER.FORM.NAME.REQUIRED_ERROR';
  }
  if (!validation.name.minLength) {
    return 'SORTER.FORM.NAME.MINIMUM_LENGTH_ERROR';
  }
  if (!validation.name.validSorterCharacters) {
    return 'SORTER.FORM.NAME.VALID_ERROR';
  }
};

export const getSorterDescriptionErrorMessage = validation => {
  if (!validation.description.$error) {
    return '';
  }
  if (!validation.description.required) {
    return 'SORTER.FORM.DESCRIPTION.REQUIRED_ERROR';
  }
  if (!validation.description.minLength) {
    return 'SORTER.FORM.DESCRIPTION.MINIMUM_LENGTH_ERROR';
  }
};


export default {
  name: {
    required,
    minLength: minLength(2),
    validSorterCharacters,
  },
  description: {
    required,
    minLength: minLength(10),
  },
  color: {
    required,
  }
};
