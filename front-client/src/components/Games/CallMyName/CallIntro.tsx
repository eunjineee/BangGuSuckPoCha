import styles from "./CallIntro.module.css";
import { useState, useEffect, useRef } from "react";
import CallManual from "./CallManual";
import CallTitle from "./CallTitle";
import CallResult from "./CallResult";
import CallInput from "./CallInput";

import axios from "axios";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
function CallIntro({
  socket,
  pochaId,
}: {
  socket: any;
  pochaId: string;
}): React.ReactElement {
  // 방 이름
  const roomName = pochaId;
  // 내 이름
  const myName = localStorage.getItem("Username");
  // 메뉴얼 클릭
  const [signal, setSignal] = useState<string>("INTRO");
  // 포차 유저 정보
  const [pochaUsers, setPochaUsers] = useState<any>(null);

  const [pochaInfo, setPochaInfo] = useState<any>(null)  

  const [isHost, setIshost] = useState<any>(null);
  const [resultData, setResultData] = useState<any>(null);

  const [titles, setTitles] = useState<any>(null);
  const [nowtitles, setNowtitles] = useState<any>(null);

  const [mynum, setMyNum] = useState<any>(null); // 내번호

  useEffect(() => {
    // 양세찬 게임 시그널받기
    socket.on("game_call_signal", (signalData: string) => {
      getPochaInfo();
      setTimeout(() => {
        setSignal(signalData);
      }, 1000);
    });
    //결과 나오면
    socket.on("game_call_result", (signalData: string, data: any) => {
      setTimeout(() => {
        setResultData(data);
        setSignal(signalData);
      }, 1000);
    });
  }, []);

  useEffect(()=>{
    // 타이틀 받아오기
    socket.on("game_call_submit", (data: any) => {
      setTimeout(() => {
        console.log("[[[[[[[[[[[[[[[[[[[[받는다고!!!]]]]]]]]]]]]]]]]]");
        if(!nowtitles){
          setNowtitles(data);
        }
      }, 1000);
      
      console.log("[[[[[[[[[[[[[[[[[[[[받는다고!!!]]]]]]]]]]]]]]]]]", nowtitles)
    });
    return () => {
      socket.off("game_call_submit");
    };
  })
  useEffect(() => {
    getPochaInfo();
    getPochaUsers();
  },[]);

  useEffect(() => {
    if(pochaUsers){
      setHostInfo();
      setPeopleInfo();
    }
  },[pochaUsers]);
  
  useEffect(()=>{
    if (mynum === isHost){
      getCallSubject();
    }
  },[isHost])


  useEffect(()=>{
    if ((mynum === isHost)&&(!nowtitles)){
      titlechoice();
    }
  },[titles])


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
      console.log("포차정보 데이터 잘 오냐!? call", data);
      setPochaInfo(data);
    } catch (error) {
      console.log("Call게임에서 포차정보 에러", error);
    }
  };

  // 클릭하면 서버로 시그널 보냄
  const onClickSignal = (event: React.MouseEvent<HTMLInputElement>) => {
    const signalData = event.currentTarget.value;
    console.log("보내는거냐", signalData);
    socket.emit("game_call_signal", roomName, signalData);
  };

  const onClickClose = () => {
    // 선택창으로 돌아가기
    socket.emit("game_back_select", roomName);
  };

  // 방장 찾기
  const setHostInfo = () => {
    pochaUsers.forEach((user: any, index: number) => {
      if (user.isHost === true) {
        setIshost(index);
      }
    });
  };
  // 내 번호
  const setPeopleInfo = () => {
    pochaUsers.forEach((user: any, index: number) => {
      if (user.username === myName) {
        setMyNum(index);
      }
    });
  };

  // 양세찬 게임 주제 받아오기
  const getCallSubject = async () => {
    try {
      const {
        data: { data },
      } = await axios({
        url: `https://i8e201.p.ssafy.io/api/pocha/game/ysc`,
      });
      setTitles(data);
      console.log("------------titles----------", data);
    } catch (error) {
      console.log("라이어 게임 주제 axios error", error);
    }
  }

  const titlechoice = () => {
    const nowtitle: string[] = [];
    for (var i = 0; i < 6 ; i++) {
      if (titles){
        var newnum = Math.floor(Math.random()* (titles.length))
        nowtitle.push(titles[newnum]);
      }
    }
    const data = nowtitle;
    socket.emit("game_call_submit", roomName, data);
  }

  

  console.log("----------인트로에서 userlist--------",pochaUsers);
  console.log("----------mynum--------",mynum);
  console.log("----------host--------",isHost);
  
  console.log("----------개빡쳐--------",nowtitles);

  return (
    <>
      {
        <Player />
      }
      {signal === "PLAY" ? (
        <CallTitle
          socket={socket}
          pochaId={pochaId}
          pochaUsers={pochaUsers}
          pochaInfo={pochaInfo}
          nowtitles={nowtitles}
        />
      ) : null}
      {signal === "MANUAL" ? (
        <CallManual socket={socket} pochaId={pochaId} pochaUsers={pochaUsers} />
      ) : null}
      {signal === "RESULT" ? (
        <CallResult socket={socket} pochaId={pochaId} resultData={resultData} />
      ) : null}
      {signal === "INPUT" ? (
        <CallInput
          socket={socket}
          pochaId={pochaId}
          pochaUsers={pochaUsers}
          pochaInfo={pochaInfo}
          nowtitles={nowtitles}
        />
      ) : null}
      {signal === "INTRO" ? (
        <div className={`${styles.layout3} `}>
          <div className={`${styles.box}  ${styles.layout}`}>
            <img
              src={require("src/assets/game_call/탐정.png")}
              className={`${styles.img1}`}
              alt=""
            />
            <div className={`${styles.box2}  ${styles.layout2}`}>
              CALL MY NAME
            </div>
            <div className={`${styles.box3}  ${styles.layout5}`}>
              양세찬 게임
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

export default CallIntro;
