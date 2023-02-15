import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  changeFriendSearchState,
  changeMenuFriendChatState,
  changemenuFriendClickUserData,
  changeMenuFriendListApiDataState,
  changeMenuFriendState,
  changeNavAlarmReviewEmojiUserData,
  showRoomUserProfile,
} from "../../store/store";
import styles from "./Common.module.css";
import FriendSearch from "./FriendSearch";


function FriendList(): JSX.Element {

  const navigate = useNavigate()
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  // 친구 검색
  const [searchFriend,setSearchFriend] = useState<any>()
  // 나를 확인할 유저 아이디
  const username = localStorage.getItem('Username')

  // 메뉴 클릭시
  const dispatch = useAppDispatch();
  const friendListIcon = useRef<any>(null);

  //  메뉴 -> 친구 클릭 상태
  const menuFriendClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendClickCheck;
  });
  //  메뉴 -> 친구 클릭 -> 챗팅
  const menuFriendChatClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendChatClickCheck;
  });
  //  메뉴 -> 친구 리스트
  const menuFriendListApiData: any = useAppSelector((state: any) => {
    return state.menuFriendListApiData;
  });

  // 친구 요청 검색 모달
  const friendSearchState = useAppSelector((state)=> {return  state.friendSearchState})

  // 유저 조회
  function UserStateSearch(f_username:any) {
    axios({
      method: 'get',
      url: `https://i8e201.p.ssafy.io/api/user/info/${f_username}`,
      headers: {
        accessToken: `${accessToken}`,
      },
    })
    .then((r)=> {
      // 토큰 갱신 필요
      if (r.data.status === '401') {
        axios({
          method: 'get',
          url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
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
              method: 'get',
              url: `https://i8e201.p.ssafy.io/api/user/info/${f_username}`,
              headers: {
                accessToken: `${r.data.accessToken}`,
              },
            }).then((r)=> {
              // console.log('넣어따', r.data)
              dispatch(changeNavAlarmReviewEmojiUserData(r.data))
              dispatch(showRoomUserProfile())
            })
          }
        })
      } else {
        // 갱신 필요 없을 경우 
        // console.log('넣어따', r.data)
        dispatch(changeNavAlarmReviewEmojiUserData(r.data))
        dispatch(showRoomUserProfile())
      }
    })
  }


  useEffect(() => {
    if (menuFriendClickCheck) {
      friendListIcon.current.classList.remove("hidden");
    } else {
      friendListIcon.current.classList.add("hidden");
    }
  }, [menuFriendClickCheck]);

  const emoji =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Noto_Emoji_KitKat_263a.svg/220px-Noto_Emoji_KitKat_263a.svg.png";
  // const nickname = '라면왕 한통깨'
  const logState =
    "https://upload.wikimedia.org/wikipedia/commons/0/0e/Basic_red_dot.png";

  // 클릭한 유저가 이전에 클릭한 유저와 같은지 체크
  const [checkChatId, setCheckChatId] = useState();

  
  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      // console.log(searchFriend)
      // console.log(username)
      axios({
        method: 'get',
        url: `https://i8e201.p.ssafy.io/api/user/friend/${username}/${searchFriend}`,
        headers: {
          accessToken: `${accessToken}`,
        },
      }).then((r)=> {
        if (r.data.status === '401') {
          axios({
            method: 'get',
            url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
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
                  method: 'get',
                  url: `https://i8e201.p.ssafy.io/api/user/friend/${username}/${searchFriend}`,
                  headers: {
                    accessToken: `${r.data.accessToken}`,
                  },
                }).then((r)=> {
                // console.log('요청한 친구: ',r.data.data)
                dispatch(changeMenuFriendListApiDataState(r.data.data));
                setSearchFriend("") 
                })
              }
            
          })
        } else {
          // 토큰 문제 없을 경우
           // console.log('요청한 친구: ',r.data.data)
          dispatch(changeMenuFriendListApiDataState(r.data.data));
          setSearchFriend("")
        }
      })
    }}


  function requestFriendList():any {
    // 요청 이후 친구창 재정렬
    axios({
      method: "get",
      url: `https://i8e201.p.ssafy.io/api/user/friend/${username}`,
      headers: {
        accessToken: `${accessToken}`,
      },
    }).then((r) => {
      if (r.data.status === '401') {
        axios({
          method: 'get',
          url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
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
              method: "get",
              url: `https://i8e201.p.ssafy.io/api/user/friend/${username}`,
              headers: {
                accessToken: `${r.data.accessToken}`,
              },
            }).then((r)=> {
               // console.log('친구 리스트 조회: ',r.data.data)
              const friendDataList:any[] = r.data.data
              const bestFriend:any = []
              const normalFriend:any = []

              friendDataList.forEach((data:any)=> {
                if (data.best_friend) {
                  bestFriend.push(data)
                } else {
                  normalFriend.push(data)
                }
              })
              // console.log('베프: ',bestFriend)
              // console.log('친구: ',normalFriend)
              dispatch(changeMenuFriendListApiDataState([...bestFriend,...normalFriend]));
            })
          }
        })
      } else {
        // 토큰 갱신 없을 때
          // console.log('친구 리스트 조회: ',r.data.data)
          const friendDataList:any[] = r.data.data
          const bestFriend:any = []
          const normalFriend:any = []

          friendDataList.forEach((data:any)=> {
            if (data.best_friend) {
              bestFriend.push(data)
            } else {
              normalFriend.push(data)
            }
          })
          // console.log('베프: ',bestFriend)
          // console.log('친구: ',normalFriend)
          dispatch(changeMenuFriendListApiDataState([...bestFriend,...normalFriend]));
      }
    });
  }

  const friendList = menuFriendListApiData.map((e: any, idx: any) => {
    // console.log('친구리스트 데이터: ', e);
    const checkBestFriend:boolean = e.best_friend

    function bestFriend():any {
      // 배프 요청
      axios({
        method: 'put',
        url: `https://i8e201.p.ssafy.io/api/user/friend/${username}/${e.you_id}`,
        headers: {
          accessToken: `${accessToken}`,
        },
      })
      .then((r)=> {
        if (r.data.status === '401') {
          axios({
            method: 'get',
            url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
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
                method: 'put',
                url: `https://i8e201.p.ssafy.io/api/user/friend/${username}/${e.you_id}`,
                headers: {
                  accessToken: `${r.data.accessToken}`,
                },
              }).then((r)=> {
                // console.log('베프니? ',checkBestFriend)
                if (checkBestFriend) {
                  toast.success(`${e.f_nickname} 즐겨찾기에서 제거하였습니다`)
                } else {
                  toast.success(`${e.f_nickname} 즐겨찾기에 추가하였습니다`)
                }
              }).then(requestFriendList)
              .catch(()=> {
                toast.error('다시 요청을 시도해주세요')
              }).then(requestFriendList)
            }
          })
        } else {
          // 토큰 변경 없을 때
          axios({
            method: 'put',
            url: `https://i8e201.p.ssafy.io/api/user/friend/${username}/${e.you_id}`,
            headers: {
              accessToken: `${accessToken}`,
            },
            }).then((r)=> {
              // console.log('베프니? ',checkBestFriend)
            if (checkBestFriend) {
              toast.success(`${e.f_nickname} 즐겨찾기에서 제거하였습니다`)
            } else {
              toast.success(`${e.f_nickname} 즐겨찾기에 추가하였습니다`)
            }
          })
          .then(requestFriendList)
          .catch(()=> {
            toast.error('다시 요청을 시도해주세요')
          })
          .then(requestFriendList)
          
        }
      })
    }
        

    const chat_id = e.chat_id;
    return (
      <div
        key={idx}
        className=" grid my-2 cursor-pointer "
        style={{ gridTemplateColumns: "1fr 3fr 1fr" }}
      >
        <div className="flex justify-center items-center h-full pl-2">
          <img className="object-fill rounded-full h-[2.6rem]" src={e.f_profile} alt="" onClick={()=>{
            // console.log(e)
            UserStateSearch(e.f_username)
          }}/>
        </div>
        <div
          className={`flex justify-start items-center pl-3 text-base font-semibold h-full ${styles.menuFriendNeon}`}
          onClick={() => {
            // 클릭한 유저와의 채팅 아이디 체크
            setCheckChatId(e.chat_id);
            // 채팅내용 가져오기
            axios({
              method: 'get',
              url: `https://i8e201.p.ssafy.io/api/user/friend/chat/${chat_id}`,
              headers: {
                accessToken: `${accessToken}`,
              },
            }).then((r)=> {
              if (r.data.status === '401') {
                axios({
                  method: 'get',
                  url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
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
                      method: 'get',
                      url: `https://i8e201.p.ssafy.io/api/user/friend/chat/${chat_id}`,
                      headers: {
                        accessToken: `${r.data.accessToken}`,
                      },
                    }).then((r)=> {
                      localStorage.setItem('chat_id',chat_id)
                      localStorage.setItem('f_nickname',e.f_nickname)
                      dispatch(
                        changemenuFriendClickUserData({
                          nickname: e.f_nickname,
                          data: r.data.data,
                          chat_id: chat_id
                        })
                      );
                      dispatch(changeMenuFriendChatState(!menuFriendChatClickCheck));
                    })
                  }         
                })
              } else {
                // 토큰 변화가 없을 경우
                localStorage.setItem('chat_id',chat_id)
                localStorage.setItem('f_nickname',e.f_nickname)
                dispatch(
                  changemenuFriendClickUserData({
                    nickname: e.f_nickname,
                    data: r.data.data,
                    chat_id: chat_id
                  })
                );
                dispatch(changeMenuFriendChatState(!menuFriendChatClickCheck));
              }
            })


            // const getChatList = async () => {
            //   try {
            //     const getChat = await axios({
            //       method:'get',
            //       url:`https://i8e201.p.ssafy.io/api/user/friend/chat/${chat_id}`,
            //       headers: {
            //         accessToken: `${accessToken}`,
            //       },
            //     })
            //     return getChat.data.data;
            //   } catch (error) {
            //     console.log(error);
            //   }
            // };
            // getChatList().then((data) => {
            //   localStorage.setItem('chat_id',chat_id)
            //   localStorage.setItem('f_nickname',e.f_nickname)
            //   dispatch(
            //     changemenuFriendClickUserData({
            //       nickname: e.f_nickname,
            //       data: data,
            //       chat_id: chat_id
            //     })
            //   );
            //   dispatch(changeMenuFriendChatState(!menuFriendChatClickCheck));
            // });
          }}
        >
          {e.f_nickname}
        </div>
        {
          checkBestFriend? 
          (
            // 베프면 베프해제
            <div className="flex justify-center items-center h-full">
              <img className="h-[1rem] w-[1rem]" src={require('../../assets/NavIcon/bestFriend.png')} alt="" onClick={bestFriend} />
            </div>
          ) :
          (
            <div className="flex justify-center items-center h-full">
              <img className="h-[1rem] w-[1rem]" src={require('../../assets/NavIcon/yetFriend.png')} alt="" onClick={bestFriend}/>
            </div>
          )
        }
      </div>
    );
  });

  return (
    <>
      {
        friendSearchState? <FriendSearch/>:null
      }

      <div
        ref={friendListIcon}
        className="absolute  w-[17rem] h-[35rem] top-[11.6rem] right-[2rem] hidden"
      >
        <div className="h-full w-full">
          <div className="w-full h-full">
            <div
              className="grid h-full bg-black text-white border-2 border-white"
              style={{
                gridTemplateRows: "0.5fr 0.5fr 5fr",
                borderRadius: "24px",
              }}
            >
              <div
                className="grid"
                style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1fr" }}
              >
                <div></div>
                <div className={`flex justify-center items-center h-full text-base`}>
                  친구목록
                </div>
                <div></div>
                {/* 친구 리스트 및 채팅창 닫기 */}
                <div className="flex justify-center items-center h-full">
                  <span className={`text-2xl pb-[0.3rem] ${styles.xBtn}`}
                    onClick={() => {
                      if (menuFriendChatClickCheck) {
                        dispatch(changeMenuFriendChatState(false));
                      }
                      if (menuFriendClickCheck) {
                        dispatch(changeMenuFriendState());
                      }
                      dispatch(changeFriendSearchState(false))
                    }}>
                    ×
                  </span>
                  
                </div>
              </div>
              <div className="flex justify-between items-center rounded-full bg-white h-[80%] border-2 border-stone-400">
                <input
                  className="w-[84%] h-full text-base text-black font-bold pl-3 "
                  style={{ borderRadius: "100% 0px 0px 100%" }}
                  type="text"
                  onChange={(e)=> {
                    // console.log(e.target.value)
                    setSearchFriend(e.target.value)
                  }}
                  onKeyDown={handleKeyPress}
                />
                <div className="w-[5%]"></div>
                <div className="w-[11%] cursor-pointer">
                  <img
                    className="w-[1rem] h-[1rem]"
                    src={require("../../assets/mainIcon/search.png")}
                    alt=""
                  />
                </div>
              </div>
              <div
                className="grid h-full overflow-hidden "
                style={{ gridTemplateRows: "1fr 0.1fr" }}
              >
                {/* <div className="flex justify-start items-center h-full text-white text-xs pl-2">
                  친한친구
                </div> */}
                <div className={`h-full overflow-scroll ${styles.hideScroll} `}>
                  {friendList}
                </div>
                <div><span className={`cursor-pointer ${styles.friendName} ${styles.friendRequestName}`} onClick={()=> {
                  // 친구 요청 검색 모달 상태
                  dispatch(changeFriendSearchState(true))
                }}>친구요청</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    
  );
}
export default FriendList;
