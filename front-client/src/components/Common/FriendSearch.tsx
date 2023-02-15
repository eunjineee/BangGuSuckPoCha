import axios from 'axios';
import {useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'src/store/hooks';
import { changeFriendSearchState } from 'src/store/store';
import styles from './Common.module.css'

function FriendSearch(): JSX.Element {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [chat,setChat] = useState()
  const searchFriend = useRef<any>()
  const userName = localStorage.getItem("Username");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return (
    <div>
      <div
        className={`bg-slate-800 bg-opacity-50 fixed  w-full h-full text-white z-10`}
        ref={searchFriend}
        onClick={(e)=> {
          if (e.target === searchFriend.current) {
            dispatch(changeFriendSearchState(false))
          }
        }}
      >
        <div 
          className={`flex justify-center items-center min-w-[50rem] w-[50rem] min-h-[18rem] h-[18rem] bg-black  rounded-3xl relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        >
          {/* 친구요청 */}
          <div className="grid h-full w-[70%] py-2 text-white" style={{gridTemplateRows: '0.7fr 0.7fr 0.6fr'}}>
            <div className={`flex justify-center items-end pb-2 w-full h-full  text-[1.9rem] ${styles.friendRequest}`}>친구 요청</div>
            <div className="grid min-h-full h-full w-full " style={{gridTemplateRows: '0.5fr 1fr'}}>
              <div className={`h-[100%] text-[1.1rem] opacity-60 ${styles.friednSentence}`}>친구의 닉네임을 알고 계신다면 친구요청을 보내보세요!</div>
              <div className="h-[100%] flex justify-center items-center" >
                <div className={`h-full w-[80%] flex justify-start items-end pl-6 pb-1 text-[1rem] cursor-pointer ${styles.friendName}`} style={{borderBottom: 'groove 3px rgba(255,255,255,0.3)'}}> <label htmlFor="friendInput">NAME <input id='friendInput' autoFocus  className={`pl-6 bg-black ${styles.friendInput}`} type="text" 
                  onChange={(e:any)=> {
                    setChat(e.target.value)
                  }}

                  onKeyDown={(e)=> {
                    if (e.key === 'Enter') {
                      const username = localStorage.getItem('Username')
                      axios({
                        method: 'post',
                        url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}/${chat}`,
                        data: {
                          nickname: chat,
                          username: username
                        },
                        headers: {
                          accessToken: `${accessToken}`,
                        },
                      })
                      .then((r)=> {
                        if (r.data.status === '401') {
                          axios({
                            method: 'get',
                            url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${userName}`,
                            headers: {
                              refreshToken: `${refreshToken}`,
                            }
                          }).then((r)=> {
                            // 돌려보내기
                            if (r.data.status === '401') {
                              localStorage.clear();
                              toast.error('인증되지 않은 유저입니다')
                              navigate('/')
                            } else {
                              // 엑세스 토큰 추가
                              localStorage.setItem("accessToken", r.data.accessToken);
                              // 재요청
                              axios({
                                method: 'post',
                                url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}/${chat}`,
                                data: {
                                  nickname: chat,
                                  username: username
                                },
                                headers: {
                                  accessToken: `${r.data.accessToken}`,
                                },
                              }).then((r)=> {
                                console.log('요청받은 데이터: ',r.data.message)
                                const msg = r.data.message
                                if (msg === 'checkNickname') {
                                  toast.error("닉네임을 한번 더 확인해주세요");
                                } else if (msg === 'isFriend') {
                                  toast.error(`이미 ${chat}님과 친구입니다`);
                                } else if (msg === 'isFriend') {
                                  toast.error(`이미 ${chat}님께 요청을 보냈습니다`);
                                } else {
                                  toast.success(`${chat}님께 요청을 보냈습니다`);
                                  setTimeout(() => {
                                    dispatch(changeFriendSearchState(false))
                                  }, 100);
                                }
                              })
                            }
                          })
                        } else {
                          // 토큰에 변화가 없을 경우
                          console.log('요청받은 데이터: ',r.data.message)
                          const msg = r.data.message
                          if (msg === 'checkNickname') {
                            toast.error("닉네임을 한번 더 확인해주세요");
                          } else if (msg === 'isFriend') {
                            toast.error(`이미 ${chat}님과 친구입니다`);
                          } else if (msg === 'isFriend') {
                            toast.error(`이미 ${chat}님께 요청을 보냈습니다`);
                          } else {
                            toast.success(`${chat}님께 요청을 보냈습니다`);
                            setTimeout(() => {
                              dispatch(changeFriendSearchState(false))
                            }, 100);
                          }
                        }
                        // console.log('요청받은 데이터: ',r.data.message)
                        // const msg = r.data.message
                        // if (msg === 'checkNickname') {
                        //   toast.error("닉네임을 한번 더 확인해주세요");
                        // } else if (msg === 'isFriend') {
                        //   toast.error(`이미 ${chat}님과 친구입니다`);
                        // } else if (msg === 'isFriend') {
                        //   toast.error(`이미 ${chat}님께 요청을 보냈습니다`);
                        // } else {
                        //   toast.success(`${chat}님께 요청을 보냈습니다`);
                        //   setTimeout(() => {
                        //     dispatch(changeFriendSearchState(false))
                        //   }, 100);
                        // }
                      })
                    }  
                  }}
                /></label></div> 
                <div className={`h-full w-[20%] flex justify-start items-end pl-4 pb-[0.1rem] text-[0.85rem] cursor-pointer`}><span className={`flex justify-center items-center rounded-md w-full h-[50%] ${styles.friendSendMsg}`}
                onClick={()=> {
                  const username = localStorage.getItem('Username')
                      axios({
                        method: 'post',
                        url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}/${chat}`,
                        data: {
                          nickname: chat,
                          username: username
                        },
                        headers: {
                          accessToken: `${accessToken}`,
                        },
                      })
                      .then((r)=> {
                        if (r.data.status === '401') {
                          axios({
                            method: 'get',
                            url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${userName}`,
                            headers: {
                              refreshToken: `${refreshToken}`,
                            }
                          }).then((r)=> {
                            // 돌려보내기
                            if (r.data.status === '401') {
                              localStorage.clear();
                              toast.error('인증되지 않은 유저입니다')
                              navigate('/')
                            } else {
                              // 엑세스 토큰 추가
                              localStorage.setItem("accessToken", r.data.accessToken);
                              // 재요청
                              axios({
                                method: 'post',
                                url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}/${chat}`,
                                data: {
                                  nickname: chat,
                                  username: username
                                },
                                headers: {
                                  accessToken: `${r.data.accessToken}`,
                                },
                              }).then((r)=> {
                                console.log('요청받은 데이터: ',r.data.message)
                                const msg = r.data.message
                                if (msg === 'checkNickname') {
                                  toast.error("닉네임을 한번 더 확인해주세요");
                                } else if (msg === 'isFriend') {
                                  toast.error(`이미 ${chat}님과 친구입니다`);
                                } else if (msg === 'isFriend') {
                                  toast.error(`이미 ${chat}님께 요청을 보냈습니다`);
                                } else {
                                  toast.success(`${chat}님께 요청을 보냈습니다`);
                                  setTimeout(() => {
                                    dispatch(changeFriendSearchState(false))
                                  }, 100);
                                }
                              })
                            }
                          })
                        } else {
                          console.log('요청받은 데이터: ',r.data.message)
                          const msg = r.data.message
                          if (msg === 'checkNickname') {
                            toast.error("닉네임을 한번 더 확인해주세요");
                          } else if (msg === 'isFriend') {
                            toast.error(`이미 ${chat}님과 친구입니다`);
                          } else if (msg === 'isFriend') {
                            toast.error(`이미 ${chat}님께 요청을 보냈습니다`);
                          } else {
                            toast.success(`${chat}님께 요청을 보냈습니다`);
                            setTimeout(() => {
                              dispatch(changeFriendSearchState(false))
                            }, 100);
                          }
                        }
                        // console.log('요청받은 데이터: ',r.data.message)
                        // const msg = r.data.message
                        // if (msg === 'checkNickname') {
                        //   toast.error("닉네임을 한번 더 확인해주세요");
                        // } else if (msg === 'isFriend') {
                        //   toast.error(`이미 ${chat}님과 친구입니다`);
                        // } else if (msg === 'isFriend') {
                        //   toast.error(`이미 ${chat}님께 요청을 보냈습니다`);
                        // } else {
                        //   toast.success(`${chat}님께 요청을 보냈습니다`);
                        //   setTimeout(() => {
                        //     dispatch(changeFriendSearchState(false))
                        //   }, 100);
                        // }
                      })
                }}
                >요청 보내기</span></div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FriendSearch;
