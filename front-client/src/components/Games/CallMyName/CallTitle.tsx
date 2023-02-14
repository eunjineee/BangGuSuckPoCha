import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./CallTitle.module.css";

function CallTitle({
  socket,
  pochaId,
  pochaUsers,
  pochaInfo,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
  pochaInfo: any;
}): React.ReactElement {
  const roomName = pochaId;
  // 내 이름
  const myName = localStorage.getItem("Username");  

  const [titles, setTitles] = useState<any>(null)

  const nowtitle: any[] = [];
  
  const [mynum, setMyNum] = useState<any>(null) // 내번호


  // 양세찬 게임 주제 받아오기
  const getCallSubject = async() => {
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

  // 내가 몇번째인지
  const setPeopleInfo = () => {
    pochaUsers.forEach((user: any, index: number) => {
      if (user.username === myName) {
        setMyNum(index);
      }
    });
  };

  useEffect(()=>{
    getCallSubject();
    setPeopleInfo();
    socket.on("game_call_signal", (signalData : string, data: any) => {
      setTimeout(() => {
          console.log("play" + signalData);
          console.log(data);
        }, 1000);
  })
  },[])
  
  useEffect(()=>{
    titlechoice();
  },[titles])
  
  const titlechoice = () => {
    for (var i = 0; i < pochaInfo.totalCount ; i++) {
      if (titles){
        var newnum = Math.floor(Math.random()* (titles.length))
        nowtitle.push(titles[newnum]);
        console.log("----------newtitle--------",titles[newnum]);
      }
    }
    console.log("----------newtitlesssss--------", nowtitle);
    const SignalData = "TITLE"
    const data = nowtitle;
    socket.emit("game_twenty_submit", roomName, SignalData, data);
  }

  console.log("----------userlist--------",pochaUsers);
  console.log("----------mynum--------",mynum);


  const onClickClose = () => {
    const signalData = "INPUT";
    // 선택창으로 돌아가기
    socket.emit("game_call_signal", roomName, signalData);
  };

  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.box} ${styles.layout}`}>
        <div className={`${styles.box2} ${styles.layout2}`}>CALL MY NAME</div>
        <div className={`${styles.box3} ${styles.layout5}`}>주제</div>        <div className={`${styles.layout4}`} id="title">{nowtitle[mynum]}
        </div>
        <div className={`${styles.layout6}`}>
          <input 
            type="button" 
            onClick={onClickClose} 
            className={`${styles.retry}`} 
            value="NEXT" 
          />
        </div>
      </div>
    </div>
  );
}

export default CallTitle;
