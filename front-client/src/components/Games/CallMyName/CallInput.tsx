import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styles from "./CallInput.module.css";

function CallInput({
  socket,
  pochaId,
  pochaUsers,
  nowtitles,
  pochaInfo,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
  nowtitles: any;
  pochaInfo: any;
}): React.ReactElement {
  const roomName = pochaId;
  const { totalCount } = pochaInfo;
  const [mynum, setMyNum] = useState<any>(null) // 내번호

  const myName = localStorage.getItem("Username");    // 내 이름
  // 사람들 네임
  const [peopleName, setPeopleName] = useState<string[]>([]);

  const [answer, setAnswer] = useState<any>(null);
  // pass
  
  const [peopleScore, setPeopleScore] = useState<number[]>([1, 1, 1, 1, 1, 1]);
  const title0 = useRef<any>(null);
  const title1 = useRef<any>(null);
  const title2 = useRef<any>(null);
  const title3 = useRef<any>(null);
  const title4 = useRef<any>(null);
  const title5 = useRef<any>(null);
  const title6 = useRef<any>(null);
  const title7 = useRef<any>(null);
  const [txtSpanList, setTxtSpanList] = useState<any[]>([
    title0,
    title1,
    title2,
    title3,
    title4,
    title5,
    title6,
    title7,
  ]);
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

    console.log("----------------정답지------", nowtitles);
    console.log("----------------제출한 답------", answer);
    console.log("----------------정답------", nowtitles[mynum]?.word);
    if (answer === nowtitles[mynum]?.word){
      console.log("------------정답이다!!!!!!!!!!!!!!----------");
      txtSpanList[mynum].current.classList.add("flex");
      txtSpanList[6].current.classList.add("hidden");
      txtSpanList[7].current.classList.remove("hidden");
      socket.emit("game_call_pass", roomName, mynum);
    }
    console.log("------------틀렸어----------");
  }
  useEffect(()=> {
    setPeopleInfo();  // 방참가인원 정보
  },[])
  
  useEffect(()=> {
    gamestart();
  },[mynum])

  useEffect(()=> {
    finish();
  },[peopleScore])

  useEffect(()=> {
    setMyInfo();
    // 접을때 주고 받는 함수
    socket.on("game_call_pass", (myNum: number) => {
      finish();
      console.log("새로운배열 갱신되고있냐? 지금배열은", peopleScore);
      const newArray = peopleScore.map((score, index) => {
        if ((index === myNum)&&(score === 1)) {
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
    console.log("게임 끝인지 확인중입니다", peopleScore, resultList.length);
    peopleScore.forEach((score, index) => {
      console.log("s여기@@@@@@@@@@@@", score, index);
      if (score === 0) {
        resultList.push(peopleName[index]);
        console.log("정답자", resultList);
      }else{
        result.push(peopleName[index])
      }
    });

    if (resultList.length === totalCount-1) {
      console.log("여기오냐 결과가기전 꼴찌", result);
      console.log("여기오냐 결과가기전 정답자들", resultList);
      const signalData = "RESULT";
      const data = result;
      socket.emit("game_call_result", roomName, signalData, data);
    }
  }

  //박스만들기(인원수 넘어가는 박스은 가리기)
  function gamestart() {
    console.log("totalCount----------------",totalCount)
    for (var i = 0; i < 6; i++) {
      if (i >= totalCount) {
        console.log("전체 멤버 넘어가면 가려",i, totalCount);
        txtSpanList[i].current.classList.add("hidden");
      }
      if(i === mynum){
        console.log("이건 나라서 가림",mynum)
        txtSpanList[i].current.classList.add("hidden");
      }
    }
  }


  return (
  <div className={`${styles.layout3}`}>
    <div className={`${styles.box} ${styles.layout}`}>
      <div className={`${styles.box2} ${styles.layout2}`}>CALL MY NAME</div>
      <div className={`${styles.buttons}`} id="bigbox">
        <div className={`${styles.layout4} flex`} id = "title0" ref={title0}>
          <div className={`${styles.text1}`} id = "people0">{peopleName[0]}</div>
          <div className={`${styles.text2}`} id = "ptitle0">{nowtitles[0]?.word}</div>
          <div className={`${styles.text3}`} id = "pass0">{peopleScore[0]? null : "통과"}</div>
        </div>
        <div className={`${styles.layout4} flex`} id = "title1" ref={title1}>
          <div className={`${styles.text1}`} id = "people1">{peopleName[1]}</div>
          <div className={`${styles.text2}`} id = "ptitle1">{nowtitles[1]?.word}</div>
          <div className={`${styles.text3}`} id = "pass1">{peopleScore[1]? null : "통과"}</div>
        </div>
        <div className={`${styles.layout4} flex`} id = "title2" ref={title2}>
          <div className={`${styles.text1}`} id = "people2">{peopleName[2]}</div>
          <div className={`${styles.text2}`} id = "ptitle2">{nowtitles[2]?.word}</div>
          <div className={`${styles.text3}`} id = "pass2">{peopleScore[2]? null : "통과"}</div>
        </div>
        <div className={`${styles.layout4} flex`} id = "title3" ref={title3}>
          <div className={`${styles.text1}`} id = "people3">{peopleName[3]}</div>
          <div className={`${styles.text2}`} id = "ptitle3">{nowtitles[3]?.word}</div>
          <div className={`${styles.text3}`} id = "pass3">{peopleScore[3]? null : "통과"}</div>
        </div>
        <div className={`${styles.layout4} flex`} id = "title4" ref={title4}>
          <div className={`${styles.text1}`} id = "people4">{peopleName[4]}</div>
          <div className={`${styles.text2}`} id = "ptitle4">{nowtitles[4]?.word}</div>
          <div className={`${styles.text3}`} id = "pass4">{peopleScore[4]? null : "통과"}</div>
        </div>
        <div className={`${styles.layout4} flex`} id = "title5" ref={title5}>
          <div className={`${styles.text1}`} id = "people5">{peopleName[5]}</div>
          <div className={`${styles.text2}`} id = "ptitle5">{nowtitles[5]?.word}</div>
          <div className={`${styles.text3}`} id = "pass5">{peopleScore[5]? null : "통과"}</div>
        </div>
      </div>
      <div className="flex items-center" ref={title6}>
        <div className={`${styles.layout6}`}>
          <input 
            id="answer" 
            className={`${styles.answerInput}`} 
            type="text" 
            onChange={(e) => {setAnswer(e.target.value)}}
          />
          <input 
            type="button" 
            onClick={inputAnswer} 
            className={`${styles.retry}`} 
            value="제출" 
          />
        </div>
      </div>
      <div className="hidden" ref={title7}>
          <div className={`${styles.layout6} ${styles.box22}`} >
        정답
        </div>
      </div>
    </div>
  </div>
  );
}

export default CallInput;
