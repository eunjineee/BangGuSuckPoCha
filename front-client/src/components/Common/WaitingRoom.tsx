import axios from "axios";
import { FaStar } from "react-icons/fa";
import btnStyles from "./RoomUserProfile.module.css";
import aniStyles from "./WaitingRoom.module.css";
import { useState, useRef, useEffect } from "react";
import { changeAlarmApiDataState } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function WaitingRoom({
  pochaId,
  socket,
  waitEnd,
  myInfo,
}: {
  pochaId: string;
  socket: any;
  waitEnd: Function;
  myInfo: any;
}): JSX.Element {
  const username = localStorage.getItem("Username");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  // 처음에 받아오는 포차 정보
  const [pochaInfo, setPochaInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [introduce, setIntroduce] = useState<string>("");
  const [myIntroduce, setMyIntroduce] = useState<Array<string>>([]);
  const [timer, setTimer] = useState<number>(0);

  const navigate = useNavigate();

  const ChangeIntroduce = (event: any) => {
    setIntroduce(event.target.value);
  };

  const getPochaInfo = async (flag: boolean) => {
    try {
      await axios({
        url: `https://i8e201.p.ssafy.io/api/pocha/${Number(pochaId)}`,
        headers: {
          accessToken: `${accessToken}`,
        },
      }).then((r) => {
        // 토큰 갱신 필요
        if (r.data.status === "401") {
          axios({
            method: "get",
            url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
            headers: {
              refreshToken: `${refreshToken}`,
            },
          }).then((r) => {
            // 돌려보내기
            if (r.data.status === "401") {
              localStorage.clear();
              toast.error("인증되지 않은 유저입니다");
              navigate("/");
            } else {
              // 엑세스 토큰 추가
              localStorage.setItem("accessToken", r.data.accessToken);
              // 재요청
              axios({
                url: `https://i8e201.p.ssafy.io/api/pocha/${Number(pochaId)}`,
                headers: {
                  accessToken: `${r.data.accessToken}`,
                },
              }).then((r) => {
                setPochaInfo(r.data);
                if (flag) {
                  console.log("fleg: ", flag);
                  console.log("미팅 포차 입장!!!");
                  console.log(r.data);
                  setIsLoading(false);
                  socket.emit("wait", {
                    roomName: pochaId,
                    username: myInfo.username,
                    nickname: myInfo.nickname,
                    limit: r.data.data.limitUser,
                  });
                }
                // console.log(r);
              });
            }
          });
        } else {
          setPochaInfo(r.data);
          if (flag) {
            console.log("미팅 포차 입장!!!");
            console.log(r.data);
            setIsLoading(false);
            socket.emit("wait", {
              roomName: pochaId,
              username: myInfo.username,
              nickname: myInfo.nickname,
              limit: r.data.data.limitUser,
            });
          }
          // console.log(r);
          //test
        }
      });
    } catch (error) {
      console.log("포차 정보 받아오기", error);
    }
  };
  // const getPochaInfo = async (flag: boolean) => {
  //   try {
  //     const { data } = await axios({
  //       url: `https://i8e201.p.ssafy.io/api/pocha/${Number(pochaId)}`,
  //     });
  //     setPochaInfo(data.data);

  //     if (flag) {
  //       setIsLoading(false);
  //       socket.emit("wait", {
  //         roomName: pochaId,
  //         username: myInfo.username,
  //         nickname: myInfo.nickname,
  //         limit: data.data.limitUser,
  //       });
  //     }
  //     console.log(data);
  //   } catch (error) {
  //     console.log("포차 정보 받아오기", error);
  //   }
  // };

  // 자기소개 추가
  const addMyIntroduce = async (e: any) => {
    if (e.key === "Enter") {
      if (introduce === "" || introduce == null || introduce === undefined)
        return;

      let flag = true;
      for (const entity of myIntroduce) {
        if (entity === introduce) {
          flag = false;
          break;
        }
      }

      if (flag && myIntroduce.length < 5) {
        setMyIntroduce([...myIntroduce, introduce]);
      }

      setIntroduce("");
    }
  };

  // 자기소개 요소 삭제
  const deleteMyIntroduce = async (event: any) => {
    const deleteIntorduce = event.target.innerText.substring(
      1,
      event.target.innerText.length
    );
    const changeIntroduce = myIntroduce.filter(
      (entity) => entity !== deleteIntorduce
    );
    setMyIntroduce(changeIntroduce);
  };

  // 미팅 포차 대기방 나가기
  const exitWaitingRoom = () => {
    navigate("/main");
    window.location.reload();
  };

  useEffect(() => {
    getPochaInfo(true);

    socket.on("wait_update", () => {
      getPochaInfo(false);
    });
    socket.on("wait_end", (time: string) => {
      getPochaInfo(false);
      let goal = new Date(time);

      goal.setSeconds(goal.getSeconds() + 20);
      const waitTime = goal.getTime();
      const startTime = new Date().getTime();
      console.log("시간 비교!!!!!");
      console.log(waitTime);
      console.log(startTime);

      const diff = waitTime - startTime;
      setTimer(Math.floor(diff / 1000));
      setTimeout(waitEnd, diff);
    });

    // ------------ 연결 해제 --------------
    return () => {
      socket.off("wait_update");
      socket.off("wait_end");
    };
    ////////////////////////////////////////////
  }, []);

  useEffect(() => {
    localStorage.setItem("myIntroduce", JSON.stringify(myIntroduce));
  }, [myIntroduce]);

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);
    if (timer === 0) {
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [timer]);

  return (
    <>
      {isLoading ? (
        <div></div>
      ) : (
        <>
          <div
            className={`flex text-white w-screen min-h-screen bg-cover bg-no-repeat bg-center bg-scroll`}
          >
            <div className="w-[30%]"></div>
            <div className="flex-col w-[100%] self-center">
              {timer > 0 ? (
                <div
                  className="text-center text-9xl"
                  style={{ height: "158px" }}
                >
                  {timer}
                </div>
              ) : (
                <div className="text-center">
                  <img
                    src={require("../../assets/roomIcon/wait-time.png")}
                    alt=""
                    className={`${aniStyles.rotate}`}
                    style={{
                      margin: "auto",
                    }}
                  />
                </div>
              )}
              <div className="text-center m-2 text-2xl font-bold">
                {pochaInfo.data.totalCount} / {pochaInfo.data.limitUser}
              </div>
              {timer > 0 ? (
                <div className="text-center m-1 text-3xl font-bold">
                  매칭 완료
                </div>
              ) : (
                <div className="text-center m-1 text-3xl font-bold">매칭중</div>
              )}
              <div className="flex justify-center items-center my-10">
                <div className="w-[45%]">
                  <div className="text-start m-2 text-3xl text-red-500 font-bold">
                    Tips!
                  </div>
                  <div className="text-start m-2 text-2xl">
                    매칭을 기다리면서 자기소개 키워드를 작성해보세요!
                  </div>
                </div>
              </div>

              <div className="text-center m-2 text-xl">{`ex) 반려동물, MBTI, 관심사, 좋아하는 음식, 영화, 계절`}</div>
              <input
                type="text"
                maxLength={10}
                className="w-[45%] rounded-lg p-1 text-center m-2 text-xl text-black border-2 caret-black"
                placeholder="소개할 정보를 입력하세요"
                value={introduce}
                onChange={ChangeIntroduce}
                onKeyDown={addMyIntroduce}
              />
              <div className="flex m-2">
                <div className="w-[25%]"></div>
                <div className="flex-wrap text-center w-[80%]">
                  {myIntroduce.map((input, index) => (
                    <div
                      className="inline-block border-2 border-white text-xl p-2 m-2 rounded-xl cursor-pointer"
                      key={index}
                      onClick={deleteMyIntroduce}
                    >{`#${input}`}</div>
                  ))}
                </div>
                <div className="w-[25%] my-10"></div>
              </div>
              <input
                className={`${btnStyles.cancelBtn} cursor-pointer`}
                onClick={exitWaitingRoom}
                style={{ fontSize: "1.3rem" }}
                type="button"
                value="취소하기"
              />
            </div>
            <div className="w-[30%]"></div>
          </div>
        </>
      )}
    </>
  );
}
export default WaitingRoom;
