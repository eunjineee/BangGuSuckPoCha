import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  changeCarouselState,
  changeMenuState,
  changeAlarmState,
  changeMainCreateRoomList,
} from "../../store/store";
import FriendChat from "../Common/FriendChat";
import FriendList from "../Common/FriendList";
import Navbar from "../Common/Navbar";
import NavbarAlarm from "../Common/NavbarAlarm";
import NavbarMenu from "../Common/NavbarMenu";
import NavUserEmojiClickModal from "../Common/NavUserEmojiClickModal";
import CardInside from "./CardInside";
import styles from "./Main.module.css";
import MainCreateRoom from "./MainCreateRoom";
import MainCreateRoomCarousel from "./MainCreateRoomCarousel";
import Tag from "./Tag";

function Main(): JSX.Element {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const [myState, setMyState] = useState<any>({
    age: 0,
    region: "전국",
    gender: "",
  });
  const mainCreateRoomList: any = useAppSelector((state) => {
    return state.mainCreateRoomList;
  });

  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  // 메인 페이지 들어올 시 현재 Username에 대한 유저정보 저장
  const userName = localStorage.getItem("Username");
  useEffect(() => {
    
    axios({
      method:'get',
      url:`https://i8e201.p.ssafy.io/api/user/myinfo/${userName}`,
      headers: {
        accessToken: `${accessToken}`,
      },
    })
      .then((r) => {
        if (r.data.status === '401') {
          axios({
            method: 'get',
            url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${userName}`,
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
                method:'get',
                url:`https://i8e201.p.ssafy.io/api/user/myinfo/${userName}`,
                headers: {
                  accessToken: `${r.data.accessToken}`,
                },
              }).then((r)=> {
                localStorage.setItem("userId", r.data.data.userId);
                console.log("나의 데이터", r.data.data);
                const now: any = new Date();
                const myData: any = r.data.data;
                const birth: string[] = myData.birth.split(".");
                let age: number;
                if (Number(birth[1]) > now.getMonth()) {
                  age =
                    Math.floor((now.getFullYear() - Number(birth[0]) - 1) / 10) * 10;
                } else {
                  age = Math.floor((now.getFullYear() - Number(birth[0])) / 10) * 10;
                }
                // console.log('내 나이는?',age)
                localStorage.setItem("age", `${age}`);
                localStorage.setItem("region", `${myData.region}`);
                localStorage.setItem("gender", `${myData.gender}`);
                setMyState((preState: any) => {
                  return {
                    ...preState,
                    age: age,
                    region: myData.region,
                    gender: myData.gender,
                  };
                });
              })
            }
          })
        } else {
          localStorage.setItem("userId", r.data.data.userId);
          console.log("나의 데이터", r.data.data);
          const now: any = new Date();
          const myData: any = r.data.data;
          const birth: string[] = myData.birth.split(".");
          let age: number;
          if (Number(birth[1]) > now.getMonth()) {
            age =
              Math.floor((now.getFullYear() - Number(birth[0]) - 1) / 10) * 10;
          } else {
            age = Math.floor((now.getFullYear() - Number(birth[0])) / 10) * 10;
          }
          // console.log('내 나이는?',age)
          localStorage.setItem("age", `${age}`);
          localStorage.setItem("region", `${myData.region}`);
          localStorage.setItem("gender", `${myData.gender}`);
          setMyState((preState: any) => {
            return {
              ...preState,
              age: age,
              region: myData.region,
              gender: myData.gender,
            };
          });
        }
      });
  }, []);

  // 메인에 들어올 시 현재 생성된 방 리스트 state 갱신
  // useEffect(() => {
  //   axios({
  //     method: "get",
  //     url: "https://i8e201.p.ssafy.io/api/pocha/",
  //   }).then((r) => {
  //     console.log(r.data)
  //     dispatch(changeMainCreateRoomList(r.data.data));

  //   });
  // }, []);

  // 메인 입장시 나오는것과 강퇴당한것 구분
  useEffect(() => {
    if (localStorage.getItem("reloadExit")) {
      toast.success("방에서 나오셨습니다");
      setTimeout(() => {
        localStorage.removeItem("reloadExit");
      }, 500);
    }
    if (localStorage.getItem("reloadBan")) {
      toast.error("방에서 강퇴당하셨습니다");
      setTimeout(() => {
        localStorage.removeItem("reloadBan");
      }, 500);
    }
  }, []);

  // 방 생성 관련
  const createBtn = useRef<any>(null);
  // 메인 페이지 클릭 여부
  const mainRef = useRef<any>(null);
  // 포차 종류 캐러셀
  const mainCreateRoomCarouselCheck: any = useAppSelector(
    (state: any) => state.mainCreateRoomCarouselCheck
  );

  // 선택한 포차 테마 체크
  const createThemeRoomCheck: number = useAppSelector((state) => {
    return state.createThemeRoomCheck;
  });

  const onClickHiddenBtn = () => {
    createBtn.current.classList.toggle("hidden");
  };

  // 메뉴 클릭 상태
  const checkMenuState: any = useAppSelector((state: any) => {
    return state.menuClickCheck;
  });
  // 알람 클릭 상태
  const alarmClickCheck: any = useAppSelector((state: any) => {
    return state.alarmClickCheck;
  });

  //  메뉴 -> 친구 클릭 -> 채팅 상태
  const menuFriendChatClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendChatClickCheck;
  });

  const navAlarmReviewEmojiUserData: any = useAppSelector((state: any) => {
    return state.navAlarmReviewEmojiUserData;
  });
  const RoomUserProfileClickCheck: any = useAppSelector((state: any) => {
    return state.RoomUserProfileClickCheck;
  });

  // 캐러셀 클릭시 알림&메뉴 컴포넌트 조건분기
  if (mainCreateRoomCarouselCheck) {
    if (checkMenuState) {
      dispatch(changeMenuState());
    } else if (alarmClickCheck) {
      dispatch(changeAlarmState());
    }
  }

  return (
    <>
      {/* nav의 메뉴 => friend 클릭 시 친구 목록 보이기 */}
      <FriendList />

      {menuFriendChatClickCheck ? <FriendChat /> : null}

      {/* 포차+ 클릭에 따른 테마선택 캐러셀 보이기 */}
      {mainCreateRoomCarouselCheck ? <MainCreateRoomCarousel /> : null}

      {/* 선택한 테마에 따른 방만들기 셋팅 */}
      {createThemeRoomCheck !== 0 ? (
        <MainCreateRoom
          onClickHiddenBtn={onClickHiddenBtn}
          roomTheme={createThemeRoomCheck}
        />
      ) : null}

      {RoomUserProfileClickCheck ? (
        <NavUserEmojiClickModal userData={navAlarmReviewEmojiUserData} />
      ) : null}

      <div
        className={`grid w-screen min-w-[75rem] h-screen ${styles.hideScroll}`}
        style={{
          backgroundColor: "rgb(25, 25, 25)",
          gridTemplateRows: "11rem 1fr",
          overflow: "auto",
        }}
      >
        <Navbar />

        <div
          className="grid"
          style={{ gridTemplateColumns: "12rem 1fr 12rem" }}
        >
          <div></div>
          <div
            className="grid mx-auto min-w-f"
            style={{
              gridTemplateRows: "25rem 1fr 3rem",
              backgroundColor: "rgb(25, 25, 25)",
            }}
          >
            {/* 태그 */}
            <div className="grid" style={{ gridTemplateRows: "12rem 1fr" }}>
              <div></div>
              <Tag />
            </div>
            {/* 방 보이기 */}
            <div
              className={`${styles.binggrae} grid grid-cols-1 w-full min-w-[75rem]`}
              style={{ backgroundColor: "rgb(25, 25, 25)" }}
            >
              <Room mainCreateRoomList={mainCreateRoomList} myState={myState} />
            </div>
          </div>
          <div></div>
        </div>

        {/* 방 생성 버튼 */}
        {/* Tag 컴포넌트로 이동 */}
        {/* <div
          ref={createBtn}
          onClick={() => {
            dispatch(changeCarouselState());
            onClickHiddenBtn();
          }}
          className={`w-[6rem] min-w-[6rem] h-[3.5rem] min-h-[3.5rem] rounded-full flex justify-center items-center  fixed bottom-5 right-20 cursor-pointer z-50 bg-black ${styles.cancelBtn}`}
        >
          <span className="mr-1 text-[1.3rem] font-bold text-white">포차</span>
          <img
            src={require("../../assets/roomIcon/plus.png")}
            alt=""
            className="w-1/6 min-w-1/6"
          />
        </div> */}

        {/* 메뉴 클릭시 보이기 */}
        <NavbarMenu />
        {/* 알림 클릭시 보이기 */}
        <NavbarAlarm />
      </div>
    </>
  );
}
export default Main;

