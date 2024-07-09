
import React, { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

const SignupComponent = () =>{
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [email, setEmail] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordCheck : '',
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
        console.log(formData);
        // 비밀번호가 특수문자가 최소 1개, 알파벳이 포함되어야 하며, 8~20글자 사이여야 함
        const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,20}$/;
        if(formData.password !== formData.passwordCheck){
            setError('비밀번호가 서로 일치하지 않습니다.');
        }
        else if (!passwordRegex.test(formData.password)) {
            setError('특수문자가 1개 알파벳 조합 8~20글자로 작성해주세요');
        }
        else{
            console.log(formData);
            try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/member/signup`, formData);
                if(response.status === 201){
                 navigate('/login');
                }
            } catch (error) {
                if(error.response.status === 409) {
                setError('이미 존재하는 이메일입니다.');
                }
            setEmail(true)
            console.error('Error:', error);
            }
        }
      };

    return (
        <>
        <section class="bg-gray-50">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 ">
                    <img class="w-8 h-8 mr-2" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="logo"/>
                    Algorithm Review
                </a>
                <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                            회원가입
                        </h1>
                        <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900">이메일</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    onChange={handleChange}
                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@naver.com" required=""/>
                            </div>
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">비밀번호</label>
                                <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                placeholder="••••••••" 
                                onChange={handleChange}
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required=""/>
                            </div>
                            <div>
                                <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 ">비밀번호 확인</label>
                                <input
                                type="password" 
                                name="passwordCheck"
                                id="confirm-password" 
                                placeholder="••••••••"
                                onChange={handleChange}
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required=""/>
                            </div>
                            {error ? <div className = "h-1 pb-2 text-sm text-red-400 font-medium">{error}</div> : <></>}
                            <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">계정 생성</button>
                            <p class="text-sm font-light text-gray-500">
                                이미 계정이 있으신가요? <Link to='/login' class="font-medium text-black hover:underline">로그인</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            </section>
        </>
    )
}
export default SignupComponent;