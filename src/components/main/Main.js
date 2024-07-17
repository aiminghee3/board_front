import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

const Main = () => {
    /**
     * 태그
     */
    const [selectedButtons, setSelectedButtons] = useState([]);

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

    const [data, setData] = useState(null);
    const [originData, setOriginData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/post/all`);
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

    /**
     * api 가져오기
     */
    useEffect(() => {
        const fetchData = async () => {
            await getData();
        };
        fetchData();
    }, []);

    /**
     * 태그 조정
     */
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
                <div className="flex w-full justify-between">
                    <div className="text-gray-700 mb-2 text-lg">태그목록</div>
                    <Link to={'/post'} className="mr-2 border-b">글 작성하기</Link>
                </div>

                {/**태그 */}
                <div className="w-full flex flex-wrap justify-start items-center">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm: mt-5">
                {loading ? (
                    // 로딩 중일 경우 로딩 상태를 표시
                    <p>Loading...</p>
                ) : (data && data.map((item) => (
                    <Link to="/detail" state={{ data: item }} key={item.id} className="col-span-1 p-2 bg-white border border-gray-400 rounded-xl hover:bg-gray-100">
                        <div className="flex items-center w-full h-10 px-1">
                            <img src={item.image} alt="난이도" className="h-6 w-6 mr-1"/>
                            <div className="font-normal text-xl sm:text-2xl">{item.problem_number}</div>
                        </div>
                        <div className="h-10 w-full pl-2 mt-1">
                            <div className="font-normal text-lg sm:text-xl text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">{item.title}</div>
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
        </>
    );
}
export default Main;