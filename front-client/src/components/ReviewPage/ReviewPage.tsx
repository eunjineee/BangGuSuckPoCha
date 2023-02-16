import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  changeAlarmApiDataState,
  changeAlarmState,
  changeMenuState,
  changeNavAlarmReviewEmojiUserData,
  showRoomUserProfile,
} from "src/store/store";
import FriendChat from "../Common/FriendChat";
import FriendList from "../Common/FriendList";
import FriendSearch from "../Common/FriendSearch";
import Navbar from "../Common/Navbar";
import NavbarAlarm from "../Common/NavbarAlarm";
import NavbarMenu from "../Common/NavbarMenu";
import NavUserEmojiClickModal from "../Common/NavUserEmojiClickModal";
import styles from "../Main/Main.module.css";
import "./ReviewPage.css";

function ReviewPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const username = localStorage.getItem("Username");
  const [reviewAfter, setReviewAfter] = useState([]);
  const [reviewBefore, setReviewBefore] = useState([]);
  const navAlarmReviewEmojiUserData: any = useAppSelector((state: any) => {
    return state.navAlarmReviewEmojiUserData;
  });
  const RoomUserProfileClickCheck: any = useAppSelector((state: any) => {
    return state.RoomUserProfileClickCheck;
  });
  //  메뉴 -> 친구 클릭 -> 채팅 상태
  const menuFriendChatClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendChatClickCheck;
  });
  // 메뉴 클릭 상태
  const checkMenuState: any = useAppSelector((state: any) => {
    return state.menuClickCheck;
  });
  // 알람 클릭 상태
  const alarmClickCheck: any = useAppSelector((state: any) => {
    return state.alarmClickCheck;
  });

  // 친구 요청 검색 모달
  const friendSearchState = useAppSelector((state) => {
    return state.friendSearchState;
  });

  useEffect(() => {
    exitMethod();
    return () => exitMethod();
  }, []);

  function exitMethod() {
    if (checkMenuState === true) {
      dispatch(changeMenuState());
    } else if (alarmClickCheck === true) {
      dispatch(changeAlarmState());
    }
  }

  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken");
    axios({
      method: "get",
      url: `https://i8e201.p.ssafy.io/api/user/review/${username}`,
      headers: {
        accessToken: `${accessToken}`,
      },
    }).then((r) => {
      //토큰이상해
      if ("401" === r.data.status) {
        //토큰 재요청
        console.log("토큰 이상함");
        const refreshToken = localStorage.getItem("refreshToken");
        const Username = localStorage.getItem("Username");
        axios({
          method: "get",
          url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
          headers: {
            refreshToken: refreshToken,
          },
        }).then((r) => {
          //재발급 실패
          if ("401" === r.data.status) {
            localStorage.clear();
            toast.error("인증되지 않은 유저입니다");
            navigate("/");
          }
          //재발급 성공
          else {
            console.log("재발급 성공", r.data.accessToken);
            localStorage.setItem("accessToken", r.data.accessToken);
            accessToken = r.data.accessToken;
            //원래 axios 실행
            axios({
              method: "get",
              url: `https://i8e201.p.ssafy.io/api/user/review/${username}`,
              headers: {
                accessToken: `${accessToken}`,
              },
            }).then((r) => {
              const datas: any[] = r.data.data;
              // 현재 날짜 지정
              const now = new Date();
              // 현재 연도
              let now_year = now.getFullYear();
              // 현재 월
              let now_month = ("0" + (now.getMonth() + 1)).slice(-2);
              // 현재 일
              let now_day = ("0" + now.getDate()).slice(-2);
              let two_day_ago = ("0" + (now.getDate() - 2)).slice(-2);
              // 현재 연도-월-일
              const nowYMD: any = new Date(
                now_year + "-" + now_month + "-" + now_day
              );
              const threeBeforeYMD: any = new Date(
                now_year + "-" + now_month + "-" + two_day_ago
              );

              // 3일
              // 리뷰 이전
              const Beforedata: any = datas.filter((data) => {
                const review_create_at = new Date(data.create_at.split("T")[0]);
                return (
                  data.review_at === null &&
                  review_create_at <= nowYMD &&
                  threeBeforeYMD <= review_create_at
                );
              });
              const currentBeforedata = Beforedata.reverse();
              setReviewBefore(currentBeforedata);
              // 리뷰 이후
              const Afterdata: any = datas.filter((data) => {
                return data.review_at !== null;
              });
              const currentAfterReview = Afterdata.reverse();
              setReviewAfter(currentAfterReview);
            });
          }
        });
      }
      //토큰 정상이야
      else {
        //실행 결과값 그대로 실행
        const datas: any[] = r.data.data;
        // 현재 날짜 지정
        const now = new Date();
        // 현재 연도
        let now_year = now.getFullYear();
        // 현재 월
        let now_month = ("0" + (now.getMonth() + 1)).slice(-2);
        // 현재 일
        let now_day = ("0" + now.getDate()).slice(-2);
        let two_day_ago = ("0" + (now.getDate() - 2)).slice(-2);
        // 현재 연도-월-일
        const nowYMD: any = new Date(
          now_year + "-" + now_month + "-" + now_day
        );
        const threeBeforeYMD: any = new Date(
          now_year + "-" + now_month + "-" + two_day_ago
        );

        // 3일
        // 리뷰 이전
        const Beforedata: any = datas.filter((data) => {
          const review_create_at = new Date(data.create_at.split("T")[0]);
          return (
            data.review_at === null &&
            review_create_at <= nowYMD &&
            threeBeforeYMD <= review_create_at
          );
        });
        const currentBeforedata = Beforedata.reverse();
        setReviewBefore(currentBeforedata);
        // 리뷰 이후
        const Afterdata: any = datas.filter((data) => {
          return data.review_at !== null;
        });
        const currentAfterReview = Afterdata.reverse();
        setReviewAfter(currentAfterReview);
      }
    });
  }, []);

  return (
    <>
      <FriendList />
      {alarmClickCheck ? <NavbarAlarm /> : null}
      {checkMenuState ? <NavbarMenu /> : null}

      {menuFriendChatClickCheck ? <FriendChat /> : null}
      {RoomUserProfileClickCheck ? (
        <NavUserEmojiClickModal userData={navAlarmReviewEmojiUserData} />
      ) : null}

      <div
        className={`grid w-screen h-screen min-w-[75rem] ${styles.hideScroll}`}
        style={{
          backgroundColor: "rgb(25, 25, 25)",
          gridTemplateRows: "11rem 1fr",
          overflow: "scroll",
        }}
      >
        <div className="grid h-full" style={{ gridTemplateRows: "12rem 1fr" }}>
          <div></div>
          <Navbar />
        </div>
        <ReviewComponent
          reviewAfter={reviewAfter}
          setReviewAfter={setReviewAfter}
          reviewBefore={reviewBefore}
          setReviewBefore={setReviewBefore}
        />
      </div>
    </>
  );
}
export default ReviewPage;

