import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./CallInput.module.css";

function CallInput({
  socket,
  pochaId,
  pochaUsers,
  nowtitle,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
  nowtitle: any;
}): React.ReactElement {
  const roomName = pochaId;
  
  const [mynum, setMyNum] = useState<any>(null) // 내번호

  const myName = localStorage.getItem("Username");    // 내 이름
  // 사람들 네임
  const [peopleName, setPeopleName] = useState<string[]>([]);

  const [answer, setAnswer] = useState<any>(null);

  const onClickClose = () => {
    const signalData = "RESULT";
    // 다음 페이지로 이동
    socket.emit("game_call_signal", roomName, signalData);
  };


  const setPeopleInfo = () => {
    console.log(pochaUsers, "유저들 리스트");
    pochaUsers.forEach((user: any, index: number) => {
      setPeopleName((prev) => [...prev, user.nickname]);
      if (user.username === myName) {
        setMyNum(index);
      }
    });
  };

  // 내가 몇번째인지
  const setMyInfo = () => {
    pochaUsers.forEach((user: any, index: number) => {
      if (user.username === myName) {
        setMyNum(index);
      }
    });
  };

  // 정답 제출
  function inputAnswer(){
    if (answer === titles[mynum]){
      // 통과()
    }
  }

  // function 통과(){
  //   소켓에 신호주기 (소켓에서 신호 5개 받으면끝)
  // }

  useEffect(()=> {
    getLiarSubject(); //라이어 주제 받아오기
    setPeopleInfo();  // 방참가인원 정보
    setMyInfo();
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
          <div className={`${styles.text1}`} id = "people0">{peopleName[0]}</div>
          <div className={`${styles.text2}`} id = "ptitle0">Titles[i]</div>
          <div className={`${styles.text3}`} id = "pass0"></div>
        </div>
        <div className={`${styles.layout4}`} id = "title1">
          <div className={`${styles.text1}`} id = "people1">{peopleName[1]}</div>
          <div className={`${styles.text2}`} id = "ptitle1">Titles[i]</div>
          <div className={`${styles.text3}`} id = "pass1"></div>
        </div>
        <div className={`${styles.layout4}`} id = "title2">
          <div className={`${styles.text1}`} id = "people2">{peopleName[2]}</div>
          <div className={`${styles.text2}`} id = "ptitle2">Titles[i]</div>
          <div className={`${styles.text3}`} id = "pass2"></div>
        </div>
        <div className={`${styles.layout4}`} id = "title3">
          <div className={`${styles.text1}`} id = "people3">{peopleName[3]}</div>
          <div className={`${styles.text2}`} id = "ptitle3">Titles[i]</div>
          <div className={`${styles.text3}`} id = "pass3"></div>
        </div>
        <div className={`${styles.layout4}`} id = "title4">
          <div className={`${styles.text1}`} id = "people4">{peopleName[4]}</div>
          <div className={`${styles.text2}`} id = "ptitle4">Titles[i]</div>
          <div className={`${styles.text3}`} id = "pass4"></div>
        </div>
        <div className={`${styles.layout4}`} id = "title5">
          <div className={`${styles.text1}`} id = "people5">{peopleName[5]}</div>
          <div className={`${styles.text2}`} id = "ptitle5">Titles[i]</div>
          <div className={`${styles.text3}`} id = "pass5"></div>
        </div>
      </div>
      <div className={`${styles.layout6}`}>
        <input 
          id="answer" 
          className={`${styles.answerInput}`} 
          type="text" 
          onChange={(e) => {setAnswer(e.target.value)}}
        />
          <div className="flex justify-center mr-1 ">
            <div className={`${styles.button}`} onClick={inputAnswer}>START</div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default CallInput;
