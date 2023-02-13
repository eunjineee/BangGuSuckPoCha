import styles from "./LiarIntro.module.css";
import { useState, useEffect } from "react";
import LiarMenual from "./LiarMenual";
import LiarTitle from "./LiarTitle";
import LiarVote from "./LiarVote";
import axios from "axios";

function LiarIntro({
  socket,
  pochaId,
  pochaUsers,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
}): React.ReactElement {
  // 방 이름
  const roomName = pochaId;
  // 메뉴얼 클릭
  const [signal, setSignal] = useState<string>("INTRO");

  const [pochaInfo, setPochaInfo] = useState<any>(null)

  const [isliar, setIsliar] = useState<any>(null);


  function getLiarInfo(data: boolean) {
    setIsliar(data)
  }
  // 포차 정보 요청
  const getPochaInfo = async () => {
    try {
      const {data : {data}} = await axios({
        method: "GET",
        url: `https://i8e201.p.ssafy.io/api/pocha/${pochaId}`,
      })
      console.log("포차정보 데이터 잘 오냐!? SON",data);
      setPochaInfo(data);
    } catch(error) {
      console.log("Son게임에서 포차정보 에러", error);
    }
  }

  useEffect(() => {
    // 라이어 게임 시그널받기
    socket.on("game_liar_signal", (signalData: string) => {
      getPochaInfo();
      setTimeout(() => {
        setSignal(signalData);
      }, 1000);
    });
    return () => {
      socket.off("game_liar_signal");
    };
  }, []);

  // 클릭하면 서버로 시그널 보냄
  const onClickSignal = (event: React.MouseEvent<HTMLInputElement>) => {
    const signalData = event.currentTarget.value;
    console.log("보내는거냐", signalData);
    socket.emit("game_liar_signal", roomName, signalData);
  };

  const onClickClose = () => {
    // 선택창으로 돌아가기
    socket.emit("game_back_select", roomName);
  };

  return (
    <>
      {signal === "PLAY" ? (
        <LiarTitle socket={socket} pochaId={pochaId} pochaUsers={pochaUsers} pochaInfo={pochaInfo} getLiarInfo={getLiarInfo}/>
      ) : null}
      {signal === "MENUAL" ? (
        <LiarMenual socket={socket} pochaId={pochaId} pochaUsers={pochaUsers}/>
      ) : null}
      {signal === "VOTE" ? (
        <LiarVote socket={socket} pochaId={pochaId} pochaUsers={pochaUsers}  pochaInfo={pochaInfo} isliar={isliar}/>
      ) : null}
      {signal === "INTRO" ? (
        <div className={`${styles.layout3}`}>
          <div className={`${styles.box} ${styles.layout}`}>
            <img 
              src={require("src/assets/game_liar/LiarImg.png")}
              className={`${styles.img1}`}
            />
            <div className={`${styles.box2} ${styles.layout2}`}>
              LIAR GAME 
            </div>
            <div className={`${styles.box3} ${styles.layout5}`}>
              라이어 게임
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

export default LiarIntro;
