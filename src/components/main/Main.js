import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Rate } from 'antd';

const Main = () =>{

    /**
     * 태그
     */
    const [selectedButtons, setSelectedButtons] = useState([]);

    const tags = [
        { id: 1, tag: '전체' },
        { id: 2, tag: '프로그래머스' },
        { id: 3, tag: '백준' },
        { id: 4, tag: 'DP' },
        { id: 5, tag: '그리디' },
        { id: 6, tag: '브루트포스' },
        { id: 7, tag: '그래프' },
        { id: 8, tag: '문자열' },
        { id: 9, tag: '정렬' },
        { id: 10, tag: '스택' },
        { id: 11, tag: '큐' },
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
    const [originData, setOriginData] = useState(null)
    const [loading, setLoading] = useState(true);
    
    const getData = async() =>{
        try {
            const response = await axios.get(`https://${process.env.REACT_APP_BASE_URL}/post/getAll`);
            // 응답에서 필요한 데이터를 추출하여 상태에 저장합니다.
            await setData(response.data.post);
            await setOriginData(response.data.post);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            // 요청이 완료되면 로딩 상태를 false로 변경합니다.
            setLoading(false);
        }
    }

    /**
     * api 가져오기
     */
    useEffect(()=>{
        getData();        
    }, [])

    /**
     * 태그 조정   
     */
        useEffect(()=>{            
            const filteredData = originData && originData.filter((problem) => {
                const hashtags = problem.postHashtags.map((tag) => tag.hashtag.tag);
                console.log(problem)
                if(selectedButtons.includes('전체') || selectedButtons.length === 0){
                    return originData;
                }
                return selectedButtons.some((tag) => hashtags.includes(tag));
              });
            setData(filteredData)
        }, [selectedButtons])

    return(
        <>
            <div className = "w-full h-20 pl-1 mb-2">
                <div className = "flex w-full justify-between">
                    <div className = "text-gray-700 mb-2 text-lg">태그목록</div>
                    <Link to = {'/post'} className = "mr-2 border-b">글 작성하기</Link>
                </div>
                
                {/**태그 */}
                <div className = "h-8 w-full flex justify-between items-center">
                    <div className = "flex">
                            {tags && tags.map((item) => (
                                <button key={item.id}
                                className={`${selectedButtons.includes(item.tag)
                                    ? 'bg-gray-400 text-green-600 text-xs'
                                    : 'bg-gray-100 text-green-600 text-xs'
                                } rounded-xl px-3 py-1 flex justify-center items-center mr-2`}
                                onClick={() => handleButtonClick(item)}
                                >
                                {item.tag}
                                </button>
                            ))}
                        </div>
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
                        {item.postHashtags.map((item) => (
                            <div key = {item.id} className = "bg-gray-100 rounded-lg px-3 py-1 flex justify-center items-center mr-2">
                                <button className = "text-green-600 text-xs">{item.hashtag.tag}</button>
                            </div>
                        ))}
                        </div>
                    </div>

                    </Link>
                )))}
            </div>
            
        </>
    )
}
export default Main;