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

  const [titles, setTitles] = useState<any>(null)

  const [nowtitle, setNowtitle] = useState<any>(null);

  // 양세찬 게임 주제 받아오기
  const getCallSubject = async() => {
    try {
      const {
        data: { data },
      } = await axios({
        url: `https://i8e201.p.ssafy.io/api/pocha/game/ysc`,
      });
      setTitles(data);
    } catch (error) {
      console.log("라이어 게임 주제 axios error", error);
    }
  }

  const titlechoice = () => {
    for (var i = 0; i < pochaInfo.totalCount ; i++) {
      var newnum = titles.splice(Math.floor(Math.random() * titles.length),1)[0]
      setNowtitle(newnum)
      console.log(nowtitle);
    }
  }

  useEffect(()=>{
    getCallSubject();
  },[])

  useEffect(()=>{
    titlechoice();
  },[titles])


  const onClickClose = () => {
    const signalData = "INPUT";
    // 선택창으로 돌아가기
    socket.emit("game_call_signal", roomName, signalData);
  };

  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.box} ${styles.layout}`}>
        <div className={`${styles.box2} ${styles.layout2}`}>CALL MY NAME</div>
        <div className={`${styles.box3} ${styles.layout5}`}>주제</div>
        <div className={`${styles.layout4}`} id="title">
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
