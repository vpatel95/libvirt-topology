import Axios from "./api";

const NETWORK_API_PREFIX = '/network';

class NetworkServiceType {
  async get(nid) {
    return await Axios.get(`${NETWORK_API_PREFIX}/${nid}`)
      .then(response => {
        return response.data.data;
      })
  }

  async attachedVms(nid) {
    return await Axios.get(`${NETWORK_API_PREFIX}/${nid}/attached_vms`)
      .then(response => {
        return response.data.data;
      })
  }

  async create(data) {
    return await Axios.post(`${NETWORK_API_PREFIX}/create`, data)
      .then(response => {
        return response.data;
      })
  }

  async delete(nid) {
    return await Axios.delete(`${NETWORK_API_PREFIX}/${nid}`)
      .then(response => {
        return response.data;
      })
  }
}

const NetworkService = new NetworkServiceType();
export default NetworkService;
