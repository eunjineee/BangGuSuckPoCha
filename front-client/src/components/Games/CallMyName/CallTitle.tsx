import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./CallTitle.module.css";

function CallTitle({
  socket,
  pochaId,
  pochaUsers,
  pochaInfo,
  nowtitles,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
  pochaInfo: any;
  nowtitles: any;
}): React.ReactElement {
  const roomName = pochaId;
  // 내 이름
  const myName = localStorage.getItem("Username");  
  
  const [mynum, setMyNum] = useState<any>(null) // 내번호

  console.log("이거 안와??ㄴ",nowtitles);

  // 내가 몇번째인지
  const setPeopleInfo = () => {
    pochaUsers.forEach((user: any, index: number) => {
      if (user.username === myName) {
        setMyNum(index);
      }
    });
  };

  useEffect(()=>{
    setPeopleInfo();
    socket.on("game_call_signal", (signalData : string, data: any) => {
      setTimeout(() => {
        console.log("play" + signalData);
          console.log(data);
        }, 1000);
      })
  },[])
    
  const onClickClose = () => {
    const signalData = "INPUT";
    socket.emit("game_call_signal", roomName, signalData);
  };


  console.log("mynum", mynum);
  console.log("mynum", nowtitles[mynum]?.type);


  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.box} ${styles.layout}`}>
        <div className={`${styles.box2} ${styles.layout2}`}>CALL MY NAME</div>
        <div className={`${styles.box3} ${styles.layout5}`}>주제</div>        
        
        <div className={`${styles.layout4}`} id="title">
          {(nowtitles) ? nowtitles[mynum]?.type : null}
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
