import Axios from './api';

const AUTH_API_PREFIX = '/auth';

class AuthServiceType {
     async login(username, password) {
        return await Axios.post(`${AUTH_API_PREFIX}/login`, {username, password})
            .then(res => {
                console.log('Login Success. Message:', res.data);
                if (res.data.user) {
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                }
                return res.data;
            });
    }

    logout() {
    }

    register(name, username, email, password) {
      console.log(name, username, email, password);
      return null;
    }

    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);

        return null;
    }
}

const AuthService = new AuthServiceType();
export default AuthService;
