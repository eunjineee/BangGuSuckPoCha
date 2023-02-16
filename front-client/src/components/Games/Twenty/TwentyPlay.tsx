import styles from "./Twenty.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function TwentyPlay({
  socket,
  pochaId,
}: {
  socket: any;
  pochaId: string;
}): React.ReactElement {
  const navigate = useNavigate();

  // 방 이름
  const roomName = pochaId;

  // 메뉴얼 클릭
  const [signal, setSignal] = useState<string>("WHO");
  // 문제 제출자
  const [presenter, setPresenter] = useState<any>(null);
  // 나의 USERNAME
  const myName = localStorage.getItem("Username");

  const [presenterNickname, setPresenterNickname] = useState<any>(null);

  // 주제 리스트
  const subjectList = [
    "가장 좋아하는 영화",
    "해외 여행 가보신 곳 중 가장 기억에 남는 곳",
    "꼭 가보고 싶은 여행지",
    "좋아하는 음식",
    "싫어하는 음식",
    "취미, 관심사",
    "좋아하는 노래, 가수",
    "스트레스 푸는 방법",
    "키워본 동물",
    "직장, 하는 일",
  ];

  // 포차 유저 정보
  const [pochaUsers, setPochaUsers] = useState<any>(null);
  const [subject, setSubject] = useState<any>(null);
  const [answer, setAnswer] = useState<any>(null);
  const [num, setNum] = useState<number>(20);
  const [ox, setOX] = useState<any>(null);

  // 포차 유저 정보 요청
  const getPochaUsers = async () => {
    let accessToken = localStorage.getItem("accessToken");

    axios({
      method: "GET",
      url: `https://i8e201.p.ssafy.io/api/pocha/participant/${pochaId}`,
      headers: {
        accessToken: accessToken,
      },
    }).then((r) => {
      //토큰이상해
      if ("401" === r.data.status) {
        //토큰 재요청
        console.log("토큰 이상함");
        const refreshToken = localStorage.getItem("refreshToken");
        const Username = localStorage.getItem("Username");
        axios({
          method: "get",
          url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
          headers: {
            refreshToken: refreshToken,
          },
        }).then((r) => {
          //재발급 실패
          if ("401" === r.data.status) {
            localStorage.clear();
            toast.error("인증되지 않은 유저입니다");
            navigate("/");
          }
          //재발급 성공
          else {
            console.log("재발급 성공", r.data.accessToken);
            localStorage.setItem("accessToken", r.data.accessToken);
            accessToken = r.data.accessToken;
            //원래 axios 실행
            axios({
              method: "GET",
              url: `https://i8e201.p.ssafy.io/api/pocha/participant/${pochaId}`,
            }).then((r) => {
              console.log("포차유저정보왔냐", r.data.data);
              setPochaUsers(r.data.data);
            });
          }
        });
      }
      //토큰 정상이야
      else {
        //실행 결과값 그대로 실행
        console.log("포차유저정보왔냐", r.data.data);
        setPochaUsers(r.data.data);
      }
    });

    // try {
    // const {data: {data}} = await axios({
    //     method: "GET",
    //     url: `https://i8e201.p.ssafy.io/api/pocha/participant/${pochaId}`
    // })
    // console.log("포차유저정보왔냐",data)
    // setPochaUsers(data);
    // } catch(error) {
    // console.log("스무고개intro", error);
    // }
  };

  useEffect(() => {
    // 포차 유저 정보 가져오기
    getPochaUsers();
    // 스무고개 게임 시그널받기
    socket.on(
      "game_twenty_submit",
      (signalData: string, data: any, data2: any) => {
        console.log("submit" + signalData);
        setSignal(signalData);
        console.log("submit" + data);
        console.log("submit" + data2);
        if (signalData === "WHO") {
          setNum(20);
          setOX(null);
          setAnswer(null);
          setPresenterNickname(null);
          setPresenter(null);
        }

        if (signalData === "SELECTING") {
          setPresenter(data);
          setPresenterNickname(data2);
        }

        if (signalData === "WRITING") {
          setSubject(data);
        }

        if (signalData === "START") {
          setAnswer(data);
        }
      }
    );

    socket.on(
      "game_twenty_play",
      (signalData: string, data: any, number: any) => {
        console.log("play" + signalData);
        setSignal(signalData);
        setOX(data);
        setNum(number);
        console.log(data);
        console.log(number);
      }
    );

    return () => {
      socket.off("game_twenty_play");
      socket.off("game_twenty_submit");
    };
  }, []);

  // 출제자 선택
  function selectPresenter(username: any, nickname: any) {
    const SignalData = "SELECTING";
    console.log("출제자" + nickname);
    const data = username;
    const data2 = nickname;
    socket.emit("game_twenty_submit", roomName, SignalData, data, data2);
  }

  // 주제 선택
  function subjectSelect(data: any) {
    const SignalData = "WRITING";
    socket.emit("game_twenty_submit", roomName, SignalData, data);
  }

  // 정답 제출
  function inputAnswer() {
    const SignalData = "START";
    const data = answer;
    socket.emit("game_twenty_submit", roomName, SignalData, data);
  }

  // o
  function correct() {
    if (num <= 0) {
      const SignalData = "FAIL";
      socket.emit("game_twenty_play", roomName, SignalData);
    } else {
      const number = num - 1;
      const data = "O";
      const SignalData = "START";
      socket.emit("game_twenty_play", roomName, SignalData, data, number);
    }
  }

  // x
  function incorrect() {
    if (num <= 0) {
      const SignalData = "FAIL";
      socket.emit("game_twenty_play", roomName, SignalData);
    } else {
      const number = num - 1;
      const data = "X";
      const SignalData = "START";
      socket.emit("game_twenty_play", roomName, SignalData, data, number);
    }
  }

  // 정답
  function correctanswer() {
    const SignalData = "SUCCESS";
    socket.emit("game_twenty_play", roomName, SignalData);
  }

  // 초기화
  function next() {
    const SignalData = "WHO";
    socket.emit("game_twenty_submit", roomName, SignalData);
    setNum(20);
  }

  function exit() {
    socket.emit("game_back_select", roomName);
  }

  return (
    <>
      <div className={`${styles.setSize}`}>
        <div className={`${styles.title}`}>
          YES OR NO{" "}
          <img
            src={require("./TwentyImg/free-icon-mountain-5318286.png")}
            className={`${styles.image}`}
          />
        </div>

        {signal === "WHO" && pochaUsers ? (
          <>
            <div className={`${styles.detail}`}> 출제자를 선택해 주세요 </div>
            {pochaUsers.map(function (data: any) {
              return (
                <>
                  <div
                    key={data.nickname}
                    className={`${styles.subjects}`}
                    onClick={() =>
                      selectPresenter(data.username, data.nickname)
                    }
                  >
                    <div className={`${styles.hiddenBox}`}>
                      <img
                        src={require("./TwentyImg/yield.png")}
                        className={`${styles.subjectsArrow}`}
                      />
                    </div>
                    <div>{data.nickname}</div>
                  </div>
                </>
              );
            })}
          </>
        ) : null}

        {signal === "SELECTING" ? (
          <>
            <div className={`${styles.detail}`}> 주제를 선택해 주세요 </div>
            <div className={"text-base p-1 text-white"}>
              출제자 : {presenterNickname}
            </div>
            {subjectList.map(function (data) {
              return (
                <>
                  {myName === presenter ? (
                    <>
                      <div
                        key={data}
                        className={`${styles.subjects}`}
                        onClick={() => subjectSelect(data)}
                      >
                        <div className={`${styles.hiddenBox}`}>
                          <img
                            src={require("./TwentyImg/yield.png")}
                            className={`${styles.subjectsArrow}`}
                          />
                        </div>
                        <div>{data}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div key={data} className={`${styles.subjects}`}>
                        <div className={`${styles.hiddenBox}`}>
                          <img
                            src={require("./TwentyImg/yield.png")}
                            className={`${styles.subjectsArrow}`}
                          />
                        </div>
                        <div>{data}</div>
                      </div>
                    </>
                  )}
                </>
              );
            })}
          </>
        ) : null}

        {signal === "WRITING" ? (
          <>
            {myName === presenter ? (
              <>
                <div className={`${styles.detail}`}> 정답을 입력해주세요</div>
                <div className={`${styles.subject}`}>{subject} </div>
                <div>
                  <input
                    id="answer"
                    className={`${styles.answerInput}`}
                    type="text"
                    onChange={(e) => {
                      setAnswer(e.target.value);
                    }}
                  />
                </div>
                <div className="flex justify-center mr-1 ">
                  <div className={`${styles.button}`} onClick={inputAnswer}>
                    START
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={`${styles.detail}`}> 정답을 입력중입니다.</div>
              </>
            )}
          </>
        ) : null}

        {signal === "START" ? (
          <>
            <div className={`${styles.detail}`}>
              질문을 통해 정답을 맞춰보세요!
            </div>
            <div className={`${styles.subject}`}>
              {subject}
              <div
                className={`${styles.countDetail}`}
                style={{ color: "white" }}
              >
                {" "}
                남은 질문 횟수
              </div>
              <div className={"text-8xl p-1 text-white"}>
                {num}
                <span className={"text-5xl"}>회</span>
              </div>
              <div className={`${styles.text}`}>{ox}</div>
            </div>
            {myName === presenter ? (
              <>
                <div className={`${styles.buttons}`}>
                  <div className={`${styles.button}`} onClick={correctanswer}>
                    정답
                  </div>
                  <div className={`${styles.button}`} onClick={correct}>
                    O
                  </div>
                  <div className={`${styles.button}`} onClick={incorrect}>
                    X
                  </div>
                </div>
              </>
            ) : null}
          </>
        ) : null}

        {signal === "SUCCESS" ? (
          <>
            <div className={`${styles.answerSuccess}`}>
              정답입니다!
              <div className={`${styles.answer}`}> {answer} </div>
            </div>
            <div className={`${styles.reset}`}>
              <div className={`${styles.button}`} onClick={next}>
                {" "}
                NEXT{" "}
              </div>
              <div className={`${styles.button}`} onClick={exit}>
                {" "}
                EXIT{" "}
              </div>
            </div>
          </>
        ) : null}

        {signal === "FAIL" ? (
          <>
            <div className={`${styles.answerSuccess}`}>
              아쉬워요!
              <div className={`${styles.answer}`}> {answer}</div>
            </div>
            <div className={`${styles.reset}`}>
              <div className={`${styles.button}`} onClick={next}>
                {" "}
                NEXT{" "}
              </div>
              <div className={`${styles.button}`} onClick={exit}>
                {" "}
                EXIT{" "}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default TwentyPlay;
