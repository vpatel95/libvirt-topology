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
}

const TopologyService = new TopologyServiceType();
export default TopologyService;
