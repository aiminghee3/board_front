import React, {useState, useEffect} from 'react';
import { Button, Modal } from 'antd';
import { Link } from 'react-router-dom';

const RequireLoginModal = (props) =>{

    {/** 모달 */}
    const [open, setOpen] = useState(false);

    const openModal = () => {
        setOpen(true);
        };

    return(
        <>
            <Modal
                    open={props.open}
                    title="알림사항"
                    width="100%"
                    className = 'top-0 w-screen h-full bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'
                    closeIcon={false} 
                    footer={(_, {}) => (
                    <>
                    <Link to = {'/login'}>
                        <Button onClick={() => setOpen(false)}>확인</Button>
                        </Link>
                    </>
                    )}
                >
                <div>로그인 후 이용해주세요</div>
            </Modal>
        </>
    )
}

export default RequireLoginModal;