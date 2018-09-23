import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form'

import account from './account';
import style from './style';
import screen from './screen';
import contents from './contents';

export default combineReducers({
  account,
  screen,
  contents,
  style,
  form: formReducer,
})
