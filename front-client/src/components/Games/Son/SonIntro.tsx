import styles from "./SonIntro.module.css";
import { useState, useEffect, useRef } from "react";
import SonMenual from "./SonMenual";
import SonPlay from "./SonPlay";
import axios from "axios";
import SonResult from "./SonResult";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
function SonIntro({
  socket,
  pochaId,
}: {
  socket: any;
  pochaId: string;
}): React.ReactElement {
  // 방 이름
  const roomName = pochaId;
  // 메뉴얼 클릭
  const [signal, setSignal] = useState<string>("INTRO");
  const [resultData, setResultData] = useState<any>(null);
  // 포차 정보
  const [pochaInfo, setPochaInfo] = useState<any>(null);
  // 포차 유저 정보
  const [pochaUsers, setPochaUsers] = useState<any>(null);


  // 포차 유저 정보 요청
  const getPochaUsers = async () => {
    try {
      const {data: {data}} = await axios({
        method: "GET",
        url: `https://i8e201.p.ssafy.io/api/pocha/participant/${pochaId}`
      })
      console.log("포차유저정보왔냐",data)
      setPochaUsers(data);
    } catch(error) {
      console.log("손병호intro", error);
    }
  } 

  // 포차 정보 요청
  const getPochaInfo = async () => {
    try {
      const {data : {data}} = await axios({
        method: "GET",
        url: `https://i8e201.p.ssafy.io/api/pocha/${pochaId}`,
      })
      console.log("포차정보 데이터 잘 오냐!? SON에서",data);
      setPochaInfo(data);
    } catch(error) {
      console.log("Son게임에서 포차정보 에러", error);
    }
  }

  useEffect(() => {
    getPochaUsers();
    // 손병호 게임 시그널받기
    socket.on("game_son_signal", (signalData: string, data: any) => {
      console.log("끝나는 시그널?", signalData);
      getPochaInfo();
      setTimeout(() => {
        setSignal(signalData);
        setResultData(data);
      }, 1000);
    });
    return () => {
      socket.off("game_son_signal");
    };
  }, []);

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

  // 클릭하면 서버로 시그널 보냄
  const onClickSignal = (event: React.MouseEvent<HTMLInputElement>) => {
    const signalData = event.currentTarget.value;
    console.log("보내는거냐", signalData);
    socket.emit("game_son_signal", roomName, signalData);
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
      {signal === "PLAY" &&  pochaUsers ? (
        <SonPlay socket={socket} pochaId={pochaId} pochaUsers={pochaUsers} pochaInfo={pochaInfo} />
      ) : null}
      {signal === "RESULT" ? <SonResult socket={socket} pochaId={pochaId} resultData={resultData}/> : null}
      {signal === "MENUAL" ? (
        <SonMenual socket={socket} pochaId={pochaId} pochaUsers={pochaUsers} />
      ) : null}
      {signal === "INTRO" ? (
        <div className={`${styles.layout3}`}>
          <div className={`${styles.box} ${styles.layout}`}>
            <img
              src={require("src/assets/game_son/강도1.png")}
              className={`${styles.img1}`}
              alt="son1"
            />
            <img
              src={require("src/assets/game_son/강도손.png")}
              className={`${styles.img2}`}
              alt="son2"
            />
            <div className={`${styles.box2} ${styles.layout2}`}>
              손병호 게임
            </div>
            <div className={`${styles.box3} ${styles.layout5}`}>
              손가락 접기
            </div>
            <div className={`${styles.layout4}`}>
              <input
                type="button"
                className={`${styles.retry}`}
                onClick={onClickClose}
                value="EXIT"
              />
              <input
                onClick={onClickSignal}
                type="button"
                className={`${styles.retry}`}
                value="MENUAL"
              />
              <input
                onClick={onClickSignal}
                type="button"
                className={`${styles.retry}`}
                value="PLAY"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default SonIntro;
