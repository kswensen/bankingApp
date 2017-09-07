import { createStore, applyMiddleware } from 'redux';
import user_reducer from './ducks/user.reducer';
import promiseMiddleware from 'redux-promise-middleware';

export default createStore(user_reducer, {}, applyMiddleware(promiseMiddleware()));