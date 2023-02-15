import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "src/store/hooks";
import FriendChat from "../Common/FriendChat";
import FriendList from "../Common/FriendList";
import Navbar from "../Common/Navbar";
import NavbarAlarm from "../Common/NavbarAlarm";
import NavbarMenu from "../Common/NavbarMenu";
import styles from "../Common/Common.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PointHistory = () => {
  const navigate = useNavigate();
  const Username = localStorage.getItem("Username");
  const refreshToken = localStorage.getItem("refreshToken");
  const [History, setHistory] = useState<any>();
  const [MyInfo, setMyInfo] = useState<any>();
  //  메뉴 -> 친구 클릭 -> 채팅 상태
  const menuFriendChatClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendChatClickCheck;
  });

  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken");
    axios({
      method: "get",
      url: `https://i8e201.p.ssafy.io/api/user/point/${Username}`,
      headers: {
        accessToken: accessToken,
      },
    }).then((r) => {
      //이상한 token으로 요청하는 중이지?
      if ("401" === r.data.status) {
        axios({
          method: "get",
          url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
          headers: {
            refreshToken: refreshToken,
          },
        }).then((r) => {
          console.log("해치웠나?", r.data);
          if ("401" === r.data.status) {
            localStorage.clear();
            toast.error("인증되지 않은 유저입니다");
            navigate("/");
          } else {
            //재발급이 완만하게 됨
            localStorage.setItem("accessToken", r.data.accessToken);
            accessToken = r.data.accessToken;
            axios({
              method: "get",
              url: `https://i8e201.p.ssafy.io/api/user/point/${Username}`,
              headers: {
                accessToken: accessToken,
              },
            }).then((r) => {
              console.log(r.data.data);
              setHistory(r.data.data);
              axios({
                method: "get",
                url: `https://i8e201.p.ssafy.io/api/user/myinfo/${Username}`,
                headers: {
                  accessToken: accessToken,
                },
              })
                .then((r) => {
                  console.log(r.data.data);
                  setMyInfo(r.data.data);
                })
                .catch((e) => {
                  console.log("두번째", e);
                });
            });
          }
        });
      } else {
        //이상한게 아니군 그냥해
        console.log("토큰 이상무", r.data.data);
        setHistory(r.data.data);
        axios({
          method: "get",
          url: `https://i8e201.p.ssafy.io/api/user/myinfo/${Username}`,
          headers: {
            accessToken: accessToken,
          },
        }).then((r) => {
          console.log(r.data.data);
          setMyInfo(r.data.data);
        });
      }
    });
  }, []);

  return (
    <>
      {/* nav의 메뉴 => friend 클릭 시 친구 목록 보이기 */}
      <FriendList />
      {menuFriendChatClickCheck ? <FriendChat /> : null}
      {/* 메뉴 클릭시 보이기 */}
      <NavbarMenu />
      {/* 알림 클릭시 보이기 */}
      <NavbarAlarm />
      <div
        className="w-screen min-h-screen font-nanum text-white"
        style={{ backgroundColor : "#1C1C1C" }}
      >
        <Navbar />
        {History ? (
          <>
            <div className="flex flex-col h-fit" style={{ paddingTop : "11rem"}}>
              <div className="flex flex-row border-b-2">
                <div className="w-[50rem] mx-auto pt-16 pl-12 pr-12">
                  <div className="flex flex-col w-[18rem] h-[7rem]">
                    <div className="h-[50%] text-justify text-3xl font-extrabold">
                      포인트
                    </div>
                    <div className="h-[50%] text-justify text-lg">
                      {MyInfo ? <>{MyInfo.nickname}님 환영합니다.</> : null}
                    </div>
                  </div>
                  <div className="h-[2rem] text-xl ">현재 포인트</div>
                  <div className="h-[4rem] text-5xl font-extrabold text-sky-500 ">
                    {MyInfo ? <>{MyInfo.point}p</> : null}
                  </div>
                  <div className="h-[4rem] w-[13rem] text-justify pt-4 text-2xl font-extrabold">
                    포인트 내역
                  </div>
                </div>
              </div>
              <div className="flex flex-row">
                <div
                  className={`flex flex-col-reverse w-[50rem] mx-auto pt-3 max-h-[28rem] ${styles.hideScroll}`}
                  style={{ overflow: "auto" }}
                >
                  {History ? (
                    <>
                      {History.map((it: any): any => {
                        return (
                          <div className="flex justify-center w-full h-[8rem] pt-2 ">
                            <div className="flex flex-row justify-between w-[90%] h-[100px] bg-white rounded-2xl border-2">
                              <div className="flex flex-col pt-5 w-[30%] text-center h-full">
                                <div className="font-bold text-[20px] text-black">
                                  {it.content === "출석체크" ? (
                                    <>출석체크</>
                                  ) : it.content.split("-")[0] === "썰 변경" ? (
                                    <>썰변경</>
                                  ) : null}
                                </div>
                                <div className="text-neutral-400 font-bold">
                                  {it.create_at.split("T")[0].split("-")[0]}.
                                  {it.create_at.split("T")[0].split("-")[1]}.
                                  {it.create_at.split("T")[0].split("-")[2]}
                                </div>
                              </div>
                              <div className="flex flex-col pt-3 w-[40%] text-center h-full">
                                {Number(it.amount) > 0 ? (
                                  <div className="font-extrabold text-[25px] text-blue-800">
                                    {it.amount}P
                                  </div>
                                ) : (
                                  <div className="font-extrabold text-[25px] text-red-700">
                                    {it.amount}P
                                  </div>
                                )}

                                <div className="text-neutral-400 font-bold">
                                  {it.current_point}P
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : null}
                </div>

              </div>
            </div>
          </>
        ) : (
          <>
            <div className="h-[30%]">없음</div>
            <div className="h-[30%]">없음</div>
            <div className="h-[30%]">없음</div>
          </>
        )}
      </div>
    </>
  );
};

export default PointHistory;
