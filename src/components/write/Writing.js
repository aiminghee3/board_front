import React, {useState} from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const Writing = () =>{
    const [postData, setPostData] = useState({
        title : '',
        sex : '',
        work : '',
        age : '',
        city : '',
        content : '',
    });

    const handleInputChange = (e) => {
        setPostData({
          ...postData,
          [e.target.name]: e.target.value,
        });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = Cookies.get('accessToken');
        try {
          // POST 요청 보내기
          const response = await axios.post(`https://${process.env.REACT_APP_BASE_URL}/post/store`, postData,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
          });
        } catch (error) {
          console.error('POST 요청 에러:', error);
        }
      };

    return(
        <>
            <div className="max-w-md mx-auto h-full p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">게시글 작성</h2>
            <form onSubmit={handleSubmit}>
                {/** 제목 */}
                <div className="mb-4">
                <label htmlFor="title" className="block text-base font-medium text-gray-600">
                    제목
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={postData.title}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                    required
                />
                </div>

                {/** 성별 */}               
                <div className='mb-4'>
                    <div className="text-base font-medium text-gray-600 mb-3">성별</div>
                    <label className={`inline-flex items-center rounded-2xl border border-gray-600 cursor-pointer dark:text-gray-800 ${postData.sex === 'M' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        <input
                        type="radio"
                        name="sex"
                        value="M"
                        onChange={handleInputChange}
                        checked={postData.sex === 'M'}
                        className="hidden peer"
                        />
                        <span className={`px-6 py-2 rounded-2xl ${postData.sex === 'M' ? 'bg-black text-white' : 'bg-white text-black'}`}>남자</span>
                    </label>
                    
                    <label className={`inline-flex items-center rounded-2xl border border-gray-600 cursor-pointer dark:text-gray-800 ${postData.sex === 'F' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        <input
                        type="radio"
                        name="sex"
                        value="F"
                        onChange={handleInputChange}
                        checked={postData.sex === 'F'}
                        className="hidden peer"
                        />
                        <span className={`px-6 py-2 rounded-2xl ${postData.sex === 'F' ? 'bg-black text-white' : 'bg-white text-black'}`}>여자</span>
                    </label>
                </div>

                {/** 직장 / 학생 */}                
                <div className='mb-4'>
                    <div className="text-base font-medium text-gray-600 mb-3">직업</div>
                    <label className={`inline-flex items-center rounded-2xl border border-gray-600 cursor-pointer dark:text-gray-800 ${postData.work === '직장인' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        <input
                        type="radio"
                        name="work"
                        value="직장인"
                        onChange={handleInputChange}
                        checked={postData.work === '직장인'}
                        className="hidden peer"
                        />
                        <span className={`px-6 py-2 rounded-2xl ${postData.work === '직장인' ? 'bg-black text-white' : 'bg-white text-black'}`}>직장인</span>
                    </label>
                    
                    <label className={`inline-flex items-center rounded-2xl border border-gray-600 cursor-pointer dark:text-gray-800 ${postData.work === '학생' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        <input
                        type="radio"
                        name="work"
                        value="학생"
                        onChange={handleInputChange}
                        checked={postData.work === '학생'}
                        className="hidden peer"
                        />
                        <span className={`px-8 py-2 rounded-2xl ${postData.work === '학생' ? 'bg-black text-white' : 'bg-white text-black'}`}>학생</span>
                    </label>
                </div>

                {/** 나이 */}
                <div className='mb-4'>
                <div><span className="text-base font-medium text-gray-600">나이</span><span className = "font-semibold text-sm">(숫자만)</span></div>
                <input
                    type="text"
                    id="age"
                    name="age"
                    value={postData.age}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                    required
                />
                </div>

                {/** 지역 */}
                <div className='mb-4'>
                    <div className="text-base font-medium text-gray-600">지역<span className = "pl-1 font-medium text-sm text-gray-400">(대략적으로 적어주세요) ex : 서울시 서초구</span></div>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        placeholder='선호 지역'
                        value={postData.city}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                {/** 내용 */}
                <div className="mb-4">
                <label htmlFor="content" className="block text-base font-medium text-gray-600">
                    내용
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={postData.content}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                    rows="4"
                    required
                ></textarea>
                </div>
                <div className="text-right">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    작성하기
                </button>
                </div>
            </form>
            </div>
        </>
    )
}
export default Writing;