import React, { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const LoginComponent = () => {
    const navigate = useNavigate();

    const [login, setLogin] = useState(false);

    const [formData, setFormData] = useState({
      email: '',
      password: '',
      //confirmPassword: '',
      //termsAccepted: false,
    });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/login`, formData);
        if(response.status === 201){
          Cookies.set('accessToken', response.data.accessToken);
          Cookies.set('refreshToken', response.data.refreshToken);
          navigate('/');
        }
      } catch (error) {
        console.error('Error:', error);
        setLogin(true)
      }
    };

    return (
      <>
        <div className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Algorithm Review
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  이메일
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    비밀번호
                  </label>
                  <div className="text-sm">
                    {/**
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      비밀번호를 잊으셨나요?
                    </a>
                     */}
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                {login ? <div className = "h-1 pb-2 text-sm mb-5 text-red-400 font-medium">일치하는 계정이 없습니다.</div> : <></>}
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  로그인
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm text-gray-500">
              아직 회원이 아니신가요?{' '}
              <Link to='/signup'  className = "font-semibold leading-6 text-indigo-600 hover:text-indigo-500">회원가입</Link>
            </p>
          </div>
        </div>
      </>
    )
  }
  export default LoginComponent;
  