import { isEmpty } from 'lodash';

export default (field, errors = {}) => {
  if(isEmpty(errors)) return '';
  if(!errors[field]) return ''
  return errors[field].map(error => error.trim()).join(', \m');
}