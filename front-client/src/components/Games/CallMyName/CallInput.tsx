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
  // pass
  const [peopleScore, setPeopleScore] = useState<number[]>([1, 1, 1, 1, 1, 1]);

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
    if (answer === nowtitle[mynum]){
      socket.emit("game_call_pass", roomName, mynum);
    }
  }

  useEffect(()=> {
    setPeopleInfo();  // 방참가인원 정보
    setMyInfo();
    // 접을때 주고 받는 함수
    socket.on("game_call_pass", (myNum: number) => {
      finish();
      console.log("새로운배열 갱신되고있냐?", peopleScore);
      const newArray = peopleScore.map((score, index) => {
        if (index === myNum) {
          return score - 1;
        }
        return score;
      });
      console.log("새로운배열?", newArray);
      setPeopleScore((prev) => [...newArray]);
    });

    return () => {
      socket.off("game_call_pass");
    };
  }, [peopleScore]);


  //게임 끝인지 확인 
  function finish() {
    const resultList: string[] = [];
    const result: string[] = [];
    console.log("자 여기 결과가기전", peopleScore, resultList.length);
    peopleScore.forEach((score, index) => {
      console.log("s여기@@@@@@@@@@@@", score, index);
      if (score === 0) {
        resultList.push(peopleName[index]);
        console.log("여기오냐?", peopleScore);
      }else{
        result.push(peopleName[index])
      }
    });
    if (result.length === 1) {
      console.log("여기오냐 결과가기전?", peopleScore);
      const signalData = "RESULT";
      const data = result;
      socket.emit("game_call_result", roomName, signalData, data);
    }
  }




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
