import Axios from "./api";

const VM_API_PREFIX = '/vm';

class VmServiceType {
  async create(data) {
    return await Axios.post(`${VM_API_PREFIX}/create`, data)
      .then(response => {
        return response.data;
      })
  }

  async delete(vid) {
    return await Axios.delete(`${VM_API_PREFIX}/${vid}`)
      .then(response => {
        return response.data;
      })
  }
}

const VmService = new VmServiceType();
export default VmService;
