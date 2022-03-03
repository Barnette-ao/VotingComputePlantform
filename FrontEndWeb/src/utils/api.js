import { post } from './http'

export const login = (params) => post('/', params)
export const register = (params) => post('/register', params)