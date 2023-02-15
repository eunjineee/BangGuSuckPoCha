import {
  changeAlarmApiDataState,
  changeAlarmClickState,
  changeAlarmState,
  changeMenuFriendChatState,
  changeMenuFriendState,
  changeMenuState,
} from "../../store/store";
import styles from "../Main/Main.module.css";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Common.css"

function Navbar(): JSX.Element {
  const navigate = useNavigate();
  const [myData, setMyData] = useState({ profile: null, nickname: null });
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  useEffect(() => {
    
    const username = localStorage.getItem("Username");
    axios({
      method: "get",
      url: `https://i8e201.p.ssafy.io/api/user/myinfo/${username}`,
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
          console.log('Tag의 57번줄: ', r.data.status);
            
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
              url: `https://i8e201.p.ssafy.io/api/user/myinfo/${username}`,
              headers: {
                accessToken: `${r.data.accessToken}`,
              },
            }).then((r)=> {
              // 새롭게 받은 토큰 저장 후  값 저장
              setMyData({
                profile: r.data.data.profile,
                nickname: r.data.data.nickname,
              });
            })
          }
        })
      } else {
        // 토큰이 유지 될 때
        setMyData({
          profile: r.data.data.profile,
          nickname: r.data.data.nickname,
        });
      }      
    });
  }, []);




  return (
    // <div className="h-[11rem] min-w-[75rem] sticky top-0 w-full" >
    <div className="h-[11rem] min-w-[75rem] fixed w-full">
      <div className="flex justify-center bg-black h-full">
        <div style={{ width: "34%" }}></div>
        <img
          src={require("src/assets/logo/Logo.png")}
          alt="logo"
          className={`object-contain w-[24%] cursor-pointer`}
          onClick={() => {
            navigate("/main");
          }}
        />
        <img className="h-16 my-16" src={require("src/assets/logo/soju.gif")}
          alt="logo"/>
        <div className="" style={{ width: "16%" }}></div>
        <div className="grid grid-cols-1 " style={{ width: "18%" }}>
          <div></div>
          <div></div>
          <MenuOption
            myData={myData}
            profile={myData.profile}
            nickname={myData.nickname}
            accessToken={accessToken}
            refreshToken={refreshToken}
          />
        </div>
      </div>
    </div>
  );
}

