import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../ContextApi/userContext";

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ThreeCircles } from "react-loader-spinner"
export default function Login() {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
      } = useForm();
      const [timeOfDay, setTimeOfDay] = useState('');
      const [isloading, setisloading] = useState(false);

      const determineTimeOfDay = () => {
        Cookies.remove('token')
        const currentHour = new Date().getUTCHours() + 3; // Adding 3 hours for EAT
    
        if (currentHour >= 6 && currentHour < 12) {
          setTimeOfDay('Good Morning!!');
        } else if (currentHour >= 12 && currentHour < 18) {
          setTimeOfDay('Good Afternoon!!');
        } else {
          setTimeOfDay('Good Night!!');
        }
      };
      useEffect(() => {
        determineTimeOfDay();
      }, []);

      const usenavigate = useNavigate();
      const  {setIsLogin} = useUserContext()

const login=async(value)=>{
  setisloading(true)
  try {
    const {data}=await axios.post(`https://certificate-app-seven.vercel.app/users/login`, value);
    // const {data}=await axios.post(`https://haylebariiseapi.up.railway.app/login`, value);
    if(data.status === true){
      usenavigate('/dashboard');
          Cookies.set('token',data?.token);
          setIsLogin(true)
          setisloading(false)
      toast.success(data.message)
    }else{
      setisloading(false)
      toast.error(data.message)


    }
  } catch (error) {
    setisloading(false)
    toast.error(error?.response?.data.message)
  }
 

}

    return (
      <div className="bg-secondary pt-20 h-[100vh]">
        <div >
        <div className="mx-auto w-full max-w-sm  items-center">
              <div>
                <img
                  className="h-20 w-auto"
                  src="/Bck.png"
                  alt="hayle bariise.."
                />
                <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-primary">
                  Sign in to your account
                </h2>
                <p className="text-sm text-primary">{timeOfDay}🙌</p>

              </div>
  
              <div className="mt-10">
                <div>
                  <form onSubmit={handleSubmit(login)}className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                         {...register('email')}
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="block px-3 w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
  
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                        Password
                      </label>
                      <div className="mt-2">
                        <input
                          id="password"
                          {...register('password')}
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          className="block px-3 w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
  
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-700">
                          Remember me
                        </label>
                      </div>
  
                      <div className="text-sm leading-6">
                        <a href="#" className="font-semibold text-primary hover:text-indigo-500">
                          Forgot password?
                        </a>
                      </div>
                    </div>
                
                    <div>
                      <button
                      disabled={isloading}
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:border-primary"
                      >
                          {isloading ? <ThreeCircles
                                height="20"
                                width="100"
                                color="white"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                                ariaLabel="three-circles-rotating"
                                outerCircleColor=""
                                innerCircleColor=""
                                middleCircleColor=""
                              /> : 'Sign in'}
                      </button>
                     
                    </div>
                  </form>
                </div>
  
              </div>
            </div>
         
        </div>

        <div className="text-center text-sm mt-5 ">
          Made by <a className="text-blue-600" href="https://www.hassanomar.dev/" target="_blank">Engr. Hassan Omar</a>
        </div>
      </div>
    )
  }
  