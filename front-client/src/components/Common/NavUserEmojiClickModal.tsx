import axios from "axios";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  roomAddFriendModalState,
  showRoomUserProfile,
  changeRoomDeleteFriendModalCheck,
  changeMenuFriendListApiDataState
} from "../../store/store";
import RoomUserFriendDeleteModal from "./RoomUserFriendDeleteModal";
import RoomUserFriendModal from "./RoomUserFriendModal";

const NavUserEmojiClickModal = ({ userData }: { userData: any }) => {
  // console.log('클릭한 유저데이터 닉네임: ',userData.data.profile)
  let dispatch = useAppDispatch();
  const navigate = useNavigate()
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const username = localStorage.getItem('Username')
  let { manner, gender, birth, region, comment } = userData.data;
  console.log('이거는 매너입니다: ', manner);
  
  const { nickname } = userData.data;
  // 백그라운드 div
  const bgDiv = useRef<any>();

  // 유저 중간 정보관련 이미지들
  const userInfoImages = [
    require("../../assets/myPage/temprature.png"),
    require("../../assets/myPage/gender.png"),
    require("../../assets/myPage/age.png"),
    require("../../assets/myPage/place.png"),
  ];
  // 유저 정보관련 칼라값들
  const infoColors = [
    "text-red-500",
    "text-orange-500",
    "text-green-500",
    "text-blue-500",
  ];

  // 친구 유무에 따른 문구 변경 및 기능 변경
  // 친구 목록 검색 후 친구라면 친구 삭제 버튼 만들고
  //  친구가 아니면 친구 추가로 변경
  const [userInfoFootTitle, setUserInfoFootTitle] = useState<any>()
  const [userInfoFootIcons, setUserInfoFootIcons] = useState<any>()

  // 친구 요청에 따른 친구 목록 정렬하기
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
              console.log('친구 리스트 조회: ',r.data.data)
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
              console.log('베프: ',bestFriend)
              console.log('친구: ',normalFriend)
              
              dispatch(changeMenuFriendListApiDataState([...bestFriend,...normalFriend]));
            })
          }
        })
      } else {
        console.log('친구 리스트 조회: ',r.data.data)
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
        console.log('베프: ',bestFriend)
        console.log('친구: ',normalFriend)
        
        dispatch(changeMenuFriendListApiDataState([...bestFriend,...normalFriend]));
      }
    });
  }

  useEffect(()=> {
    axios({
      method: 'get',
      url: `https://i8e201.p.ssafy.io/api/user/friend/${username}/${nickname}`,
      params: {
        f_nickname: nickname,
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
              url: `https://i8e201.p.ssafy.io/api/user/friend/${username}/${nickname}`,
              params: {
                f_nickname: nickname,
                username: username
              },
              headers: {
                accessToken: `${r.data.accessToken}`,
              },
            }).then((r)=> {
              if (r.data.data.length === 0) {
                setUserInfoFootTitle('친구신청') 
                setUserInfoFootIcons(require("../../assets/roomIcon/add-user.png")) 
              } else {
                setUserInfoFootTitle('친구삭제') 
                setUserInfoFootIcons(require("../../assets/roomIcon/remove-user.png"))
              }
            })
            .then(()=> {
              requestFriendList()
            })
          }
        })
      } else {
        if (r.data.data.length === 0) {
          setUserInfoFootTitle('친구신청') 
          setUserInfoFootIcons(require("../../assets/roomIcon/add-user.png")) 
        } else {
          setUserInfoFootTitle('친구삭제') 
          setUserInfoFootIcons(require("../../assets/roomIcon/remove-user.png"))
        }
        setTimeout(() => {
          requestFriendList()
        }, 100);
      }      
    }) 
  })

  // 유저 정보
  const userInfosData = userDataReBuild();

  // 유저 정보 데이터 재가공 함수
  function userDataReBuild() {
    const date: any = new Date();
    //매너온도 가공
    manner = (manner).toFixed(1) + "℃"
    // 성별 데이터 다시 가공
    if (gender === "F") {
      gender = "여자";
    } else if (gender === "M") {
      gender = "남자";
    }
    // 연령 데이터 다시 가공
    const ageGroup = date.getFullYear() - Number(birth.substr(0, 4));
    if (ageGroup < 30) {
      birth = "20대";
    } else {
      birth = "30대";
    }
    // 지역 데이터 가공
    if (region !== "의정부" || region !== "동두천" || region !== "남양주") {
      region = region.substr(0, 2);
    }
    return [manner, gender, birth, region];
  }

  // 프로필 모달 끄는 함수
  function CloseProfileModal(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === bgDiv.current) {
      console.log("프로필꺼짐!");
      dispatch(showRoomUserProfile());
    }
  }

  // 친추 묻는 모달 띄우기
  const clickAddFriend = () => {
    dispatch(roomAddFriendModalState());
  };
  // 친추 삭제 모달 띄우기
  const clickRemoveFriend = () => {
    dispatch(changeRoomDeleteFriendModalCheck());
  };
  

  // 이벤트핸들러들 [친추, 강퇴, 신고]
  function handlers() {
    if (userInfoFootTitle === '친구신청') {
      clickAddFriend()
    } else {
      clickRemoveFriend()
    }
  }

  // 친구추가 확인 모달 상태 체크
  const roomAddFriendModalCheck = useAppSelector((state) => {
    return state.roomAddFriendModalCheck;
  });
  // 친구삭제 확인 모달 상태 체크
  const roomDeleteFriendModalCheck = useAppSelector((state)=> {return state.roomDeleteFriendModalCheck})
  
  

  return (
    <>
      {roomAddFriendModalCheck ? (
        <RoomUserFriendModal userData={userData} />
      ) : null}
      {
        roomDeleteFriendModalCheck ? <RoomUserFriendDeleteModal userData={userData}/> : null
      }
      <div
        ref={bgDiv}
        onMouseDown={CloseProfileModal}
        className={`bg-slate-800 bg-opacity-50 fixed w-full h-full text-white z-10`}
      >
        <div
          className={`min-w-[24rem] bg-black w-[20%] px-10 pt-10 pb-5 rounded-3xl relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        >
          <div className={`w-full h-24 flex justify-center items-center`}>
            <img
              className={`object-fill rounded-full h-[6rem] w-[6rem]`}
              src={userData.data.profile}
              alt=""
            />
          </div>
          <div className={`w-full h-16 text-3xl font-bold`}>
            <div>{nickname}</div>
          </div>
          <div className={`w-full h-10 text-lg`}>
            {comment}
          </div>
          <div className={`flex h-32 my-12 justify-evenly`}>
            {userInfosData.map((info, index) => {
              return (
                <div key={info} className={`w-1/4 h-3/5 flex-col`}>
                  <img
                    className={`block mx-auto h-4/5`}
                    src={userInfoImages[index]}
                    alt={`${info}`}
                  />
                  {/* <div className="text-base">{info}</div> */}
                  <div
                    className={`text-lg my-3 font-bold ${infoColors[index]}`}
                  >
                    {info}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`flex h-20 p-2 justify-evenly border-t rounded-full`}>
            <div  className={`w-1/4 h-full flex-col`}>
              <div
                className={`w-full h-3/4 flex justify-center items-center`}
              >
                <img
                  onClick={handlers}
                  className={`h-3/4 cursor-pointer hover:scale-110`}
                  src={userInfoFootIcons}
                  alt=""
                />
              </div>
              <div className="text-sm">{userInfoFootTitle}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavUserEmojiClickModal;
