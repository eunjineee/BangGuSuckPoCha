import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  changeAlarmState,
  changeMenuFriendListApiDataState,
  changeMenuFriendState,
  changeMenuState,
  changeMyInfo,
} from "../../store/store";
import "./Common.css"

function NavbarMenu(): JSX.Element {
  const navigate = useNavigate();
  let dispatch = useAppDispatch();
  // username (현재는 내꺼)
  const username = localStorage.getItem("Username");
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const menuIcon = useRef<any>(null);
  // 메뉴 클릭 상태
  const checkMenuState: any = useAppSelector((state: any) => {
    return state.menuClickCheck;
  });
  // 알람 클릭 상태
  const alarmClickCheck: any = useAppSelector((state: any) => {
    return state.alarmClickCheck;
  });
  //  메뉴 -> 친구 클릭 상태
  const menuFriendClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendClickCheck;
  });

  // console.log('친구 클릭 해따',menuFriendClickCheck);
  // 메뉴 클릭시 조건 분기
  useEffect(() => {
    if (checkMenuState && alarmClickCheck) {
      dispatch(changeAlarmState());
      menuIcon.current.classList.remove("hidden");
    } else if (checkMenuState) {
      menuIcon.current.classList.remove("hidden");
    } else if (!checkMenuState) {
      menuIcon.current.classList.add("hidden");
    }
  }, [checkMenuState]);

  // 메뉴 -> 친구 클릭시 메뉴 버튼 사라지기
  useEffect(() => {
    if (menuFriendClickCheck) {
      dispatch(changeMenuState());
      menuIcon.current.classList.remove("hidden");
    }
  }, [menuFriendClickCheck]);

  return (
    // 마이페이지
    <div
      ref={menuIcon}
      className={`absolute rounded-full w-48 min-w-[12rem] h-16 min-h-[4rem] hidden`}
      style={{ right: "6.7rem", top: "11.1rem" }}
    >
      <img
        src={require("../../assets/logoIcon/menuBground.png")}
        className="bg-inherit h-full w-full"
        alt=""
      />
      <div
        className="flex justify-center items-center absolute   w-48 h-16"
        style={{ right: "-1%", top: "-9%" }}
      >
        <div
          className="ml-5 cursor-pointer"
          style={{ height: "52%" }}
          onClick={() => {
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
                        accessToken: `${accessToken}`,
                      },
                    }).then((r)=> {
                      // console.log("내정보 : ", r.data.data);
                      dispatch(changeMyInfo(r.data.data));
                      navigate("/newmypage");
                    })
                  }
                })
              } else {
                // console.log("내정보 : ", r.data.data);
                dispatch(changeMyInfo(r.data.data));
                navigate("/newmypage");
              }
            });
          }}
        >
          <img
            src={require("../../assets/logoIcon/mypage.png")}
            alt=""
            className="bg-white bg-cover rounded-full"
            style={{ height: "90%", border: "solid 1px white" }}
          />
          <p className="hoverTextColor text-stone-200 text-xs">My</p>
        </div>
        {/* 친구 */}
        <div
          className="mx-5 cursor-pointer"
          style={{ height: "52%" }}
          onClick={() => {
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
                      
                      dispatch(changeMenuFriendState());
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
                
                dispatch(changeMenuFriendState());
                dispatch(changeMenuFriendListApiDataState([...bestFriend,...normalFriend]));
              }
            });
          }}
        >
          <img
            src={require("../../assets/logoIcon/friend.png")}
            alt=""
            className="bg-white bg-cover rounded-full"
            style={{ height: "90%" }}
          />
          <p className="hoverTextColor text-stone-200 text-xs">friend</p>
        </div>
        <div
          className="mr-5 cursor-pointer"
          style={{ height: "52%" }}
          onClick={() => {
            axios({
              method: "put",
              url: `https://i8e201.p.ssafy.io/api/user/logout/${username}`,
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
                      method: "put",
                      url: `https://i8e201.p.ssafy.io/api/user/logout/${username}`,
                      headers: {
                        accessToken: `${r.data.accessToken}`,
                      },
                    }).then((r)=> {
                      // const result = r.data.message;
                      if ("success") {
                        toast.success("로그아웃되셨습니다");
                        window.localStorage.clear();
                        navigate("/");
                      }
                    })
                  }
                })
              } else {
                // const result = r.data.message;
                if ("success") {
                  toast.success("로그아웃되셨습니다");
                  window.localStorage.clear();
                  navigate("/");
                }
              }
            });
          }}
        >
          <img
            src={require("../../assets/logoIcon/logout.png")}
            alt=""
            className="bg-white bg-cover rounded-full"
            style={{ height: "90%" }}
          />
          <p className="hoverTextColor text-stone-200 text-xs">logout</p>
        </div>
      </div>
    </div>
  );
}
export default NavbarMenu;
