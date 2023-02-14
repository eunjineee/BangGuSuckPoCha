import axios from "axios";
import { log } from "console";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
// test지워도됨
function Login(): React.ReactElement {
  const navigate = useNavigate();
  // 아래 처럼 하면 되는데.. 중간에 오류저거 못고치겠어서 우선 any
  // const scrollDivRef = useRef<HTMLDivElement>(null);

  // DOM들 접근
  const scrollDivRef = useRef<HTMLDivElement>(null);
  const firstDiv = useRef<HTMLDivElement>(null);
  const secondDiv = useRef<HTMLDivElement>(null);
  const wordFirst = useRef<HTMLDivElement>(null);
  const wordSecond = useRef<HTMLDivElement>(null);
  const wordThird = useRef<HTMLDivElement>(null);
  const wordFourth = useRef<HTMLDivElement>(null);
  const wordFifth = useRef<HTMLDivElement>(null);
  const elements = [wordFourth, wordFifth];

  // 위에서 클릭시
  const onClickFirstScroll = () => {
    secondDiv.current?.scrollIntoView({ behavior: "smooth" });
  }

  // 마우스 윌 이벤트 발생시
  const onWheelScroll = (event: any) => {
    // event.preventDefault();
    const { deltaY } = event;
    // const { scrollTop } = scrollDivRef.current;
    // const pageHeight = window.innerHeight;

    // 마우스 아래와 위일때 조건
    if (deltaY > 0) {
      // console.log("123", deltaY, scrollTop, pageHeight);
      secondDiv.current?.scrollIntoView({ behavior: "smooth" });
      secondDiv.current?.classList.toggle(`delay-300`);
      wordSecond.current?.classList.toggle(`delay-500`);
      wordThird.current?.classList.toggle(`delay-1000`);
      elements.forEach((element) => {
        element.current?.classList.toggle(`delay-[1300ms]`);
      });
    } else if (deltaY < 0) {
      // console.log("456", deltaY, scrollTop, pageHeight);
      firstDiv.current?.scrollIntoView({ behavior: "smooth" });
      wordSecond.current?.classList.toggle(`delay-500`);
      secondDiv.current?.classList.toggle(`delay-300`);
      wordThird.current?.classList.toggle(`delay-1000`);
      elements.forEach((element) => {
        element.current?.classList.toggle(`delay-[1300ms]`);
      });
    }
  };

  // Intersection Observer 세팅
  useEffect(() => {
    const elements = [
      secondDiv,
      wordFirst,
      wordSecond,
      wordThird,
      wordFourth,
      wordFifth,
    ];
    let observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            `${styles.trans}`,
            entry.isIntersecting
          );
        });
      },
      { threshold: 0.5 }
    );

    elements.forEach((element) => {
      observer.observe(element.current!);
    });
  }, []);

  return (
    <div
      ref={scrollDivRef}
      onWheel={onWheelScroll}
      onClick={onClickFirstScroll}
      className={`${styles.bgImg} ${styles.fontHanSans} w-screen h-screen bg-scroll overflow-y-hidden`}
    >
      <div className="bg-black bg-opacity-50 w-full">
        <div
          ref={firstDiv}
          className="text-[10rem] leading-none text-white flex flex-col items-start justify-center ml-28 tracking-wide h-screen"
        >
          <div
            className="transition opacity-0 duration-1000 delay-100 -translate-x-40"
            ref={wordFirst}
          >
            내 방에
          </div>
          <div
            className="transition opacity-0 duration-1000 delay-500 -translate-x-40"
            ref={wordSecond}
          >
            포장마차가
          </div>
          <div
            className="transition opacity-0 duration-1000 delay-1000 -translate-x-40"
            ref={wordThird}
          >
            생겼다?!
          </div>
          <div
            className="transition opacity-0 duration-1000 delay-[1300ms] -translate-x-40 w-[33rem] h-3 bg-white mt-3"
            ref={wordFourth}
          ></div>
          <div
            className="transition opacity-0 duration-1000 delay-[1300ms] -translate-x-40 text-4xl mt-5 font-nanum font-bold tracking-tighter"
            ref={wordFifth}
          >
            Feat : 방 밖은 위험해
          </div>
        </div>
        <div
          ref={secondDiv}
          className="flex flex-col items-center justify-center h-screen opacity-0 transition duration-1000 -translate-x-40"
        >
          <div
            className={`${styles.neonTitle} text-[10rem] leading-none text-white font-light `}
          >
            방구석포차
          </div>
          {/* <img src={require("src/assets/logo/5.png")} alt="logo" /> */}
          <div
            className="w-2/12 mt-10 cursor-pointer"
            // 밑 주석 지우지 말 것
            onClick={() => {
              // eslint-disable-next-line no-restricted-globals
              location.href =
                "https://nid.naver.com/oauth2.0/authorize?client_id=ZQnQO8XghTL7eTyln27j&redirect_uri=https://i8e201.p.ssafy.io/api/user/oauth2/token/naver&response_type=code";
              // axios({
              //   method: "post",
              //   url: "https://nid.naver.com/oauth2.0/authorize?client_id=ZQnQO8XghTL7eTyln27j&redirect_uri=https://i8e201.p.ssafy.io/api/user/oauth2/token/naver&response_type=code",
              // }).then((r) => {
              //   console.log(r);
              // });
            }}
          >
            <img
              src={require("src/assets/loginIcon/naver.png")}
              alt="login-naver"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
