import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

const Comment = ({data}) => {
    const [loginedMemberId, setLoginedMemberId] = useState();
    const [deleteId, setDeleteId] = useState();
    const [comment, setComment] = useState('');
    const [editComment, setEditComment] = useState('');
    const [replyComment, setReplyComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [comments, setComments] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = Cookies.get('accessToken');
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/comment`, {
                postId : data.id.toString(),
                parentId : null,
                comment: comment.toString(),
                // 필요한 다른 데이터 (예: 게시글 ID, 작성자 정보 등)
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('댓글이 성공적으로 전송되었습니다:', response.data);
            setComment(''); // 댓글 작성 후 입력 필드 초기화
            await fetchComments(); // 댓글 작성 후 최신 댓글 목록을 다시 불러옴
        } catch (error) {
            console.error('댓글 전송에 실패했습니다:', error);
        }
    };

    const handleEditButton = (commentId) => {
        setIsEditing((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
        console.log(isEditing);
    };

    const handleReplyButton = (commentId) => {
        setIsReplying((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const handleDeleteButton = (commentId) => {
        setDeleteId(commentId);
        setShowDeleteModal(commentId);
    };

    const handleEditSubmit = async (e, commentId) => {
        e.preventDefault();
        // 수정된 댓글을 서버로 전송하는 로직 추가
        setIsEditing((prev) => ({
            ...prev,
            [commentId]: false,
        }));
        const token = Cookies.get('accessToken');
        try {
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/comment/${commentId}`, {
                comment: editComment.toString(),
                // 필요한 다른 데이터 (예: 게시글 ID, 작성자 정보 등)
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('댓글이 성공적으로 수정되었습니다:', response.data);
            setComment(''); // 댓글 작성 후 입력 필드 초기화
            await fetchComments(); // 댓글 작성 후 최신 댓글 목록을 다시 불러옴
        } catch (error) {
            console.error('댓글 전송에 실패했습니다:', error);
        }
    };

    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault();
        // 답글을 서버로 전송하는 로직 추가
        setIsReplying((prev) => ({
            ...prev,
            [commentId]: false,
        }));
        const token = Cookies.get('accessToken');
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/comment`, {
                postId : data.id.toString(),
                parentId : commentId,
                comment: replyComment.toString(),
                // 필요한 다른 데이터 (예: 게시글 ID, 작성자 정보 등)
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('댓글이 성공적으로 수정되었습니다:', response.data);
            setReplyComment(''); // 댓글 작성 후 입력 필드 초기화
            await fetchComments(); // 댓글 작성 후 최신 댓글 목록을 다시 불러옴
        } catch (error) {
            console.error('댓글 전송에 실패했습니다:', error);
        }
    };

    const handleDelete = async (commentId) => {
        // 댓글을 삭제하는 로직 추가
        setShowDeleteModal(false);
        const token = Cookies.get('accessToken');
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/comment`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                params:{
                    ids : deleteId.toString()
                }
            });
        } catch (error) {
            console.error('게시글 삭제에 실패했습니다.', error.message);
        }
        await fetchComments(); // 삭제 후 최신 댓글 목록을 다시 불러옴
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/comment/${data.id}`);
            await setComments(response.data.comments);
        } catch (error) {
            console.error('댓글을 불러오는데 실패했습니다:', error);
        }
    };

    const extractUserIdFromAccessToken = () => {
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
            return null;
        }
        try {
            const decodedToken = jwtDecode(accessToken);
            setLoginedMemberId(decodedToken.userId);
        } catch (error) {
            console.error('액세스 토큰을 해독하는데 실패했습니다.', error);
        }
    };

    useEffect(() => {
        console.log(data);
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/comment/${data.id}`);
                setComments(response.data.comments);
            } catch (error) {
                console.error('댓글 데이터를 가져오는 데 실패했습니다:', error);
            }
        };
        fetchComments();
        extractUserIdFromAccessToken();
        console.log(loginedMemberId);
        console.log(comments);
    }, [data]);


    return (
        <>
            <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">의견 작성하기</h2>
                    </div>
                    <form className="mb-6" onSubmit={(e) => handleSubmit(e)}>
                        <div
                            className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <label htmlFor="comment" className="sr-only">Your comment</label>
                            <textarea
                                id="comment"
                                rows="6"
                                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                placeholder="Write a comment..."
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>
                        <button type="submit"
                                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-black rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                            Post comment
                        </button>
                    </form>

                    {comments && comments
                        .filter((comment) => comment.deleted === false)
                        .map((comment) => (
                        <article key={comment.id} className="p-6 text-base bg-white rounded-lg dark:bg-gray-900 mb-4">
                            <footer className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                        <img
                                            className="mr-2 w-6 h-6 rounded-full"
                                            src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                                            alt={comment.email}/> {comment.email}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <time pubdate dateTime={comment.createdAt}
                                              title={new Date(comment.createdAt).toLocaleDateString()}>
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </time>
                                    </p>
                                </div>
                                {loginedMemberId === comment.memberId ?
                                    <div className="flex w-16 justify-between items-center">
                                        <button className="text-gray-400 hover:text-black"
                                                onClick={() => handleEditButton(comment.id)}>수정
                                        </button>
                                        <button className="text-gray-400 hover:text-black"
                                                onClick={() => handleDeleteButton(comment.id)}>삭제
                                        </button>
                                    </div> : null
                                }
                            </footer>
                            {isEditing[comment.id] ? (
                                <form onSubmit={(e) => handleEditSubmit(e, comment.id)}>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="inline-flex float-right items-center py-2 px-3 text-md font-medium text-center text-white bg-black rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                                        작성하기
                                    </button>
                                </form>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">{comment.comment}</p>
                            )}
                            <div className="flex items-center mt-4 space-x-4">
                                <button type="button"
                                        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                                        onClick={() => handleReplyButton(comment.id)}>
                                    <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                         fill="none" viewBox="0 0 20 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                              stroke-width="2"
                                              d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                                    </svg>
                                    답글
                                </button>
                            </div>
                            {isReplying[comment.id] && (
                                <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className = "mb-10">
                                    <textarea
                                        className="w-full p-2 border rounded mt-2"
                                        value={replyComment}
                                        onChange={(e) => setReplyComment(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="inline-flex float-right items-center py-2 px-3 text-sm font-medium text-center text-white bg-black rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                                        답글 작성
                                    </button>
                                </form>
                            )}
                            {comment.children
                                .filter((childComment) => childComment.deleted === false)
                                .map((childComment) => (
                                <article key={childComment.id}
                                         className="py-6 pl-6 text-base bg-white rounded-lg dark:bg-gray-900 mb-4">
                                    <footer className="flex justify-between items-center mb-4">
                                        <div className="flex items-center">
                                            <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                                <img
                                                    className="mr-2 w-6 h-6 rounded-full"
                                                    src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                                                    alt={childComment.email}/> {childComment.email}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <time pubdate dateTime={childComment.createdAt}
                                                      title={new Date(childComment.createdAt).toLocaleDateString()}>
                                                    {new Date(childComment.createdAt).toLocaleDateString()}
                                                </time>
                                            </p>
                                        </div>
                                        {loginedMemberId === childComment.memberId ?
                                            <div className="flex w-16 justify-between items-center">
                                                <button className="text-gray-400 hover:text-black"
                                                        onClick={() => handleEditButton(childComment.id)}>수정
                                                </button>
                                                <button className="text-gray-400 hover:text-black"
                                                        onClick={() => handleDeleteButton(childComment.id)}>삭제
                                                </button>
                                            </div> : null
                                        }
                                    </footer>
                                    {isEditing[childComment.id] ? (
                                        <form onSubmit={(e) => handleEditSubmit(e, childComment.id)}>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                    />
                                            <button
                                                type="submit"
                                                className="inline-flex float-right items-center py-2 px-3 text-md font-medium text-center text-white bg-black rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                                                작성하기
                                            </button>
                                        </form>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">{childComment.comment}</p>
                                    )}
                                </article>
                            ))}
                        </article>
                    ))}

                    {showDeleteModal && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white px-10 py-5 rounded-lg">
                                <p className="text-md font-bold">작성한 댓글을 삭제하시겠습니까?</p>
                                <div className="flex justify-end mt-4">
                                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg mr-2" onClick={handleDelete}>삭제</button>
                                    <button className="bg-white border px-4 py-2 rounded-lg" onClick={() => setShowDeleteModal(false)}>취소</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default Comment;