import styles from "./Twenty.module.css";
import { useState, useEffect } from "react";
import TwentyManual from "./TwentyManual";
import TwentyPlay from "./TwentyPlay";
import axios from "axios";

function TwentyIntro({
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

  // 

  useEffect(() => {
    // 스무고개 게임 시그널받기
    socket.on("game_twenty_signal", (signalData: string, data: any) => {
      getPochaInfo();
      setTimeout(() => {
        console.log("here"+signalData);
        setSignal(signalData);
        setResultData(data);
      }, 1000);
    });
    return () => {
      socket.off("game_twenty_signal");
    };
  }, []);

  // 클릭하면 서버로 시그널 보냄

  const onClickSignal = (e:any) => {
    const signalData =  e;
    console.log("보내는거냐", signalData);
    socket.emit("game_twenty_signal", roomName, signalData);
  };

  const onClickClose = () => {
    // 선택창으로 돌아가기
    socket.emit("game_back_select", roomName);
  };

  return (
    <>
      {signal === "PLAY" ? (
        <TwentyPlay socket={socket} pochaId={pochaId} />
      ) : null}
      {signal === "MANUAL" ? (
        <TwentyManual socket={socket} pochaId={pochaId} />
      ) : null}
      {signal === "INTRO" ? (
            <div className={`${styles.setSize} ${styles.intro}`}>
            <div className={`${styles.introButtons }`} >
                <div className={`${styles.introButton }`} onClick={(e)=>{onClickSignal("PLAY")}}>PLAY</div>
                <div className={`${styles.introButton }`} onClick={(e)=>{onClickSignal("MANUAL")}}>MANUAL</div>
                <div className={`${styles.introButton }`} onClick={onClickClose} >EXIT</div>
            </div>
        </div>
      ) : null}
    </>
  );
}

export default TwentyIntro;
