import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {  useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
import { api } from '../../shared/ipConfig';
const userContextApi = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setuser] = useState({});
  const [permission, setpermission] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const usenavigate = useNavigate();
  const onLoad = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token) {
      usenavigate('/');
    
    } else {
      setIsLogin(true);
      const jwtdecode = jwtDecode(token);
      try {
        const { data: users } = await api.get(`/users/${jwtdecode.id}`);
        console.log("users",users)
        // console.log("users",users)
        setuser(users);
        
      } catch (error) {
        console.log("err");
      }
    }
  }, [usenavigate]);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  const LogOut = () => {
    Cookies.remove('token');
    sessionStorage.removeItem('selectedfaculty');
    setIsLogin(false);
    setpermission([]);
    setuser('');
    usenavigate('/');
  };

  return (
    <userContextApi.Provider
      value={{

        isLogin,
        LogOut,
        setIsLogin,
        onLoad,
        user,
        permission,
      }}
    >
      {children}
    </userContextApi.Provider>
  );
};

export const useUserContext = () => {
  return useContext(userContextApi);
};
