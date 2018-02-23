import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['']
})

export const LoginTypes = Types
export default Creators

export const INITIAL_STATE = Immutable({
})

export const loginRequest = (state) =>
  state.merge({fetching: true})

export const reducer = createReducer(INITIAL_STATE, {
  [LoginTypes.LOGIN_REQUEST]: loginRequest
})