// menu component
function MenuOption({ profile, nickname, myData,  refreshToken }: any): JSX.Element {
  const accessToken = localStorage.getItem("accessToken")
  // 일단 알람이 없다는 형식으로 체크
  const [checkAlarm,setCheckAlarm] = useState<boolean>(false)
  const navigate = useNavigate();
  let dispatch = useAppDispatch();
  console.log("마이데이터: ", myData);
  const username = localStorage.getItem("Username");
  const menuFriendClickCheck = useAppSelector((state) => {
    return state.menuFriendClickCheck;
  });
  const menuFriendChatClickCheck = useAppSelector((state) => {
    return state.menuFriendChatClickCheck;
  });

  // 알림 유무 체크
  // 친구 요청, 방 초대 요청 -> 완료하지 않은 리뷰 순으로 데이터가 있을 경우 중간에 멈추기
  useEffect(()=> {
    axios({
      method:'get',
      url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`,
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
              method:'get',
              url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`,
              headers: {
                accessToken: `${r.data.accessToken}`,
              },
            }).then((r)=> {
              // 친구 요청이 있다면 checkAlarm를 true로 변경
              if (r.data.length) {
                setCheckAlarm(true)
              } else {
                // 없다면 방 초대 요청 조회
                axios({
                  method:'get',
                  url: `https://i8e201.p.ssafy.io/api/pocha/invite/${username}`,
                  headers: {
                    accessToken: `${accessToken}`,
                  },
                }).then((r)=> {
                  // 친구 요청이 있다면 변경
                  if (r.data.length) {
                    setCheckAlarm(true)
                  } else {
                    // 없다면 리뷰 안한게 있다면 변경
                    axios({
                      method: 'get',
                      url: `https://i8e201.p.ssafy.io/api/user/review/${username}`,
                      headers: {
                        accessToken: `${r.data.accessToken}`,
                      },
                    }).then((r)=> {
                      const datas:any[] = r.data.data
                      // 현재 날짜 지정
                      const now = new Date()
                      // 현재 연도
                      let now_year = now.getFullYear()
                      // 현재 월
                      let now_month = ('0' + (now.getMonth() +  1 )).slice(-2);
                      // 현재 일
                      let now_day= ('0'+(now.getDate())).slice(-2)
                      let two_day_ago= ('0'+(now.getDate()-2)).slice(-2)
                      // 현재 연도-월-일
                      const nowYMD:any = new Date(now_year+"-"+now_month+"-"+now_day)
                      const threeBeforeYMD:any = new Date(now_year+"-"+now_month+"-"+two_day_ago)
                      
                      // 3일 
                      // 리뷰 이전
                      const Beforedata:any = datas.filter((data)=> {  
                        const review_create_at = new Date(((data.create_at).split('T'))[0])
                        return ((data.review_at === null)&&(review_create_at<=nowYMD)&&(threeBeforeYMD<=review_create_at))
                      })
                      if (Beforedata.length) {
                        // 리뷰를 안했고 3일이 지나지 않은 리뷰가 있다면
                        setCheckAlarm(true)
                      }
                    })
                  }
                })
              }
            })
          }
        })
      } else {
        // 갱신이 필요 없을 경우
        axios({
          method:'get',
          url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`,
          headers: {
            accessToken: `${accessToken}`,
          },
        }).then((r)=> {
          console.log('190번줄 : ',r)
          console.log('190번줄 : ',r.data.data)
          console.log('190번줄 : ',r.data.data.length)
          // 친구 요청 목록이 있다면 checkAlarm를 true로 변경
          if (r.data.data.length) {
            console.log('195번으로 왔다');
            
            setCheckAlarm(true)
          } else {
            // 없다면 방 초대 요청 조회
            axios({
              method:'get',
              url: `https://i8e201.p.ssafy.io/api/pocha/invite/${username}`,
              headers: {
                accessToken: `${accessToken}`,
              },
            }).then((r)=> {
              console.log('203번줄 : ',r)
              console.log('203번줄 : ',r.data.data)
              console.log('203번줄 : ',r.data.data.length)
              // 친구 요청이 있다면 변경
              if (r.data.data.length) {
                setCheckAlarm(true)
              } else {
                // 없다면 리뷰 안한게 있는지 조사
                axios({
                  method: 'get',
                  url: `https://i8e201.p.ssafy.io/api/user/review/${username}`,
                  headers: {
                    accessToken: `${accessToken}`,
                  },
                }).then((r)=> {
                  const datas:any[] = r.data.data
                  // 현재 날짜 지정
                  const now = new Date()
                  // 현재 연도
                  let now_year = now.getFullYear()
                  // 현재 월
                  let now_month = ('0' + (now.getMonth() +  1 )).slice(-2);
                  // 현재 일
                  let now_day= ('0'+(now.getDate())).slice(-2)
                  let two_day_ago= ('0'+(now.getDate()-2)).slice(-2)
                  // 현재 연도-월-일
                  const nowYMD:any = new Date(now_year+"-"+now_month+"-"+now_day)
                  const threeBeforeYMD:any = new Date(now_year+"-"+now_month+"-"+two_day_ago)
                  
                  // 3일 
                  // 리뷰 이전
                  const Beforedata:any = datas.filter((data)=> {  
                    const review_create_at = new Date(((data.create_at).split('T'))[0])
                    return ((data.review_at === null)&&(review_create_at<=nowYMD)&&(threeBeforeYMD<=review_create_at))
                  })
                  if (Beforedata.length) {
                    // 리뷰를 안했고 3일이 지나지 않은 리뷰가 있다면
                    setCheckAlarm(true)
                  }
                })
              }
            })
          }
        })
      }
    })
  },[])


  return (
    <div className="flex w-full">
      <div style={{ width: "20%" }}></div>
      <div className="flex justify-evenly" style={{ width: "70%" }}>
        <div className="flex justify-center items-end mb-2">
          <div className="cursor-pointer ">
            <div className="flex justify-center items-center ">
              {/* 이모지 */}
              <img
                className={`object-fill ${styles.myemoji} rounded-full`}
                style={{ width: "1.8rem", height: "1.8rem" }}
                src={profile}
                alt="my"
                onClick={() => {
                  navigate("/newmypage");
                }}
              />
            </div>
            <p
              className={`hoverTextColor text-white  sm:text-xs md:text-xm lg:text-sm flex justify-center items-center  ${styles.NanumGothic}`}
            >
              {nickname}
            </p>
          </div>
        </div>
        {/* 알림 */}
        <div className="flex justify-center items-end mb-2">
          <div
            className="cursor-pointer"
            onClick={() => {
              axios({
                method: "get",
                url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`,
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
                    console.log('Tag의 57번줄: ', r.data.status);
                    
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
                        url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`,
                        headers: {
                          accessToken: `${r.data.accessToken}`,
                        },
                      }).then((r)=> {
                        const checkFrom_id: number[] = [];
                        const setData: (number | string)[] = [];
                        const data: (number | string)[] = r.data.data;
                        data.forEach((e: any) => {
                          if (checkFrom_id.includes(e.from_id) !== true) {
                            checkFrom_id.push(e.from_id);
                            setData.push(e);
                          }
                        });
                        dispatch(changeAlarmState());
                        dispatch(changeAlarmClickState(0));
                        dispatch(changeAlarmApiDataState(setData));
                        if (menuFriendClickCheck) {
                          dispatch(changeMenuFriendState());
                        }
                        if (menuFriendChatClickCheck) {
                          dispatch(changeMenuFriendChatState(false));
                        }
                      })
                    }
                  })
                } else {
                  const checkFrom_id: number[] = [];
                  const setData: (number | string)[] = [];
                  const data: (number | string)[] = r.data.data;
                  data.forEach((e: any) => {
                    if (checkFrom_id.includes(e.from_id) !== true) {
                      checkFrom_id.push(e.from_id);
                      setData.push(e);
                    }
                  });
                  dispatch(changeAlarmState());
                  dispatch(changeAlarmClickState(0));
                  dispatch(changeAlarmApiDataState(setData));
                  if (menuFriendClickCheck) {
                    dispatch(changeMenuFriendState());
                  }
                  if (menuFriendChatClickCheck) {
                    dispatch(changeMenuFriendChatState(false));
                  }
                }
              });
            }}
          >
            {/* 알람 여부에 따른 변경 */}
            {
              checkAlarm? (
                <>
                  <img
                    className={`object-contain ${styles.twinkleAlarm}`}
                    style={{ width: "1.5rem", height: "1.5rem" }}
                    src={require("../../assets/logoIcon/alarmTrue.png")}
                    alt="alarm"
                  />
                  <p
                    className={`hoverTextColor text-white mt-1 sm:text-xs md:text-xm lg:text-sm text-xs  ${styles.NanumGothic}`}
                  >
                    알림
                  </p>
                </>
              ): (
                <>
                  <img
                    className={`object-contain`}
                    style={{ width: "1.5rem", height: "1.5rem" }}
                    src={require("../../assets/logoIcon/alarmFalse.png")}
                    alt="alarm"
                  />
                  <p
                    className={`hoverTextColor text-white mt-1 sm:text-xs md:text-xm lg:text-sm text-xs ${styles.NanumGothic}`}
                  >
                    알림
                  </p>
                </>
              )
            }
          

          </div>
        </div>
        {/* 메뉴 */}
        <div className="flex justify-center items-end mb-2 ">
          <div
            className="cursor-pointer"
            onClick={() => {
              if (menuFriendClickCheck) {
                dispatch(changeMenuFriendState());
              }
              if (menuFriendChatClickCheck) {
                dispatch(changeMenuFriendChatState(false));
              }
              dispatch(changeMenuState());
            }}
          >
            <img
              className="object-contain"
              style={{ width: "1.5rem", height: "1.5rem" }}
              src={require("../../assets/logoIcon/menu.png")}
              alt="menu"
            />
            <p
              className={`hoverTextColor text-white mt-1 sm:text-xs md:text-xm lg:text-sm text-xs ${styles.NanumGothic}`}
            >
              메뉴
            </p>
          </div>
        </div>
      </div>
      <div style={{ width: "20%" }}></div>
    </div>
  );
}

export default Navbar;
