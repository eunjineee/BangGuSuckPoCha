import axios from "axios";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useAppSelector } from "src/store/hooks";
import './Balance.css'
// import styles from "./GameSelect.module.css";
function Balance({
  socket,
  pochaId,
  pochaUsers,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
}):JSX.Element {
  console.log('포차이름: ',pochaId);
  
  console.log('포차유저 정보: ',pochaUsers);


  const imgDiv = useRef<any>()
   // 플레이어 자동재생 막기
  const player = useRef<any>();
  const romantic = useRef<any>();
  const normal = useRef<any>();
  const q1 = useRef<any>();
  const q2 = useRef<any>();
  const playBtn = useRef<any>();
  const exitBtn1 = useRef<any>();
  const exitBtn2 = useRef<any>();
  const nextBtn = useRef<any>();


  // const [isStart,setIstStart] = useState(false)
  // 밸런슨가?
  const isBalance = useAppSelector((state) => {return state.isBalance})
  // 테마 선택
  const isRomanNormal = useAppSelector((state) => {return state.isRomanNormal})
  // 밸런스 질문
  const balanceQuestion = useAppSelector((state:any) => {return state.balanceQuestion})

  const [subjectDiv, setSubjectDiv] = useState('flex')
  const [qDiv, setQDiv] = useState('hidden')
  const [questionSentence,setQuestionSentence] = useState("Q. 주제를 선택해주세요.")

  const [generalDataList, setGeneralDataList] = useState<any>(null)
  const [romanticDataList, setRomanticDataList] = useState<any>(null)
  const [imgLists, setImgLists] = useState<any[]>([
    romantic,
    normal,
    q1,
    q2,
    playBtn,
    exitBtn1,
    exitBtn2,
    nextBtn
  ]);

  console.log('포차유저: ', pochaUsers );
  

  // 방 이름
  const roomName = pochaId;

  const Player = () => (
    <AudioPlayer
      ref={player}
      autoPlay={true}
      // preload='auto'
      // loop
      src="/balanceGame/BBong.mp3"
      onPlay={e => console.log("onPlay") }
      style={{display:'none'}}
      volume={0.5}
      // other props here
    />
  );

  useEffect(()=> {
    player.current.audio.current.pause();
  },[])

  useEffect(()=> {
    // Normal 
    axios({
      method: 'get',
      url: 'https://i8e201.p.ssafy.io/api/pocha/game/balance/0',
    })
    .then((r)=> {
      setGeneralDataList(r.data.data)
    })

    // Romantic
    axios({
      method: 'get',
      url: 'https://i8e201.p.ssafy.io/api/pocha/game/balance/1',
    })
    .then((r)=> {
      setRomanticDataList(r.data.data)
    })
  },[])


  function play() {
    Player()
  }

  const next = () => {
    if (isRomanNormal === '연애') {
      console.log('실행되나?');
      
      var x = Math.floor(Math.random() * (romanticDataList.length -1))
      socket.emit("game_balance_subjectChange", roomName, romanticDataList[x]);
      // dispatch(balanceQuestionChange(romanticDataList[x]))
      
    } else if (isRomanNormal === '일반') {
      var x = Math.floor(Math.random() * (generalDataList.length -1))
      socket.emit("game_balance_subjectChange", roomName, generalDataList[x]);
      // dispatch(balanceQuestionChange(generalDataList[x]))
    }
  }
  

  // 선택창으로 돌아가기
  const onClickClose = () => {
    socket.emit("game_back_select", roomName);
  };

  // 인트로 밸런스
  const introBalance = () => {    
    const roomName = pochaId;
    const isTrueFalse = !isBalance
    socket.emit("game_balance_Intro", roomName, isTrueFalse);
  }

  const typeChange = (e:any) => {
    const roomName = pochaId;
    const choiceType = e
    socket.emit("game_balance_typeChange", roomName, choiceType);
  }

  useEffect(()=> {
    if (isRomanNormal !== null) {
      setSubjectDiv('hidden')
      setQDiv('flex')
      setQuestionSentence("Q. 당신의 선택은?")
      if (isRomanNormal === '연애') {
        console.log('실행되나?');
        
        var x = Math.floor(Math.random() * (romanticDataList.length -1))
        socket.emit("game_balance_subjectChange", roomName, romanticDataList[x]);
        // dispatch(balanceQuestionChange(romanticDataList[x]))
        
      } else if (isRomanNormal === '일반') {
        var x = Math.floor(Math.random() * (generalDataList.length -1))
        socket.emit("game_balance_subjectChange", roomName, generalDataList[x]);
        // dispatch(balanceQuestionChange(generalDataList[x]))
      }
    } else {
      setSubjectDiv('flex')
      setQDiv('hidden')
      setQuestionSentence("Q. 주제를 선택해주세요.")
      
      
      
    }
  },[isRomanNormal])

  

  const goWebRTC = (event: React.MouseEvent<HTMLImageElement>) => {
    const elementId = event.currentTarget.id;
    console.log('elementId: ', elementId);
    
    socket.emit("game_btn_hover", roomName, elementId);
  };
    
  useEffect(() => {
    setImgLists([romantic, normal, q1, q2, playBtn, exitBtn1, exitBtn2, nextBtn]);

    // 게임 버튼 호버할때
    socket.on("game_btn_hover", (elementId: string) => {
      hoverBtn(elementId);
    });
    return () => {
      socket.off("game_btn_hover");
    };
  }, []);

  // 버튼 호버시 이펙트
  const hoverBtn = (elementId: string) => {
    imgLists.forEach((img) => {
      console.log('181줄: ', img.current!.id);
      console.log('182줄: ', elementId);
      
      if (img.current!.id === elementId) {
        img.current!.classList.toggle(`gameBox`);
      }
    });
  };

  function BalanceIntro():JSX.Element {
    return (
      <div ref={imgDiv}  className=" setSize">
        <div className="title">밸런스 게임</div>
        <div className = "question">"Q. 당신의 선택은?"</div>
        <div>
            <div className="button" 
              ref={playBtn}
              id="playBtn"
              onMouseOver={goWebRTC}
              onMouseLeave={goWebRTC}
              onClick={()=> {
              // start()
              introBalance()
            }}>PLAY</div>
            <div className="button" 
              ref={exitBtn1}
              id="exitBtn1"
              onMouseOver={goWebRTC}
              onMouseLeave={goWebRTC}
              onClick={()=> {
              onClickClose()
              setTimeout(() => {
                introBalance()
              }, 1000);
            }}>EXIT</div>
        </div>
        <div className="imgDiv">
          <img src = "/balanceGame/bunny.png" className="h-[5rem] bunnyImg" alt=""/>
        </div>
      </div>
    )
  }

  function BalanceStart():JSX.Element {
    return (
      <div className="setSize">
        <div className="title">밸런스 게임</div>
        <div className="question">{questionSentence}</div>
        <div className="subjects">
          <div className="select selectA">
            <div className="sub">A</div>
            <div className={`${subjectDiv} subject romOrNor`}
              ref={romantic}
              id="연애"
              onMouseOver={goWebRTC}
              onMouseLeave={goWebRTC}
              onClick={(e:any) => {typeChange(e.target.innerText)}}>연애
            </div>
            <div className={`${qDiv} romOrNor q1 `} 
              ref={q1}
              id="q1"
              onMouseOver={goWebRTC}
              onMouseLeave={goWebRTC}
              onClick={play}>{balanceQuestion.question1}
            </div>
          </div>
          <div className="select">
            <div className="sub">B</div>
            <div className={`${subjectDiv} subject romOrNor`}
              ref={normal}
              id="일반"
              onMouseOver={goWebRTC}
              onMouseLeave={goWebRTC}
              onClick={(e:any) => {typeChange(e.target.innerText)}}>일반
            </div>
            <div className={`${qDiv} romOrNor q2 `} 
              ref={q2}
              id="q2"
              onMouseOver={goWebRTC}
              onMouseLeave={goWebRTC}
              onClick={play}>{balanceQuestion.question2}
            </div>
          </div> 
        </div>
        <div className={`${qDiv} buttons`}>
          <div 
            // ref={exitBtn2}
            // id="exitBtn2"
            // onMouseOver={goWebRTC}
            // onMouseLeave={goWebRTC}
            onClick={(e:any)=> {
              onClickClose()
              setTimeout(() => {
                typeChange(e.target.innerText)
                introBalance()
              }, 1000);
            }}>EXIT</div>
          <div 
            // ref={nextBtn}
            // id="nextBtn"
            // onMouseOver={goWebRTC}
            // onMouseLeave={goWebRTC}
            onClick={next}>NEXT</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {
        <Player /> 
      }
      {/* start */}
      {
        isBalance === false ? <BalanceIntro />: <BalanceStart />
      }
      {/* play */}
    </>
  )
}
export default Balance