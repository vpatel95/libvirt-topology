import axios from 'axios';
import {SessionStore} from '/src/services/store';

const BASE_URL = import.meta.env.VITE_API_URL + '/api';
const AUTH_API_PREFIX = '/auth';
const TOPOLOGY_API_PREFIX = '/topology';
const NETWORK_API_PREFIX = '/network';
const USER_API_PREFIX = '/user';
const VM_API_PREFIX = '/vm';


const Axios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const setupInterceptors = (navigate) => {
    Axios.interceptors.request.use(
        config => {
            const controller = new AbortController();
            config.signal = controller.signal;
            const accessToken = SessionStore.getToken();
            if (accessToken) {
                config.headers.Authorization = `${accessToken}`;
            }

            return config;
        }, (error) => Promise.reject(error)
    );

    Axios.interceptors.response.use(
        response => response,
        async (error) => {
            if (error?.response?.status === 401) {
                SessionStore.resetSession();
                navigate('/auth/login', {state: {prevPath: true}});
            } else {
                return Promise.reject(error);
            }
        }
    );
}

const AuthAPI = {
  login: (username, password) => {
    return Axios.post(`${AUTH_API_PREFIX}/login`, {username, password})
  },
  logout: () => {
    return Axios.post(`${AUTH_API_PREFIX}/logout`)
  },
  register: (name, username, email, password) => {
    console.log(name, username, email, password);
    return null;
  }
};


const TopologyAPI = {
  create: (data) => {
    return Axios.post(`${TOPOLOGY_API_PREFIX}/create`, data)
  },
  delete: (id) => {
    return Axios.delete(`${TOPOLOGY_API_PREFIX}/${id}`)
  },
  get: (id) => {
    return Axios.get(`${TOPOLOGY_API_PREFIX}/${id}`)
  },
  vms: (id) => {
    return Axios.get(`${TOPOLOGY_API_PREFIX}/${id}/vms`)
  },
  networks: (id) => {
    return Axios.get(`${TOPOLOGY_API_PREFIX}/${id}/networks`)
  }
};

const NetworkAPI = {
  get: (id) => {
    return Axios.get(`${NETWORK_API_PREFIX}/${id}`)
  },

  attachedVms: (id) => {
    return Axios.get(`${NETWORK_API_PREFIX}/${id}/attached_vms`)
  },

  create: (data) => {
    return Axios.post(`${NETWORK_API_PREFIX}/create`, data)
  },

  delete: (id) => {
    return Axios.delete(`${NETWORK_API_PREFIX}/${id}`)
  }
};

const UserAPI = {
  topologies: (user_id) => {
    return Axios.get(`${USER_API_PREFIX}/${user_id}/topologies`)
  },
  networks: (user_id) => {
    return Axios.get(`${USER_API_PREFIX}/${user_id}/networks`)
  },
  vms: (user_id) => {
    return Axios.get(`${USER_API_PREFIX}/${user_id}/vms`)
  },
  getUserObjects: async (user_id) => {
    let userObjects = {
      topologies: {
        name: "Topologies",
        link: "topologies"
      },
      networks: {
        name: "Networks",
        link: "networks"
      },
      vms: {
        name: "Virtual Machines",
        link: "virtual-machines"
      }
    };

    try {
      const topologies = await Axios.get(`${USER_API_PREFIX}/${user_id}/topologies`)
      userObjects.topologies.info = topologies.data.data;
      userObjects.topologies.size = topologies.data.data.length;
    } catch (error) {
      return null;
    }

    try {
      const networks = await Axios.get(`${USER_API_PREFIX}/${user_id}/networks`)
      userObjects.networks.info = networks.data.data;
      userObjects.networks.size = networks.data.data.length;
    } catch (error) {
      return null;
    }

    try {
      const vms = await Axios.get(`${USER_API_PREFIX}/${user_id}/vms`)
      userObjects.vms.info = vms.data.data;
      userObjects.vms.size = vms.data.data.length;
    } catch (error) {
      return null;
    }

    return userObjects;
  }
};

const VmAPI = {
  get: (id) => {
    return Axios.get(`${VM_API_PREFIX}/${id}`)
  },
  create: (data) => {
    return Axios.post(`${VM_API_PREFIX}/create`, data)
  },
  delete: (vid) => {
    return Axios.delete(`${VM_API_PREFIX}/${vid}`)
  }
}

export {
  AuthAPI,
  TopologyAPI,
  UserAPI,
  NetworkAPI,
  VmAPI,
  Axios
};
