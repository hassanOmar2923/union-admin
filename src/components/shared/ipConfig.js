import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const api = axios.create({ 
  // baseURL: import.meta.env.VITE_APP_API
  // baseURL: 'http://localhost:3006'
  baseURL: 'https://certificate-app-seven.vercel.app'
 });
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    const auth = token ? `Bearer ${token}` : '';
    config.headers.Authorization = auth;
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      console.log('?', error.response?.data.message, 'error');
      if (error.response?.data.message) {

        toast.error(error.response?.data.message);
      }
      if (error.response.status === 403) {
        toast.error(error.response?.data.message);
        // localStorage.removeItem('token');
        window.location.href = '/';
      }
    } catch (error) {
      toast.error('internal error: ');
      console.log('?', error.message);
    }
    // toast.error(error.response?.data.message)
  }
);

// import.meta.env.VITE_SOME_KEY
export const AddQuery = (endpoint, query) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => await api.post(`${endpoint}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [query] });
      // console.log("val")
    },
  });
};

export const UpdateQeury = (endpoint, query) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => await api.put(`${endpoint}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [query] });
    },
  });
};

export const DeleteQuery = (endpoint, query) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => await api.delete(`${endpoint}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [query] });
    },
  });
};

export const getQuery = (endpoint, query) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [query],
    queryFn: async () => await api.get(`${endpoint}`),
    onSuccess: () => {
      // queryClient.invalidateQueries({queryKey:[query]})
    },
  });
};
export const GetById = (Endpoint, id, querykey) => {
  return useQuery({
    queryKey: [querykey],
    queryFn: async () => await api.get(`${Endpoint}/${id}`),
  });
};

export const deleteFileFromCloudinary = async (fileId) => {
  try {
    const response = await api.post('/seminar/delete-image', {
      public_id: fileId
    });
    return "done";
  } catch (error) {
    console.error('Error deleting file from Cloudinary', error);
    throw error;
  }
};
