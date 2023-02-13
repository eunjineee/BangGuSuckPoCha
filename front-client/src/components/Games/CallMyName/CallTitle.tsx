import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./CallTitle.module.css";

function CallTitle({
  socket,
  pochaId,
  pochaUsers,
  pochaInfo,
  liarnum,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
  pochaInfo: any;
  liarnum: any;
}): React.ReactElement {
  const roomName = pochaId;
  
  const [titles, setTitles] = useState<any>(null)
  
  const [nowtitle, setNowtitle] = useState<any>(null)
 
  const [mynum, setMyNum] = useState<any>(null) // 내번호

  const myName = localStorage.getItem("Username");    // 내 이름


  const onClickClose = () => {
    const signalData = "ANSWER";
    // 다음 페이지로 이동
    socket.emit("game_call_signal", roomName, signalData);
  };


  // 양세찬 게임 주제 받아오기
  const getLiarSubject = async() => {
    try {
      const {
        data: { data },
      } = await axios({
        url: `https://i8e201.p.ssafy.io/api/pocha/game/ysc`,
      });
      setTitles(data);
    } catch (error) {
      console.log("양세찬 게임 주제 axios error", error);
    }
  }
  
  // 이번 턴 주제
  const maintitle = () => {
    if (titles){
      const titleone = Math.floor(Math.random()*(titles.length-1));
      setNowtitle(titles[titleone]);
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


  useEffect(()=> {
    getLiarSubject(); //라이어 주제 받아오기
    setPeopleInfo();  // 방참가인원 정보
  },[])

  useEffect(()=> {
    maintitle();
  },[titles])

  return (
    <div className={`${styles.layout3}`}>
    <div className={`${styles.box} ${styles.layout}`}>
      <div className={`${styles.box2} ${styles.layout2}`}>CALL MY NAME</div>
      <div className={`${styles.buttons}`} id="bigbox">
        <div className={`${styles.layout4}`} id = "title0">
          <div className={`${styles.text1}`} id = "people0">peopleName[i]</div>
          <div className={`${styles.text2}`} id = "ptitle0">Titles[i]</div>
          <div className={`${styles.text3}`} id = "pass0"></div>
        </div>
        <div className={`${styles.layout4}`} id = "title1">
          <div className={`${styles.text1}`} id = "people1">peopleName[i]</div>
          <div className={`${styles.text2}`} id = "ptitle1">Titles[i]</div>
          <div className={`${styles.text3}`} id = "pass1"></div>
        </div>
        <div className={`${styles.layout4}`} id = "title2">
          <div className={`${styles.text1}`} id = "people2">peopleName[i]</div>
          <div className={`${styles.text2}`} id = "ptitle2">Titles[i]</div>
          <div className={`${styles.text3}`} id = "pass2"></div>
        </div>
        <div className={`${styles.layout4}`} id = "title3">
          <div className={`${styles.text1}`} id = "people3">peopleName[i]</div>
          <div className={`${styles.text2}`} id = "ptitle3">Titles[i]</div>
          <div className={`${styles.text3}`} id = "pass3"></div>
        </div>
        <div className={`${styles.layout4}`} id = "title4">
          <div className={`${styles.text1}`} id = "people4">peopleName[i]</div>
          <div className={`${styles.text2}`} id = "ptitle4">Titles[i]</div>
          <div className={`${styles.text3}`} id = "pass4"></div>
        </div>
        <div className={`${styles.layout4}`} id = "title5">
          <div className={`${styles.text1}`} id = "people5">peopleName[i]</div>
          <div className={`${styles.text2}`} id = "ptitle5">Titles[i]</div>
          <div className={`${styles.text3}`} id = "pass5"></div>
        </div>
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
