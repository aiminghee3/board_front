import React, { useState, useEffect } from "react";
import {Link, useNavigate} from 'react-router-dom';
import RequireLoginModal from "../common/RequireLoginModal";
import axios from 'axios';
import Cookies from 'js-cookie';
import { Rate } from 'antd';

const MyPageComponent = () =>{

    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const getData = async() =>{
        const memberId = parseInt(Cookies.get('id'));
        const token = Cookies.get('token');
        try {
            // 서버의 API 엔드포인트에 GET 요청을 보냅니다.
            const response = await axios.get(`https://${process.env.REACT_APP_BASE_URL}/${memberId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    },
                });
            // 응답에서 필요한 데이터를 추출하여 상태에 저장합니다.
            await setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            // 요청이 완료되면 로딩 상태를 false로 변경합니다.
            setLoading(false);
        }
    }

    //로그인 검증하기
    const [requireLogin, setRequireSetLogin] = useState(false);

    // Refresh토큰 검증
    const verifyRefreshToken = async () =>{
        const refreshToken = Cookies.get('refreshToken');
        try{
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/refresh`, {
                headers: {
                    'Authorization': `Bearer ${refreshToken}`,
                },
            });
            if(response.status === 200){
                Cookies.set('accessToken', response.data.accessToken);
            }
            else{
                await setRequireSetLogin(true);
            }
        }catch(error){
            await setRequireSetLogin(true);
            console.error('로그인 검증에 실패하셨습니다.', error);
        }
    }

    //Access토큰 검증
    const verifyAccessToken = async () =>{
        const accessToken = Cookies.get('accessToken');
        try {
            // access 토큰 검증하기
            await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/access`,  {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            //Access토큰 검증 후 실패하면 RefreshToken검증
            await verifyRefreshToken();
        }
    }

    const logout = () =>{
        document.cookie = 'accessToken =; Max-Age=-99999999;';
        document.cookie = 'refreshToken =; Max-Age=-99999999;';
        navigate('/');  
        // Setting a cookie's Max-Age to a negative value will cause it to expire immediately
    }
    /**
     * 로그인검증
     * 데이터 가져오기
     */
    useEffect( ()=>{
        verifyAccessToken();
        //getData(); 
    }, [])
    return(
        <>
            <div className = "w-full h-10 pl-1 mb-2 border-b pb-2">
                
                <div className = "w-full flex justify-between">
                    <div className = "">내가 등록한 문제</div>
                    <button className = "text-gray-500" onClick={logout}>로그아웃</button>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-3">
                {loading ? (
                    // 로딩 중일 경우 로딩 상태를 표시
                    <p>Loading...</p>
                ) : (data && data.map((item) => (
                    <Link to = "/detail" state = {{ data: item }} key={item.id} className="col-span-1 p-2 bg-white h-32 w-full border border-gray-400 rounded-xl hover:bg-gray-100">
                    
                    <div className = "flex justify-around items-center w-full h-10">
                        <div className = "font-normal text-xl mr-2">{item.problem_number}번</div>
                        <Rate className = "text-md" allowHalf defaultValue={item.rate} disabled/>
                    </div>
                    
                    <div className = "h-10 w-full pl-2">
                        <div className = "font-normal text-xl text-gray-700">{item.title}</div>
                    </div>
                    <div className = "h-8 w-full flex justify-between items-center">

                        <div className = "flex">
                        {item.Hashtags.map((item) => (
                            <div key = {item.id} className = "bg-gray-100 rounded-lg px-3 py-1 flex justify-center items-center mr-2">
                                <button className = "text-green-600 text-xs">{item.name}</button>
                            </div>
                        ))}
                        </div>
                    </div>

                    </Link>
                )))}
                <RequireLoginModal open = {requireLogin}/>
            </div>
            
        </>
    )
}
export default MyPageComponent;