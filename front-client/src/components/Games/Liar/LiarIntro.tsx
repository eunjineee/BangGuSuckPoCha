import styles from "./LiarIntro.module.css";
import { useState, useEffect, useRef } from "react";
import LiarManual from "./LiarManual";
import LiarTitle from "./LiarTitle";
import LiarVote from "./LiarVote";
import axios from "axios";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
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
  // 내 이름
  const myName = localStorage.getItem("Username");
  // 메뉴얼 클릭
  const [signal, setSignal] = useState<string>("INTRO");

  const [pochaInfo, setPochaInfo] = useState<any>(null);

  const [isHost, setIshost] = useState<any>(null);

  const [liarnum, setLiarnum] = useState<any>(false); // 라이어의 넘버

  const [mynum, setMyNum] = useState<any>(null); // 내번호

  // 포차 정보 요청
  const getPochaInfo = async () => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const {
        data: { data },
      } = await axios({
        method: "GET",
        url: `https://i8e201.p.ssafy.io/api/pocha/${pochaId}`,
        headers: {
          accessToken: accessToken,
        },
      });
      console.log("포차정보 데이터 잘 오냐!? SON", data);
      setPochaInfo(data);
    } catch (error) {
      console.log("Son게임에서 포차정보 에러", error);
    }
  };

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
    console.log("시그널 데이터: ", signalData);
    socket.emit("game_liar_signal", roomName, signalData);
  };

  const onClickClose = () => {
    // 선택창으로 돌아가기
    socket.emit("game_back_select", roomName);
  };

  // 방장은 누구?
  const setHostInfo = () => {
    pochaUsers.forEach((user: any, index: number) => {
      if (user.isHost === true) {
        setIshost(index);
      }
    });
  };

  // 내가 몇번째인지
  const setPeopleInfo = () => {
    pochaUsers.forEach((user: any, index: number) => {
      if (user.username === myName) {
        setMyNum(index);
      }
    });
  };

  //라이어 지정하기
  //라이어 넘버 정해주기
  const liarnumber = () => {
    if (mynum === isHost) {
      const totalCount = pochaInfo.totalCount;
      const liarnum = Math.floor(Math.random() * totalCount);
      setLiarnum(liarnum);
      setPeopleInfo();
      socket.emit("game_liar_number", roomName, liarnum);
    }
  };

  useEffect(() => {
    // console.log(pochaInfo);
    setHostInfo(); // 방장 누군지 > 라이어 뽑기 해줘야함
    if (mynum === isHost && pochaInfo) {
      liarnumber();
    }
  }, [pochaInfo]);

  return (
    <>
    {
      <Player />
    }
      {signal === "PLAY" ? (
        <LiarTitle
          socket={socket}
          pochaId={pochaId}
          pochaUsers={pochaUsers}
          pochaInfo={pochaInfo}
          liarnum={liarnum}
        />
      ) : null}
      {signal === "MANUAL" ? (
        <LiarManual socket={socket} pochaId={pochaId} pochaUsers={pochaUsers} />
      ) : null}
      {signal === "VOTE" ? (
        <LiarVote
          socket={socket}
          pochaId={pochaId}
          pochaUsers={pochaUsers}
          pochaInfo={pochaInfo}
          liarnum={liarnum}
        />
      ) : null}
      {signal === "INTRO" ? (
        <div className={`${styles.layout3}`}>
          <div className={`${styles.box} ${styles.layout}`}>
            <img
              src={require("src/assets/game_liar/LiarImg.png")}
              className={`${styles.img1}`}
              alt=""
            />
            <div className={`${styles.box2} ${styles.layout2}`}>LIAR GAME</div>
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
                value="MANUAL"
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
