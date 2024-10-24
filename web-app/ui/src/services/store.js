let token = null;
let user = null;

const SessionStore = {
  setToken: _token => { token = _token; },
  getToken: () => { return token; },
  setUser: _user => { user = _user; },
  getUser: () => { return user; },
  isAuthenticated: () => { return !!(token); }
}

export {
  SessionStore
};
