import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "src/store/hooks";
import FriendChat from "../Common/FriendChat";
import FriendList from "../Common/FriendList";
import Navbar from "../Common/Navbar";
import NavbarAlarm from "../Common/NavbarAlarm";
import NavbarMenu from "../Common/NavbarMenu";
import styles from "../Common/Common.module.css";

const PointHistory = () => {
  const Username = localStorage.getItem("Username");
  const [History, setHistory] = useState<any>();
  const [MyInfo, setMyInfo] = useState<any>();
  //  메뉴 -> 친구 클릭 -> 채팅 상태
  const menuFriendChatClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendChatClickCheck;
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    axios({
      method: "get",
      url: `https://i8e201.p.ssafy.io/api/user/point/${Username}`,
      headers: {
        accessToken: accessToken,
      },
    })
      .then((r) => {
        console.log(r.data.data);
        setHistory(r.data.data);
      })
      .catch((e) => {
        console.log("첫번째", e);
      });

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
        className="grid grid-rows-4 w-screen h-screen font-nanum text-white bg-neutral-800"
        style={{ gridTemplateRows: "11rem" }}
      >
        <Navbar />
        {History ? (
          <>
            <div className="h-full"></div>
            <div className="flex flex-col h-full ">
              <div className="flex flex-row h-[45%] ">
                <div className="w-[30%] border-b-2 "></div>
                <div className="w-[40%] pt-16 pl-12 pr-12 border-b-2">
                  <div className="flex flex-col w-[18rem] h-[7rem]">
                    <div className="h-[50%] text-justify text-4xl font-extrabold">
                      포인트
                    </div>
                    <div className="h-[50%] text-justify text-[20px]">
                      {MyInfo ? <>{MyInfo.nickname}님 환영합니다.</> : null}
                    </div>
                  </div>
                  <div className="h-[2rem] text-2xl ">현재 포인트</div>
                  <div className="h-[4rem] text-5xl font-extrabold text-sky-500 ">
                    {MyInfo ? <>{MyInfo.point}p</> : null}
                  </div>
                  <div className="h-[4rem] w-[13rem] text-justify pt-4 text-[25px] font-extrabold">
                    포인트 내역
                  </div>
                </div>
                <div className="w-[30%] border-b-2"> </div>
              </div>
              <div className="flex flex-row h-[55%] ">
                <div className="w-[30%] "></div>
                <div
                  className={`flex flex-col-reverse  w-[40%] pt-3 max-h-[25rem] ${styles.hideScroll}`}
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
                <div className="w-[30%] "></div>
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