function ReviewComponent({
  reviewAfter,
  setReviewAfter,
  reviewBefore,
  setReviewBefore,
}: any): JSX.Element {
  const navigate = useNavigate();
  let showBefore: any;
  let showAfter: any;
  const before = useRef<any>();
  const after = useRef<any>();
  const [clickReviewState, setClickReviewState] = useState(false);
  // console.log('리뷰 안한거: ',reviewBefore)
  // console.log('리뷰 한거: ',reviewAfter)
  // 리뷰안한게 있다면

  useEffect(() => {
    if (clickReviewState) {
      before.current.classList.add("reviewdefault");
      before.current.classList.remove("reviewClick");
      after.current.classList.remove("reviewdefault");
      after.current.classList.add("reviewClick");
    } else {
      before.current.classList.add("reviewClick");
      before.current.classList.remove("reviewdefault");
      after.current.classList.remove("reviewClick");
      after.current.classList.add("reviewdefault");
    }
  }, [clickReviewState]);

  if (reviewBefore.length !== 0) {
    showBefore = reviewBefore?.map((e: any) => {
      return (
        <StartReviewComponent
          clickReviewState={clickReviewState}
          userData={e}
          setReviewBefore={setReviewBefore}
        />
      );
    });
  }

  if (reviewAfter.length !== 0) {
    showAfter = reviewAfter?.map((e: any) => {
      return (
        <StartReviewComponent
          clickReviewState={clickReviewState}
          userData={e}
          setReviewAfter={setReviewAfter}
        />
      );
    });
  }
  // 기본 데이터는 리뷰 목록(false), 리뷰 완료(true)

  return (
    <div
      className="h-full grid "
      style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
    >
      {/* 빈칸 */}
      <div></div>
      {/* 했는지 안했는지에 대한 체크 */}
      <div
        className="grid text-white pb-4 "
        style={{ gridTemplateRows: "0.3fr 0.3fr 3fr" }}
      >
        <div className="mt-4">
          <div
            className="flex justify-start"
            style={{ fontSize: "xx-large", fontWeight: "bold" }}
          >
            리뷰
          </div>
          <div className="flex justify-start my-1">
            즐거운 시간 보내셨나요?
          </div>
          <div className="flex justify-start">
            3일 내 리뷰를 등록해주세요!
          </div>
        </div>
        <div className="flex justify-center items-center mt-6">
          <div
            className="h-full w-[25rem] text-xl cursor-pointer"
            id="reviewlist"
          >
            <span
              ref={before}
              className="flex justify-center items-end h-full nickNameNeon pb-[0.5rem] reviewClick "
              onClick={() => {
                setClickReviewState(false);
              }}
            >
              리뷰 목록
            </span>
          </div>
          <div
            className="h-full w-[25rem] text-xl cursor-pointer"
            id="reviewdone"
          >
            <span
              ref={after}
              className="flex justify-center items-end h-full nickNameNeon pb-[0.5rem] reviewdefault "
              onClick={() => {
                setClickReviewState(true);
              }}
            >
              리뷰 완료
            </span>
          </div>
        </div>
        {/* 리뷰 목록 */}
        <div className="flex flex-col w-full max-h-[25.5rem] overflow-scroll hideScroll   py-3">
          {clickReviewState === false ? (
            showBefore === 0 ? (
              <div className="flex justify-center items-center">
                리뷰 요청이 아직 없어요🍻
              </div>
            ) : (
              showBefore
            )
          ) : showAfter === 1 ? (
            <div className="flex justify-center items-center">
              리뷰 요청이 아직 없어요🍻
            </div>
          ) : (
            showAfter
          )}
        </div>
        <div></div>
      </div>
      {/* 빈칸 */}
      <div></div>
    </div>
  );
}

