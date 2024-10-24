import Axios from "./api";

const TOPOLOGY_API_PREFIX = '/topology';

class TopologyServiceType {
  async create(data) {
    return await Axios.post(`${TOPOLOGY_API_PREFIX}/create`, data)
      .then(response => {
        return response.data;
      })
  }

  async delete(tid) {
    return await Axios.delete(`${TOPOLOGY_API_PREFIX}/${tid}`)
      .then(response => {
        return response.data;
      })
  }

  async get(tid) {
    return await Axios.get(`${TOPOLOGY_API_PREFIX}/${tid}`)
      .then(response => {
        return response.data.data;
      })
  }

  async vms(tid) {
    return await Axios.get(`${TOPOLOGY_API_PREFIX}/${tid}/vms`)
      .then(response => {
        return response.data.data;
      })
  }

  async networks(tid) {
    return await Axios.get(`${TOPOLOGY_API_PREFIX}/${tid}/networks`)
      .then(response => {
        return response.data.data;
      })
  }
}

const TopologyService = new TopologyServiceType();
export default TopologyService;
