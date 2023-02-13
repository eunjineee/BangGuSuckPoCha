import axios from "axios";
import { useEffect, useRef, useState } from "react";
import './Balance.css'

function Balance({
  socket,
  pochaId,
  pochaUsers,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
}):JSX.Element {
  const usersLength = pochaUsers.length;
  console.log(usersLength);
  
  const imgDiv = useRef<any>()

  const [isStart,setIstStart] = useState(false)
  const [theme,setTheme] = useState<any>(null)
  const [q1Div,setQ1Div] = useState(null)
  const [q2Div,setQ2Div] = useState(null)
  const [subjectDiv, setSubjectDiv] = useState('flex')
  const [qDiv, setQDiv] = useState('hidden')
  const [questionSentence,setQuestionSentence] = useState('Q. 당신의 선택은?')

  const [generalDataList, setGeneralDataList] = useState<any>(null)
  const [romanticDataList, setRomanticDataList] = useState<any>(null)

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


  // 시작
  function start() {
    setIstStart(true)
    setQuestionSentence("Q. 주제를 선택해주세요.")
  }


  // 종료
  function exit() {
    setIstStart(false)
    setSubjectDiv('flex')
    
    setQuestionSentence("Q. 당신의 선택은?")
  }
  
  useEffect(()=> {
    console.log('버튼 값: ',qDiv);

  },[qDiv])
    
  // play
  var audio = new Audio();
  audio.src = "뿅.mp3"

  function play() {
    
    // audio.play();
  }

  // 다음 질문
  function next() {
    console.log(theme);
    if (theme === null) {
      return
    }
    play()
    // 연애
    if (theme === '0') {
      console.log('연애 입니다');
      
      var x = Math.floor(Math.random() * (generalDataList.length -1))
      setQ1Div(generalDataList[x].question1)
      console.log('연애 질문',generalDataList[x].question1);
      
      setQ2Div(generalDataList[x].question2)
    } else if (theme === '1') {
      console.log('일반 입니다');
      // 일반
      var x = Math.floor(Math.random() * (romanticDataList.length -1))
      console.log('일반 질문',romanticDataList[x].question1);
      
      setQ1Div(romanticDataList[x].question1)
      setQ2Div(romanticDataList[x].question2)
    }
  }


  // 주제 선택 - 연애
  function romantic() {
    play()
    // 연애 선택
    setTheme('0')
    setSubjectDiv('hidden')
    setQDiv('flex')
    setQuestionSentence("Q. 당신의 선택은?")
}

  useEffect(() => {
    next();
  }, [theme])

  
  // 주제 선택 - 일반
  function general() {
    play()
    // 일반 선택
    setTheme('1')
    setSubjectDiv('hidden')
    setQDiv('flex')
    setQuestionSentence("Q. 당신의 선택은?")
  }




  function BalanceIntro():JSX.Element {
    return (
      <div ref={imgDiv}  className=" setSize">
        <div className="title">밸런스 게임</div>
        <div className = "question">{questionSentence}</div>
        <div>
            <div className="button" onClick={start}>PLAY</div>
            <div className="button" onClick={exit}>EXIT</div>
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
            <div className={`subject ${subjectDiv} romOrNor`} onClick={romantic}>연애</div>
            <div className={`${qDiv} romOrNor q1 `} onClick={play}>{q1Div}</div>
          </div>
          <div className="select">
            <div className="sub">B</div>
            <div className={`subject ${subjectDiv} romOrNor`} onClick={general}>일반</div>
            <div className={`${qDiv} romOrNor q2 `} onClick={play}>{q2Div}</div>
          </div> 
        </div>
        <div className={`${qDiv} buttons`}>
          <div onClick={()=> {
            setQDiv('hidden')
            exit()
          }}>EXIT</div>
          <div onClick={next}>NEXT</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* start */}
      {
        isStart === false ? <BalanceIntro />: <BalanceStart />
      }
      {/* play */}
    </>
  )
}
export default Balance