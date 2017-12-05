import { createStore } from 'redux'
import reducers from '../reducers'

const createReduxStore = () => createStore(...reducers)

export default createReduxStore
