import { createStore, combineReducers } from 'react-redux'
import {
  authReducer,
  reportReducer,
  onSaleReducer
} from '../Reducers'

const store = createStore(combineReducers({
  authReducer,
  reportReducer,
  onSaleReducer
}))

export default store