// 리뷰 평가
function StartReviewComponent({
  userData,
  clickReviewState,
  setReviewBefore,
  setReviewAfter,
}: any): JSX.Element {
  const {
    create_at,
    review_at,
    reviewId,
    review_score,
    to_comment,
    to_nickname,
    to_profile,
    to_username,
  } = userData;
  // console.log('127번임', userData)
  const navigate = useNavigate();
  let createReviewat = "0000-00-00";
  let finishReviewat = "0000-00-00";
  if (clickReviewState) {
    createReviewat = create_at.slice(0, 10);
    finishReviewat = review_at.slice(0, 10);
  } else {
    createReviewat = create_at.slice(0, 10);
  }

  const dispatch = useAppDispatch();  
  const [starState, setStarState] = useState();
  const username = localStorage.getItem("Username");
  const [rating, setRating] = useState(null) as any;
  return (
    <div
      className="grid w-full min-h-[7rem] mb-1"
      style={{ gridTemplateRows: "0.6fr 2fr " }}
    >
      <div className="h-full"></div>
      {clickReviewState === false ? (
        <div
          style={{
            gridTemplateRows: "2.1fr 0.8fr 0.8fr",
            background: "#FFFF",
            borderRadius: "1rem",
            height: "5rem",
          }}
        >
          {/* 이모지, 닉네임, 별점 */}
          <div className="flex h-full justify-center center items-center">
            <div
              className="grid w-[80%] h-full"
              style={{ gridTemplateColumns: "1fr 2.7fr 2fr 0.6fr" }}
            >
              <div
                className="flex justify-center items-center mr-0"
                onClick={() => {
                  // 클릭한 유저 정보 가져와서 담아주기
                  let accessToken = localStorage.getItem("accessToken");
                  axios({
                    method: "get",
                    url: `https://i8e201.p.ssafy.io/api/user/info/${to_username}`,
                    headers: {
                      accessToken: `${accessToken}`,
                    },
                  }).then((r) => {
                    //토큰이상해
                    if ("401" === r.data.status) {
                      //토큰 재요청
                      console.log("토큰 이상함");
                      const refreshToken = localStorage.getItem("refreshToken");
                      const Username = localStorage.getItem("Username");
                      axios({
                        method: "get",
                        url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
                        headers: {
                          refreshToken: refreshToken,
                        },
                      }).then((r) => {
                        //재발급 실패
                        if ("401" === r.data.status) {
                          localStorage.clear();
                          toast.error("인증되지 않은 유저입니다");
                          navigate("/");
                        }
                        //재발급 성공
                        else {
                          console.log("재발급 성공", r.data.accessToken);
                          localStorage.setItem(
                            "accessToken",
                            r.data.accessToken
                          );
                          accessToken = r.data.accessToken;
                          //원래 axios 실행
                          axios({
                            method: "get",
                            url: `https://i8e201.p.ssafy.io/api/user/info/${to_username}`,
                            headers: {
                              accessToken: `${accessToken}`,
                            },
                          }).then((r) => {
                            dispatch(changeNavAlarmReviewEmojiUserData(r.data));
                            dispatch(showRoomUserProfile());
                          });
                        }
                      });
                    }
                    //토큰 정상이야
                    else {
                      //실행 결과값 그대로 실행
                      dispatch(changeNavAlarmReviewEmojiUserData(r.data));
                      dispatch(showRoomUserProfile());
                    }
                  });
                }}
              >
                <img
                  className="w-[4rem] h-[4rem] cursor-pointer object-fill rounded-full"
                  src={to_profile}
                  alt=""
                />
              </div>
              <div className="flex-column justify-center pl-[1rem] pt-[1rem]">
                <div className="flex justify-start items-center overflow-x-scroll hideScroll nickNameNeon cursor-pointer textblack">
                  {to_nickname}
                </div>
                <div
                  className="flex justify-start text-xs pt-[0.5rem]"
                  style={{ color: "#737373" }}
                >
                  {createReviewat}
                </div>
              </div>
              <div className="flex justify-end items-center">
                <StarRating
                  setStarState={setStarState}
                  rating={rating}
                  setRating={setRating}
                />
              </div>
              <div className="flex items-center pl-[2rem]">
                <input
                  style={{
                    background: "black",
                    borderRadius: "0.4rem",
                    color: "white",
                    textShadow: "none",
                  }}
                  className={`text-base cursor-pointer reviewpage p-[0.3rem] pl-[0.5rem] pr-[0.5rem]`}
                  type="submit"
                  value={"평가하기"}
                  onClick={(e) => {
                    setRating(null);
                    let accessToken = localStorage.getItem("accessToken");
                    //리뷰 여기부터 해야함
                    axios({
                      method: "put",
                      url: "https://i8e201.p.ssafy.io/api/user/review",
                      data: {
                        reviewId: reviewId,
                        reviewScore: starState,
                        toUsername: to_username,
                      },
                      headers: {
                        accessToken: `${accessToken}`,
                      },
                    }).then((r) => {
                      //토큰이상해
                      if ("401" === r.data.status) {
                        //토큰 재요청
                        console.log("토큰 이상함");
                        const refreshToken =
                          localStorage.getItem("refreshToken");
                        const Username = localStorage.getItem("Username");
                        axios({
                          method: "get",
                          url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
                          headers: {
                            refreshToken: refreshToken,
                          },
                        }).then((r) => {
                          //재발급 실패
                          if ("401" === r.data.status) {
                            localStorage.clear();
                            toast.error("인증되지 않은 유저입니다");
                            navigate("/");
                          }
                          //재발급 성공
                          else {
                            console.log("재발급 성공", r.data.accessToken);
                            localStorage.setItem(
                              "accessToken",
                              r.data.accessToken
                            );
                            accessToken = r.data.accessToken;
                            //원래 axios 실행
                            axios({
                              method: "put",
                              url: "https://i8e201.p.ssafy.io/api/user/review",
                              data: {
                                reviewId: reviewId,
                                reviewScore: starState,
                                toUsername: to_username,
                              },
                              headers: {
                                accessToken: `${accessToken}`,
                              },
                            }).then(() => {
                              toast.success(
                                `${to_nickname}님을 평가 완료하였습니다`
                              );
                              axios({
                                method: "get",
                                url: `https://i8e201.p.ssafy.io/api/user/review/${username}`,
                                headers: {
                                  accessToken: `${accessToken}`,
                                },
                              }).then((r) => {
                                const datas: any[] = r.data.data;
                                // 현재 날짜 지정
                                const now = new Date();
                                // 현재 연도
                                let now_year = now.getFullYear();
                                // 현재 월
                                let now_month = (
                                  "0" +
                                  (now.getMonth() + 1)
                                ).slice(-2);
                                // 현재 일
                                let now_day = ("0" + now.getDate()).slice(-2);
                                let two_day_ago = (
                                  "0" +
                                  (now.getDate() - 2)
                                ).slice(-2);
                                // 현재 연도-월-일
                                const nowYMD: any = new Date(
                                  now_year + "-" + now_month + "-" + now_day
                                );
                                const threeBeforeYMD: any = new Date(
                                  now_year + "-" + now_month + "-" + two_day_ago
                                );

                                // 3일
                                // 리뷰 이전
                                const Beforedata: any = datas.filter((data) => {
                                  const review_create_at = new Date(
                                    data.create_at.split("T")[0]
                                  );
                                  return (
                                    data.review_at === null &&
                                    review_create_at <= nowYMD &&
                                    threeBeforeYMD <= review_create_at
                                  );
                                });
                                const currentBeforedata = Beforedata.reverse();
                                setReviewBefore(currentBeforedata);
                                // 리뷰 이후
                                const Afterdata: any = datas.filter((data) => {
                                  return data.review_at !== null;
                                });
                                const currentAfterReview = Afterdata.reverse();
                                setReviewAfter(currentAfterReview);
                              });
                            });
                          }
                        });
                      }
                      //토큰 정상이야
                      else {
                        //실행 결과값 그대로 실행
                        toast.success(`${to_nickname}님을 평가 완료하였습니다`);
                        axios({
                          method: "get",
                          url: `https://i8e201.p.ssafy.io/api/user/review/${username}`,
                          headers: {
                            accessToken: `${accessToken}`,
                          },
                        }).then((r) => {
                          const datas: any[] = r.data.data;
                          // 현재 날짜 지정
                          const now = new Date();
                          // 현재 연도
                          let now_year = now.getFullYear();
                          // 현재 월
                          let now_month = ("0" + (now.getMonth() + 1)).slice(
                            -2
                          );
                          // 현재 일
                          let now_day = ("0" + now.getDate()).slice(-2);
                          let two_day_ago = ("0" + (now.getDate() - 2)).slice(
                            -2
                          );
                          // 현재 연도-월-일
                          const nowYMD: any = new Date(
                            now_year + "-" + now_month + "-" + now_day
                          );
                          const threeBeforeYMD: any = new Date(
                            now_year + "-" + now_month + "-" + two_day_ago
                          );

                          // 3일
                          // 리뷰 이전
                          const Beforedata: any = datas.filter((data) => {
                            const review_create_at = new Date(
                              data.create_at.split("T")[0]
                            );
                            return (
                              data.review_at === null &&
                              review_create_at <= nowYMD &&
                              threeBeforeYMD <= review_create_at
                            );
                          });
                          const currentBeforedata = Beforedata.reverse();
                          setReviewBefore(currentBeforedata);
                          // 리뷰 이후
                          const Afterdata: any = datas.filter((data) => {
                            return data.review_at !== null;
                          });
                          const currentAfterReview = Afterdata.reverse();
                          setReviewAfter(currentAfterReview);
                        });
                      }
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            gridTemplateRows: "2.1fr 0.8fr 0.8fr",
            background: "#FFFF",
            borderRadius: "1rem",
            height: "5rem",
          }}
        >
          {/* 이모지, 닉네임, 별점 */}
          <div className="flex h-full justify-center center items-center">
            <div
              className="grid w-[80%] h-full"
              style={{ gridTemplateColumns: "0.9fr 2.7fr 2.2fr 0.4fr" }}
            >
              <div
                className="flex justify-center items-center mr-0"
                onClick={() => {
                  // 클릭한 유저 정보 가져와서 담아주기
                  let accessToken = localStorage.getItem("accessToken");
                  axios({
                    method: "get",
                    url: `https://i8e201.p.ssafy.io/api/user/info/${to_username}`,
                    headers: {
                      accessToken: `${accessToken}`,
                    },
                  }).then((r) => {
                    //토큰이상해
                    if ("401" === r.data.status) {
                      //토큰 재요청
                      console.log("토큰 이상함");
                      const refreshToken = localStorage.getItem("refreshToken");
                      const Username = localStorage.getItem("Username");
                      axios({
                        method: "get",
                        url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
                        headers: {
                          refreshToken: refreshToken,
                        },
                      }).then((r) => {
                        //재발급 실패
                        if ("401" === r.data.status) {
                          localStorage.clear();
                          toast.error("인증되지 않은 유저입니다");
                          navigate("/");
                        }
                        //재발급 성공
                        else {
                          console.log("재발급 성공", r.data.accessToken);
                          localStorage.setItem(
                            "accessToken",
                            r.data.accessToken
                          );
                          accessToken = r.data.accessToken;
                          axios({
                            method: "get",
                            url: `https://i8e201.p.ssafy.io/api/user/info/${to_username}`,
                            headers: {
                              accessToken: `${accessToken}`,
                            },
                          }).then((r) => {
                            dispatch(changeNavAlarmReviewEmojiUserData(r.data));
                            dispatch(showRoomUserProfile());
                          });
                        }
                      });
                    }
                    //토큰 정상이야
                    else {
                      //실행 결과값 그대로 실행
                      dispatch(changeNavAlarmReviewEmojiUserData(r.data));
                      dispatch(showRoomUserProfile());
                    }
                  });
                }}
              >
                <img
                  className="w-[4rem] h-[4rem] cursor-pointer object-fill rounded-full"
                  src={to_profile}
                  alt=""
                />
              </div>
              <div className="flex-column justify-center pl-[1rem] pt-[1rem]">
                <div className="flex justify-start items-center overflow-x-scroll hideScroll nickNameNeon cursor-pointer textblack">
                  {to_nickname}
                </div>
                <div
                  className="flex justify-start text-xs pt-[0.5rem]"
                  style={{ color: "#737373" }}
                >
                  {createReviewat}
                </div>
              </div>
              <div className="flex-column justify-center">
                <span
                  className="flex justify-end font-semibold text-[1.4rem] pt-[0.7rem]"
                  style={{ color: "black" }}
                >
                  {review_score}점
                </span>
                <div
                  className="flex justify-end text-xs pl-[0.2rem] pt-[0.2rem]"
                  style={{ color: "#737373" }}
                >
                  {finishReviewat}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 별점 기능
function StarRating({ setStarState, rating, setRating }: any): JSX.Element {
  const [hover, setHover] = useState(null) as any;
  setStarState(rating);

  return (
    <div className="flex">
      {[...Array(5)].map((star, idx) => {
        const ratingValue = idx + 1;
        return (
          <label>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => {
                setRating(ratingValue);
              }}
            />
            <FaStar
              className="star"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              size={25}
              onMouseEnter={() => {
                setHover(ratingValue);
              }}
              onMouseLeave={() => {
                setHover(null);
              }}
            />
          </label>
        );
      })}
    </div>
  );
}
