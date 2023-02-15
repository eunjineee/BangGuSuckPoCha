import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  inviteMyFriend,
  changeMenuFriendState,
  showPublicModal,
  changeFriendSearchState,
  changeNavAlarmReviewEmojiUserData,
  showRoomUserProfile,
} from "../../store/store";
import styles from "./Common.module.css";
import PublicModal from "./PublicModal";

function InviteFriend({ onClickShowInvite, pochaId }: { onClickShowInvite: Function, pochaId: string }): JSX.Element {
  const username = localStorage.getItem("Username");
  // 메뉴 클릭시
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const [modalData, setModalData] = useState<any>(null);
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  // 친구 검색
  const [searchFriend,setSearchFriend] = useState<any>()
  
  const friendListIcon = useRef<any>(null);

  const [myFriends, setMyFriends] = useState<any>([]);

  // //  메뉴 -> 친구 리스트
  // const menuFriendListApiData: any = useAppSelector((state: any) => {
  //   return state.menuFriendListApiData;
  // });
  // Public 모달 보이기 관련
  const showModal = useAppSelector((state) => {
    return state.PublicModal;
  });
  // 포차 테마 확인
  const enterPochaType = useAppSelector((state) => {
    return state.enterPochaType;
  });

  console.log("친구리스트데이터", myFriends);

  function requestFriendList():any {
    // 요청 이후 친구창 재정렬
    axios({
      method: "get",
      url: `https://i8e201.p.ssafy.io/api/user/friend/${username}`,
      headers: {
        accessToken: `${accessToken}`,
      },
    }).then((r) => {
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
              setMyFriends([...bestFriend,...normalFriend]);
              // dispatch(changeMenuFriendListApiDataState([...bestFriend,...normalFriend]));
            })
          }
        })
      } else {
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
        setMyFriends([...bestFriend,...normalFriend]);
        // dispatch(changeMenuFriendListApiDataState([...bestFriend,...normalFriend]));           
      }


      // // console.log('친구 리스트 조회: ',r.data.data)
      // const friendDataList:any[] = r.data.data
      // const bestFriend:any = []
      // const normalFriend:any = []

      // friendDataList.forEach((data:any)=> {
      //   if (data.best_friend) {
      //     bestFriend.push(data)
      //   } else {
      //     normalFriend.push(data)
      //   }
      // })
      // // console.log('베프: ',bestFriend)
      // // console.log('친구: ',normalFriend)
      // setMyFriends([...bestFriend,...normalFriend]);
      // // dispatch(changeMenuFriendListApiDataState([...bestFriend,...normalFriend]));
    });
  }

  // 유저 조회
  function UserStateSearch(f_username:any) {
    console.log(f_username)
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
              console.log('넣어따', r.data)
              dispatch(changeNavAlarmReviewEmojiUserData(r.data))
              dispatch(showRoomUserProfile())
            })
          } 
        })
      } else {
        console.log('넣어따', r.data)
        dispatch(changeNavAlarmReviewEmojiUserData(r.data))
        dispatch(showRoomUserProfile())
      }
      // console.log('넣어따', r.data)
      // dispatch(changeNavAlarmReviewEmojiUserData(r.data))
      // dispatch(showRoomUserProfile())
    })
  }

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
      }).then((r:any)=> {
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
                setMyFriends(r.data.data)
                setSearchFriend("") 
              })
            }
          })
        } else {
          // console.log('요청한 친구: ',r.data.data)
          setMyFriends(r.data.data)
          setSearchFriend("") 
        }
        // // console.log('요청한 친구: ',r.data.data)
        // setMyFriends(r.data.data)
        // setSearchFriend("") 
      })
    }}

  // 친구 요청
  // const getMyFriends = async () => {
  //   try {
  //     const { data } = await axios({
  //       url: `https://i8e201.p.ssafy.io/api/user/friend/${username}`,
  //     });
  //     setMyFriends(data.data);
  //   } catch (error) {
  //     console.log("초대할 친구목록", error);
  //   }
  // };

  useEffect(() => {
    requestFriendList();
  }, []);


  const logState =
    "https://upload.wikimedia.org/wikipedia/commons/0/0e/Basic_red_dot.png";

  const onClickShowModal = (event : React.MouseEvent<HTMLDivElement>) => {
    const toUsername = event.currentTarget.id;
    const nickname = event.currentTarget.dataset.nickname;
    console.log("상대초대할친구", toUsername);
    console.log("상대초대할친구닉", nickname);
    // const username = event.currentTarget.value;
    onClickShowInvite(toUsername, nickname);
  };

  const friendList = myFriends.map((e: any, idx: any) => {
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
              })
              .then(requestFriendList)
              .catch(()=> {
                toast.error('다시 요청을 시도해주세요')
              })
              .then(requestFriendList)
              
            }
          })
        } else {
          // console.log('베프니? ',checkBestFriend)
          
          if (checkBestFriend) {
            toast.success(`${e.f_nickname} 즐겨찾기에서 제거하였습니다`)
          } else {
            toast.success(`${e.f_nickname} 즐겨찾기에 추가하였습니다`)
          }
          Promise.all([requestFriendList, toast.error('다시 요청을 시도해주세요'), requestFriendList])
          .then(requestFriendList)
          .catch(()=> {
            toast.error('다시 요청을 시도해주세요')
          })
          .then(requestFriendList)
        }
      


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

    return (
      <div
        key={e.f_nickname}
        className=" grid my-2 "
        style={{ gridTemplateColumns: "1fr 3fr 1fr" }}
        // id={e.you_id}
        // data-nickname={e.f_nickname}
        // onClick={onClickShowModal}
      >
        <div className="flex justify-center items-center h-full pl-2">
          <img className="object-fill rounded-full h-[2.6rem] cursor-pointer" src={e.f_profile} alt="" onClick={()=>{
            // console.log(e)
            UserStateSearch(e.f_username)
          }}/>
        </div>
        <div
          id={e.you_id}
          data-nickname={e.f_nickname}
          onClick={(e)=> {
            if (enterPochaType !== 3) {
              onClickShowModal(e)
            }
          }}
          className={`flex justify-start items-center cursor-pointer pl-3 text-base font-semibold h-full ${styles.menuFriendNeon}`}
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
      <div
        ref={friendListIcon}
        className="fixed  w-[17rem] h-[35rem] bottom-0 right-0"
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
                <div className="flex justify-center items-center h-full">
                  <span className={`text-2xl pb-[0.3rem] ${styles.xBtn}`}
                    onClick={() => {
                      dispatch(inviteMyFriend(false));
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
export default InviteFriend;
