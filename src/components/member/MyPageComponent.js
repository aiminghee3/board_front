import React, { useState, useEffect } from "react";
import {Link, useNavigate} from 'react-router-dom';
import RequireLoginModal from "../common/RequireLoginModal";
import axios from 'axios';
import Cookies from 'js-cookie';
import { Rate } from 'antd';

const MyPageComponent = () =>{

    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [originData, setOriginData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requireLogin, setRequireSetLogin] = useState(false);
    const [selectedButtons, setSelectedButtons] = useState([]);

    const logout = () =>{
        document.cookie = 'accessToken =; Max-Age=-99999999;';
        document.cookie = 'refreshToken =; Max-Age=-99999999;';
        navigate('/');
        // Setting a cookie's Max-Age to a negative value will cause it to expire immediately
    }

    const tags = [
        { id: 1, tag: '전체' },
        { id: 2, tag: '브루트포스' },
        { id: 3, tag: '그리디' },
        { id: 4, tag: 'BFS' },
        { id: 5, tag: 'DFS' },
        { id: 6, tag: 'DP' },
        { id: 7, tag: '그래프' },
        { id: 8, tag: '정렬' },
        { id: 9, tag: '문자열' },
        // ... 계속해서 데이터를 추가
    ];

    const handleButtonClick = (button) => {
        // 선택된 버튼이 이미 있는 경우 해제, 없는 경우 추가
        setSelectedButtons((prevSelected) => {
            const isSelected = prevSelected.includes(button.tag);
            if (isSelected) {
                return prevSelected.filter((tag) => tag !== button.tag);
            } else {
                return [...prevSelected, button.tag];
            }
        });
    };

    const getData = async () => {
        const token = Cookies.get('accessToken'); // 예시: 토큰을 쿠키에서 가져옴
        const params = {
            param1: 'value1', // 여기에 필요한 쿼리 파라미터 추가
            param2: 'value2'
        };
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/post/mypage`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // 헤더에 토큰 추가
                    'Content-Type': 'application/json' // 필요에 따라 다른 헤더 추가
                },
                //params: params
            });
            // 응답에서 필요한 데이터를 추출하여 상태에 저장합니다.
            setData(response.data.posts);
            setOriginData(response.data.posts);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            // 요청이 완료되면 로딩 상태를 false로 변경합니다.
            setLoading(false);
        }
    };


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

    useEffect( ()=>{
        const fetchData = async () => {
            await verifyAccessToken();
            await getData();
        };
        fetchData();
    }, [])

    useEffect(() => {
        if (originData) {
            const filteredData = originData.filter((problem) => {
                const hashtags = problem.tags;
                if (selectedButtons.includes('전체') || selectedButtons.length === 0) {
                    return true;
                }
                return selectedButtons.some((tag) => hashtags.includes(tag));
            });
            setData(filteredData);
        }
    }, [selectedButtons, originData]);

    return (
        <>
            <div className="w-full h-20 pl-1 mb-2">
                <div className="w-full h-10 pl-1 mb-2 border-b pb-2">
                    <div className="w-full flex justify-between">
                        <div className="">내가 등록한 문제</div>
                        <button className="text-gray-500" onClick={logout}>로그아웃</button>
                    </div>
                </div>

                {/**태그 */}
                <div className="h-8 w-full flex flex-wrap justify-start items-center">
                    <div className="flex flex-wrap">
                        {tags && tags.map((item) => (
                            <button key={item.id}
                                    className={`${selectedButtons.includes(item.tag)
                                        ? 'bg-gray-400 text-green-600 text-xs'
                                        : 'bg-gray-100 text-green-600 text-xs'
                                    } rounded-xl px-3 py-1 flex justify-center items-center mr-2 mb-2`}
                                    onClick={() => handleButtonClick(item)}
                            >
                                {item.tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm: my-5">
                {loading ? (
                    // 로딩 중일 경우 로딩 상태를 표시
                    <p>Loading...</p>
                ) : (data && data.map((item) => (
                    <Link to="/detail" state={{data: item}} key={item.id} className="col-span-1 p-2 bg-white border border-gray-400 rounded-xl hover:bg-gray-100">
                        <div className="flex items-center w-full h-10 px-1">
                            <img src={item.image} alt="난이도" className="h-6 w-6 mr-1"/>
                            <div className="font-normal text-xl sm:text-2xl">{item.problem_number}</div>
                        </div>
                        <div className="h-10 w-full pl-2 mt-1">
                            <div className="font-normal text-lg sm:text-xl text-gray-700">{item.title}</div>
                        </div>
                        <div className="h-8 w-full flex justify-between items-center">
                            <div className="flex flex-wrap">
                                {item.tags.map((tagItem, index) => (
                                    <div key={index} className="bg-gray-100 rounded-lg px-3 py-1 flex justify-center items-center mr-2 mb-2">
                                        <button className="text-green-600 text-xs">{tagItem}</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Link>
                )))}
            </div>
            <RequireLoginModal open={requireLogin}/>
        </>
    );
}
export default MyPageComponent;