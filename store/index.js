import Vuex from 'vuex'
import UserModule from './UserModule'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      UserModule
    }
  })
}

export default createStore
