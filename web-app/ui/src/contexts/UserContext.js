import React from 'react';
import AuthService from 'services/auth';
import UserService from 'services/user';

// Initial state
const initUser = {
  info: AuthService.getCurrentUser(),
  new_data: true,
  objects: {
    topologies: {},
    networks: {},
    vms: {}
  }
};

// Action Type
const UserActions = {
  SET_INFO: 0,
  SET_NEWDATA: 1,
  SET_OBJS: 2,
  SET_TOPOLOGIES: 3,
  SET_NETWORKS: 4,
  SET_VMS: 5,
};

// Reducer
const reducer = (user, action) => {
  switch (action.type) {
    case UserActions.SET_INFO:
      console.log("SET_INFO called");
      return { ...user, info: action.payload };
    case UserActions.SET_OBJS:
      console.log("SET_OBJS called");
      return { ...user, objects: action.payload };
    case UserActions.SET_NEWDATA:
      console.log("SET_NEWDATA called");
      return {...user, new_data:action.payload};
    default:
      return user;
  }
};

// Create context and provider
const UserContext = React.createContext();
const UserProvider = ({ children }) => {
  const [user, userDispatch] = React.useReducer(reducer, initUser);

  React.useEffect(() => {
    if (!user.info) {
      console.error("User not found");
      return;
    }

    if (!user.new_data) {
      console.log("No new data");
      return;
    }

    UserService.getUserObjects(user.info.id).then(
      res => {
        userDispatch({type: UserActions.SET_OBJS, payload: res});
        userDispatch({type: UserActions.SET_NEWDATA, payload: false});
      },
      error => {
        const errMsg =
          (error.response && error.response.data && error.response.data.message) ||
          error.message || error.toString();

        console.error("Fetch user Objects failed : ", errMsg);
      }
    );
  }, [user.info, user.new_data]);

  return (
    <UserContext.Provider value={{ user, userDispatch }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for using the user
const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser, UserActions };