function Room({ mainCreateRoomList, myState }: any): JSX.Element {
  console.log("생성된 방 리스트: ", mainCreateRoomList);
  const navigate = useNavigate();
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  // 내 아이디
  const username = localStorage.getItem("Username");
  // ssulTitle가 null일 경우 랜덤하게 넣어줄 문구
  const randomTitleList = [
    "즐겁게 웃으며 한잔😛",
    "이거 마시면 나랑 사귀는거다?😏",
    "오늘 여기 오길 참 잘 해따💕",
    "술이 달아서 네 생각이 나👭",
    "흥청망청 취해보자👾",
    "흥해도 청춘 망해도 청춘🥂",
    "넌 예쁘니까 예쁜 것만 먹어라🍷",
    "저녁은 춥고 술은 달아서🍹",
    "오늘따라 밤이 더 아름답다🌙",
    "잘했고,잘하고있고,잘할거야💪",
  ];
  // 방에 입장하는 함수
  const enterRoom = async (event: React.MouseEvent<HTMLDivElement>, e: any) => {
    const pochaId = event.currentTarget.id;
    // console.log('클릭한 포차 데이터: ', e);

    // console.log('포차 아이디',pochaId)
    // console.log('나의 데이터: ',myState)
    const themeId = e.themeId.slice(0, 2);
    const age = e.age;
    const region = e.region;
    const isPrivate = e.isPrivate;
    const limitUser = e.limitUser;
    const totalCount = e.totalCount;
    const maleCount = e.maleCount;
    const femaleCount = e.femaleCount;
    const isWaiting = e.isWaiting;
    console.log(
      isPrivate,
      limitUser,
      totalCount,
      maleCount,
      femaleCount,
      isWaiting
    );
    // { age: 0, region:'전국', gender: '',}
    // 헌팅방 입장
    if (themeId === "T2") {
      console.log(themeId);
      // 나이,지역,잠금,총인원수,성비 체크
      // 미팅방 입장 유저가 남자일 경우
      if (
        myState.gender === "M" &&
        (age === 0 || age === myState.age) &&
        (region === "전국" || region === myState.region) &&
        limitUser > totalCount &&
        limitUser / 2 > maleCount &&
        isWaiting
      ) {
        axios({
          method: "post",
          url: "https://i8e201.p.ssafy.io/api/pocha/enter",
          data: {
            isHost: false,
            pochaId: pochaId,
            username: username,
          },
          headers: {
            accessToken: `${accessToken}`,
          }
        }).then((r) => {
          // 실패시
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
                    method: "post",
                    url: "https://i8e201.p.ssafy.io/api/pocha/enter",
                    data: {
                      isHost: false,
                      pochaId: pochaId,
                      username: username,
                    },
                    headers: {
                      accessToken: `${r.data.accessToken}`,
                    }
                  }).then(()=> {
                    navigate(`/meetingroom/${pochaId}`);
                  })
                }
            })
          } else {
            // 토큰이 있다면
            navigate(`/meetingroom/${pochaId}`);
          }
        })
        // 미팅 포차 클릭한 사람이 여자일 경우
      } else if (
        myState.gender === "F" &&
        (age === 0 || age === myState.age) &&
        (region === "전국" || region === myState.region) &&
        limitUser > totalCount &&
        limitUser / 2 > femaleCount &&
        isWaiting
      ) {
        axios({
          method: "post",
          url: "https://i8e201.p.ssafy.io/api/pocha/enter",
          data: {
            isHost: false,
            pochaId: pochaId,
            username: username,
          },
          headers: {
            accessToken: `${accessToken}`,
          }
        }).then((r) => {
            console.log(r.data)
            // 실패시
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
                    method: "post",
                    url: "https://i8e201.p.ssafy.io/api/pocha/enter",
                    data: {
                      isHost: false,
                      pochaId: pochaId,
                      username: username,
                    },
                    headers: {
                      accessToken: `${r.data.accessToken}`,
                    }
                  }).then(()=> {
                    navigate(`/meetingroom/${pochaId}`);
                  })
                }
              })
            } else {
              // 토큰이 있다면
              navigate(`/meetingroom/${pochaId}`);
            }
          })
      } else {
        // 그 외의 방
        toast.error("입장할 수 없는 방입니다");
      }
    } else {
      // 소통&게임방
      // 나이,지역,잠금,총인원수 체크
      if (
        (age === 0 || age === myState.age) &&
        (region === "전국" || region === myState.region) &&
        isPrivate === false &&
        limitUser > totalCount
      ) {
        axios({
          method: "post",
          url: "https://i8e201.p.ssafy.io/api/pocha/enter",
          data: {
            isHost: false,
            pochaId: pochaId,
            username: username,
          },
          headers: {
            accessToken: `${accessToken}`,
          }
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
                  method: "post",
                  url: "https://i8e201.p.ssafy.io/api/pocha/enter",
                  data: {
                    isHost: false,
                    pochaId: pochaId,
                    username: username,
                  },
                  headers: {
                    accessToken: `${r.data.accessToken}`,
                  }
                }).then(()=> {
                  if (themeId === "T0") {
                    navigate(`/storyroom/${pochaId}`);
                  } else if (themeId === "T1") {
                    navigate(`/gameroom/${pochaId}`);
                  }
                })
              }
            })
          } else {
            if (themeId === "T0") {
              navigate(`/storyroom/${pochaId}`);
            } else if (themeId === "T1") {
              navigate(`/gameroom/${pochaId}`);
            }
          }
        });
      } else {
        toast.error("입장할 수 없는 방입니다");
      }
    }
  };

  let cards: JSX.Element[] = mainCreateRoomList.map((e: any, idx: any) => {
    // console.log(e)
    // 포차 종류
    let themeType;
    if (e.themeId.substr(0, 2) === "T0") {
      themeType = "Talk";
    } else if (e.themeId.substr(0, 2) === "T1") {
      themeType = "Game";
    } else {
      themeType = "Meeting";
    }

    // 태그 정렬하기
    const TagList = e.tagList.map((tag: any) => {
      return `#${tag} `;
    });

    // 썰 타이틀 없을 시 랜덤 타이틀
    let SSulTitle = randomTitleList[e.pochaId % 10];
    let IsRealSsul = false;
    if (typeof e.ssulTitle !== "object") {
      IsRealSsul = true;
      SSulTitle = e.ssulTitle;
    }

    return (
      <div className="w-full h-[30rem] min-h-[30rem] min-w-[100%] max-w-[100%] my-8">
        <div
          className="grid grid-cols-2 h-full rounded-2xl w-full min-w-[100%]"
          style={{ gridTemplateColumns: "2.5rem 1fr 2.5rem" }}
        >
          <div></div>

          {/* 카드 내부 */}
          <div
            onClick={(event) => {
              enterRoom(event, e);
            }}
            key={e.pochaId}
            id={e.pochaId}
          >
            <CardInside
              TagList={TagList}
              themeType={themeType}
              themeId={e.themeId}
              femaleCount={e.femaleCount}
              maleCount={e.maleCount}
              ssulTitle={SSulTitle}
              isPrivate={e.isPrivate}
              alcohol={e.alcohol}
              totalCount={e.totalCount}
              limitUser={e.limitUser}
              IsRealSsul={IsRealSsul}
            />
          </div>
          <div></div>
        </div>
      </div>
    );
  });
  return (
    <div className="grid w-full min-w-[96rem] grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 ">
      {cards}
    </div>
  );
}
