import axios from 'axios';

const Axios = axios.create({
    baseURL: 'http://10.87.1.25:5000/api',
    withCredentials: true,
});

export default Axios;
