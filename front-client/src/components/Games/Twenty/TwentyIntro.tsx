import styles from "./Twenty.module.css";
import { useState, useEffect, useRef } from "react";
import TwentyManual from "./TwentyManual";
import TwentyPlay from "./TwentyPlay";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
function TwentyIntro({
  socket,
  pochaId,
}: {
  socket: any;
  pochaId: string;
}): React.ReactElement {
  const navigate = useNavigate();
  // 방 이름
  const roomName = pochaId;
  // 메뉴얼 클릭
  const [signal, setSignal] = useState<string>("INTRO");
  const [resultData, setResultData] = useState<any>(null);

  // 포차 정보
  const [pochaInfo, setPochaInfo] = useState<any>(null);

  // 효과음
  const player = useRef<any>();
  const Player = () => (
    <AudioPlayer
      ref={player}
      autoPlay={true}
      // preload='auto'
      // loop
      src="/balanceGame/BBong.mp3"
      onPlay={(e) => console.log("onPlay")}
      style={{ display: "none" }}
      volume={0.5}
      // other props here
    />
  );

  // 포차 정보 요청
  const getPochaInfo = async () => {
    let accessToken = localStorage.getItem("accessToken");
    axios({
      method: "GET",
      url: `https://i8e201.p.ssafy.io/api/pocha/${pochaId}`,
      headers: {
        accessToken: accessToken,
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
              method: "GET",
              url: `https://i8e201.p.ssafy.io/api/pocha/${pochaId}`,
              headers: {
                accessToken: accessToken,
              },
            }).then((r) => {
              console.log("포차정보 데이터 잘 오냐!? SON에서", r.data);
              setPochaInfo(r.data);
            });
          }
        });
      }
      //토큰 정상이야
      else {
        //실행 결과값 그대로 실행
      }
    });

    // 원본
    // try {
    //   const {
    //     data: { data },
    //   } = await axios({
    //     method: "GET",
    //     url: `https://i8e201.p.ssafy.io/api/pocha/${pochaId}`,
    //     headers: {
    //       accessToken: accessToken,
    //     },
    //   });

    //   console.log("포차정보 데이터 잘 오냐!? SON에서", data);
    //   setPochaInfo(data);
    // } catch (error) {
    //   console.log("Son게임에서 포차정보 에러", error);
    // }
  };

  //

  useEffect(() => {
    // 스무고개 게임 시그널받기
    socket.on("game_twenty_signal", (signalData: string, data: any) => {
      getPochaInfo();
      setTimeout(() => {
        console.log("here" + signalData);
        setSignal(signalData);
        setResultData(data);
      }, 1000);
    });
    return () => {
      socket.off("game_twenty_signal");
    };
  }, []);

  // 클릭하면 서버로 시그널 보냄

  const onClickSignal = (e: any) => {
    const signalData = e;
    console.log("보내는거냐", signalData);
    socket.emit("game_twenty_signal", roomName, signalData);
  };

  const onClickClose = () => {
    // 선택창으로 돌아가기
    socket.emit("game_back_select", roomName);
  };

  return (
    <>
      {
        <Player/>
      }
      {signal === "PLAY" ? (
        <TwentyPlay socket={socket} pochaId={pochaId} />
      ) : null}
      {signal === "MANUAL" ? (
        <TwentyManual socket={socket} pochaId={pochaId} />
      ) : null}
      {signal === "INTRO" ? (
        <div className={`${styles.setSize} ${styles.intro}`}>
          <div className={`${styles.introButtons}`}>
            <div
              className={`${styles.introButton}`}
              onClick={(e) => {
                onClickSignal("PLAY");
              }}
            >
              PLAY
            </div>
            <div
              className={`${styles.introButton}`}
              onClick={(e) => {
                onClickSignal("MANUAL");
              }}
            >
              MANUAL
            </div>
            <div className={`${styles.introButton}`} onClick={onClickClose}>
              EXIT
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default TwentyIntro;
