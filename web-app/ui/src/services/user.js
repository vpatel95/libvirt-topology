import Axios from "./api";

const USER_API_PREFIX = '/user';

class UserServiceType {
    async topologies(user_id) {
        return await Axios.get(`${USER_API_PREFIX}/${user_id}/topologies`)
            .then(response => {
                return response.data.data;
            })
    }

    async networks(user_id) {
        return await Axios.get(`${USER_API_PREFIX}/${user_id}/networks`)
            .then(response => {
                return response.data.data;
            })
    }

    async vms(user_id) {
        return await Axios.get(`${USER_API_PREFIX}/${user_id}/vms`)
            .then(response => {
                return response.data.data;
            })
    }

    async getUserObjects(user_id) {
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
        console.error(error);
      }

      try {
        const networks = await Axios.get(`${USER_API_PREFIX}/${user_id}/networks`)
        userObjects.networks.info = networks.data.data;
        userObjects.networks.size = networks.data.data.length;
      } catch (error) {
        console.error(error);
      }

      try {
        const vms = await Axios.get(`${USER_API_PREFIX}/${user_id}/vms`)
        userObjects.vms.info = vms.data.data;
        userObjects.vms.size = vms.data.data.length;
      } catch (error) {
        console.error(error);
      }

      return userObjects;
    }
}

const UserService = new UserServiceType();
export default UserService;
