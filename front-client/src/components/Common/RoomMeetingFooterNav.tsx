import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { showPublicModal } from "src/store/store";
import PublicModal from "./PublicModal";

function RoomMeetingFooterNav({
  pochaId,
  socket,
}: {
  pochaId: string;
  socket: any;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  // 룸 이름
  const roomName = pochaId;
  const userName = localStorage.getItem("Username");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const [modalData, setModalData] = useState<any>(null);
  // 짠 카운트
  const [count, setCount] = useState<string>("");

  // 최초실행
  // useEffect(() => {
  //   // 소켓데이터 세팅
  //   setSocket(data);
  // }, []);

  // 모달 보이기 관련
  const showModal = useAppSelector((state) => {
    return state.PublicModal;
  });

  // 포차 짠 함수
  const jjan = () => {
    let time: number = 3;
    setCount(String(time));
    const interval = setInterval(() => {
      time -= 1;
      setCount(String(time));
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setCount("짠!!!!");
    }, 3900);
    setTimeout(() => {
      setCount("");
      dispatch(showPublicModal(false));
    }, 5000);
  };

  // 클릭시 모달 보이는 함수
  const onClickShowModal = (event: React.MouseEvent<HTMLImageElement>) => {
    switch ((event.target as HTMLImageElement).alt) {
      // 나가기 관련 데이터
      case "exit":
        setModalData({
          type: "exit",
          msg: "포차에서 퇴장하시겠습니까?",
          pochaId,
          socket,
        });
        break;
      // 짠 관련 데이터
      case "jjan":
        setModalData({
          type: "jjan",
          msg: "짠??",
          pochaId,
          img: `${require("src/assets/roomIcon/cheer.png")}`,
          socket,
        });
        break;
    }
    // 모달 켜는 dispatch
    dispatch(showPublicModal(true));
  };

  // 현재 시간 관련
  const [currentDate, setCurrentDate] = useState();
  setInterval(() => {
    const date = new Date();
    // console.log(date.toLocaleTimeString('ko-kr').slice(0,7));
    let hour = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    setCurrentDate((hour + ":" + minutes) as any);
  }, 1000);

  //  axios 요청
  // const api = axios.create({
  //   baseURL: "https://i8e201.p.ssafy.io/api",
  //   headers: {
  //     "Content-Type": "application/json;charset=utf-8",
  //     accessToken: `${accessToken}`,
  //   },
  // });

  // 포차 설정 변경 이벤트
  async function handlePochaUpdate() {
    // 설정값 입력.
    let pocha_config = {};

    // axios를 통해 포차 설정 변경. (await 사용해야할 듯?)

    socket.emit("pocha_change", roomName);
  }
  // 포차 시간 추가 이벤트
  async function handlePochaExtension() {
    // axios를 통해 포차 시간 연장. (await 사용해야할 듯?)
    try {
      // await api.put("/pocha/extension/3");
      await axios({
        method: "PUT",
        url: `https://i8e201.p.ssafy.io/api/pocha/extension/3`,
        headers: {
          accessToken: `${accessToken}`,
        },
      }).then((r)=> {
        if (r.data.status === '401') {
          axios({
            method: 'get',
            url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${userName}`,
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
                method: "PUT",
                url: `https://i8e201.p.ssafy.io/api/pocha/extension/3`,
                headers: {
                  accessToken: `${r.data.accessToken}`,
                },
              }).then((r)=> {
                socket.emit("pocha_extension", roomName);
              })
            }
          })
        } else {
          socket.emit("pocha_extension", roomName);
        }
      })
    } catch (error) {
      console.log("시간추가 error", error);
    }
  }
  // // 포차 짠! 기능 : 방 설정 다시 불러오기.
  // socket.on("pocha_cheers", async () => {
  //   console.log("포차 짠!!!!!----------------ㅋㅋ------");
  //   // jjan();
  //   // 방 설정 다시 불러오기!!! 테스트
  //   // await pocha_config_update("3");
  // });

  return (
    <>
      {count ? (
        <div className="bg-orange-500 bg-opacity-30 flex justify-center z-20 items-center fixed top-0 right-0 bottom-0 left-0">
          <div className="text-7xl font-bold text-white">{count}</div>
        </div>
      ) : (
        <>
          {showModal && <PublicModal data={modalData} socket={socket} />}
          <div
            className="grid"
            style={{ gridTemplateColumns: "1fr 1.8fr 1fr" }}
          >
            <div></div>
            <div
              className="grid w-full"
              style={{ gridTemplateColumns: "0.6fr 8fr 0.6fr" }}
            >
              <div></div>
              <div className="grid" style={{ gridTemplateRows: "0.2fr 0.8fr" }}>
                <div></div>
                <div
                  className="grid  text-white p-2"
                  style={{
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr",
                    border: "solid 2px white",
                    borderBottom: "solid 0px",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <div className="flex justify-center items-center text-[2rem] ">
                    {currentDate}
                  </div>
                  <div className="flex flex-col justify-center items-center min-h-full max-h-full cursor-pointer">
                    <img
                      onClick={handlePochaExtension}
                      className="h-[2.2rem] py-auto transition-all duration-300 hover:scale-110"
                      src={require("src/assets/roomIcon/time.png")}
                      alt=""
                    />
                    <span className="text-[0.8rem] mt-1">시간추가</span>
                  </div>
                  <div className="flex flex-col justify-center items-center min-h-full max-h-full cursor-pointer">
                    <img
                      onClick={onClickShowModal}
                      className="h-[2.2rem] py-auto transition-all duration-300 hover:scale-110"
                      src={require("src/assets/roomIcon/cheers.png")}
                      alt="jjan"
                    />
                    <span className="text-[0.8rem] mt-1">짠</span>
                  </div>
                  {/* <div className="flex flex-col justify-center items-center min-h-full max-h-full cursor-pointer">
                    <img
                      className="h-[2.2rem] py-auto transition-all duration-300 hover:scale-110"
                      src={require("src/assets/roomIcon/add-user.png")}
                      alt=""
                    />
                    <span className="text-[0.8rem] mt-1">친구초대</span>
                  </div> */}
                  <div className="flex flex-col justify-center items-center min-h-full max-h-full cursor-pointer">
                    <img
                      className="h-[2.2rem] py-auto transition-all duration-300 hover:scale-110"
                      src={require("src/assets/roomIcon/exclamation-mark.png")}
                      alt=""
                    />
                    <span className="text-[0.8rem] mt-1">포차정보</span>
                  </div>
                  <div className="flex flex-col justify-center items-center min-h-full max-h-full cursor-pointer">
                    <img
                      onClick={onClickShowModal}
                      className="h-[2.2rem] py-auto transition-all duration-300 hover:scale-110"
                      src={require("src/assets/roomIcon/cancel.png")}
                      alt="exit"
                    />
                    <span className="text-[0.8rem] mt-1">나가기</span>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
            <div></div>
          </div>
        </>
      )}
    </>
  );
}
export default RoomMeetingFooterNav;
