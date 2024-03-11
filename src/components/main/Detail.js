import React, { useState, useEffect } from "react";
import { Rate } from 'antd';
import { useLocation } from 'react-router-dom';
import {Link, useNavigate} from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import { Viewer } from '@toast-ui/react-editor';
import { Button, Modal} from 'antd';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { authorCheck } from '../../atom';


const Detail = (props) =>{
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state.data;

    {/** 모달 */}
    const [open, setOpen] = useState(false);

    const showModal = () => {
        setOpen(true);
      };
      const handleOk = () => {
        setOpen(false);
      };
    
      const handleCancel = () => {
        setOpen(false);
      };

    const deletePage = async (postId) =>{
        handleCancel();
        try {
            // 게시글 삭제 요청
            await axios.delete(`http://localhost:8080/post/delete/${postId}`);
    
            // 삭제가 성공하면 화면에서 게시글을 업데이트하거나 다시 불러올 수 있습니다.
            // 여기에서는 간단히 콘솔에 메시지 출력으로 대체합니다.
            console.log(`게시글 ID ${postId}가 성공적으로 삭제되었습니다.`);
            navigate('/');
        } catch (error) {
            console.error('게시글 삭제에 실패했습니다.', error.message);
        }
    }

    const author = useRecoilValue(authorCheck);
    const [authority, setAuthorty] = useState(false)

    useEffect(()=>{
        if(author === data.memberId)
            setAuthorty(true)
    }, [])
    return(
        <>
        <div className = "h-full max-w-3xl mx-auto">
            <div className = "h-44 w-full border-b-2 p-4">
                <div className = "w-full h-20 flex items-end pb-4">
                    <div className = "text-3xl font-semibold">{data.problem_number}번</div>
                    <div className = "text-3xl ml-2 font-semibold">{data.title}</div>
                </div>

                <div className = "flex w-full h-6 justify-between items-center">
                    <div className = "flex">
                        <Rate className = "text-md pt-0.5" allowHalf defaultValue={data.rate} disabled/>
                        <div className = "flex">
                        <div className = "ml-2">알림 예정일</div>
                        <div className = "ml-2 font-semibold">(업데이트 예정)</div>
                        </div>
                        <a href = {data.problem_link} className = "underline text-gray-500 ml-3" target="_blank" rel="noopener noreferrer">문제링크</a>
                    </div>
                    <div className = "font-extralight text-gray-600 text-sm">작성자 : {data.Member.email}</div>
                </div>

                <div className = "h-15 w-full mt-4 flex justify-between items-center">

                        <div className = "flex">
                            {data.Hashtags.map((item) => (
                                <div key = {item.id} className = "bg-gray-100 rounded-xl px-3 py-1 flex justify-center items-center mr-2">
                                    <button className = "text-green-600 text-xs">{item.name}</button>
                                </div>
                            ))}
                        </div>
                    {authority ? <div className = "pt-1 flex w-20 justify-between text-gray-400 text-sm">
                        <Link to = {'/modify'} state = {{ detail: data }}>수정</Link> | <button onClick = {() => showModal(data.id)}>삭제</button>
                    </div> : <></>}
                </div>
            </div>
            <div className = "pt-4 px-2">
                <Viewer
                initialValue={data.content}
                />
            </div>
        </div>

        <Modal
                open={open}
                title="주의"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={(_, { OkBtn, CancelBtn }) => (
                <>
                    <Button onClick= {() => deletePage(data.id)}>예</Button>
                    <Button onClick={handleOk}>아니오</Button>
                </>
                )}
            >
            <div>정말로 삭제하시겠습니까?</div>
        </Modal>
        </>
    )
}
export default Detail;