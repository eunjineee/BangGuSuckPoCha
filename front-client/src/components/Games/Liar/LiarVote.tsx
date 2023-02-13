import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./LiarVote.module.css";

function LiarVote({
  socket,
  pochaId,
  pochaUsers,
  pochaInfo,
  isliar,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
  pochaInfo: any;
  isliar: boolean;
}): React.ReactElement {
  const roomName = pochaId;

  const [titles, setTitles] = useState<any>(null)
  const [nowtitle, setNowtitle] = useState<any>(null)
  const onClickClose = () => {
    const signalData = "VOTE";
    // 다음 페이지로 이동
    socket.emit("game_liar_signal", roomName, signalData);
  };

  const getLiarSubject = async() => {
    try {
      const {
        data: { data },
      } = await axios({
        url: `https://i8e201.p.ssafy.io/api/pocha/game/liar`,
      });
      console.log(data);
      setTitles(data);
    } catch (error) {
      console.log("라이어 게임 주제 axios error", error);
    }
  }

  const maintitle = () => {
    if (titles){
      const titleone = Math.floor(Math.random()*(titles.length));
      console.log(titles[titleone], titleone)
      setNowtitle(titles[titleone]);
    }
  }
  useEffect(()=> {
    getLiarSubject();
  },[])

  useEffect(()=> {
    maintitle();
  },[titles])
  console.log("#################",pochaInfo)
  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.box} ${styles.layout}`}>
        <div className={`${styles.box2} ${styles.layout2}`}>LIAR GAME</div>
        <div className={`${styles.layout5}`}>
          <div className={`${styles.box3}`}>주제 :</div>
          {nowtitle && <div className={`${styles.box4}`} id="maintitle">{nowtitle.type}</div>}
        </div>
        {nowtitle && <div className={`${styles.layout4}`} id="title">{nowtitle.word}</div>}
        <span className={`${styles.text1}`}>
          두 턴을 돌고 난 후,
          <br/>
          NEXT를 클릭하여 라이어를 투표하십시오.
        </span>
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

export default LiarVote;
