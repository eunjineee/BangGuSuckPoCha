import styles from "./Roulette.module.css";
import { useState, useRef, useEffect } from "react";
import PublicModal from "src/components/Common/PublicModal";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { showRouletteResultModal } from "src/store/store";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
function Roulette({
  socket,
  pochaId,
  pochaUsers,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
}): React.ReactElement {
  const dispatch = useAppDispatch();
  // Public모달 데이터
  const [modalData, setModalData] = useState<any>(null);
  // 방 이름
  const roomName = pochaId;

  const product = [
    " 벌칙주 2잔",
    " 벌칙주 1잔",
    "벌칙자 빼고 다 마시기",
    " 벌칙주 2잔",
    " 벌칙주 1잔",
    " 말할때마다 자기이름 붙이기",
    " 벌칙주 2잔",
    " 벌칙주 1잔",
    "5분동안 3글자로 말하기",
  ];

  const colors = ["#FFA0A0", "#D9EDFF", "#FFFFFF	"];
  const canvasSketch = useRef<any>(null);
  const [ctx, setCtx] = useState<any>(null);

  const [isRoulette, setIsRoulette] = useState<boolean>(true);

  // 룰렛에서 Public 모달 보이기 관련
  const showModal = useAppSelector((state) => {
    return state.rouletteResultModal;
  });

  // 캔버스 값이 들어오면 ctx 값 세팅
  useEffect(() => {
    console.log("이거있냐?", canvasSketch);
    setCtx(canvasSketch.current!.getContext(`2d`));

    socket.on("game_roulette", async (random: number) => {
      console.log("룰렛 돌아가냐!!!@!@여기는 룰렛??", random);
      setIsRoulette(false);
      rotate(random);
    });
    return () => {
      socket.off("game_roulette");
    };
  }, []);

  // 효과음
  const player = useRef<any>();
  const Player = () => (
    <AudioPlayer
      ref={player}
      autoPlay={true}
      // preload='auto'
      // loop
      src="/balanceGame/BBong.mp3"
      onPlay={(e) => console.log("onPlay")}
      style={{ display: "none" }}
      volume={0.5}
      // other props here
    />
  );

  const newMake = () => {
    const [cw, ch] = [
      canvasSketch.current!.width / 2,
      canvasSketch.current!.height / 2,
    ];
    const arc = Math.PI / (product.length / 2);

    for (let i = 0; i < product.length; i++) {
      ctx!.beginPath();
      ctx!.fillStyle = colors[(i + 1) % 3];
      ctx!.strokeStyle = "white";
      ctx!.lineWidth = 5;
      ctx!.moveTo(cw, ch);
      ctx!.arc(cw, ch, cw, arc * (i - 1), arc * i);
      ctx!.fill();
      //ctx!.stroke();
      ctx!.closePath();
    }

    ctx!.fillStyle = "#000000";
    ctx!.font = "20px BMJUA";
    ctx!.textAlign = "center";

    for (let i = 0; i < product.length; i++) {
      const angle = arc * i + arc / 2;

      ctx!.save();

      ctx!.translate(
        cw + Math.cos(angle) * (cw - 50),
        ch + Math.sin(angle) * (ch - 50)
      );

      ctx!.rotate(angle + Math.PI / 2);

      product[i].split(" ").forEach((text, j) => {
        ctx!.fillText(text, 0, 30 * j);
      });

      ctx!.restore();
    }
  };

  // ctx값이 들어오면 함수실행
  if (ctx) {
    newMake();
  }

  const rotate = (random: number) => {
    dispatch(showRouletteResultModal(false));
    canvasSketch.current!.style.transform = `initial`;
    canvasSketch.current!.style.transition = `initial`;

    const arc = 360 / product.length;
    const rotate = random * arc + 3600 + arc * 3 - arc / 4;

    canvasSketch.current!.style.transform = `rotate(-${rotate}deg)`;
    canvasSketch.current!.style.transition = `2s`;

    // 모달에 전달할 데이터
    setModalData({
      type: "roulette",
      msg: product[random],
      pochaId: pochaId,
    });
    setTimeout(() => {
      // 모달 켜는 dispatch
      dispatch(showRouletteResultModal(true));
      canvasSketch.current!.style.transform = `initial`;
      canvasSketch.current!.style.transition = `initial`;
      setIsRoulette(true);
    }, 2500);
  };

  const startRoulette = () => {
    console.log("서버로 룰렛가냐?");
    const random = Math.floor(Math.random() * product.length);
    const roomName = pochaId;
    console.log("랜덤값", random);
    socket.emit("game_roulette", roomName, random);
  };

  const onClickClose = () => {
    // 선택창으로 돌아가기
    socket.emit("game_back_select", roomName);
  };

  return (
    <>
      {
        <Player />
      }
      {showModal && <PublicModal data={modalData} socket={socket} />}
      <div className={`${styles.setSize} w-full h-full`}>
        <div className={`${styles.title}`}>
          <img
            src={require("src/assets/game_roulette/trident.png")}
            className={`${styles.image}`}
            alt="trident"
          />
          벌칙 룰렛
          <img
            src={require("src/assets/game_roulette/free-icon-devil-725040.png")}
            className={`${styles.image}`}
            alt="devil"
          />
        </div>
        <div className={`${styles.detail}`}>
          랜덤으로 등장하는 벌칙 룰렛!
          <br /> 다양한 벌칙으로 게임을 더욱 즐겁게 즐기세요.{" "}
        </div>
        <div className={`${styles.circle}`}>
          <div className={`${styles.arrow}`}>
            <img
              src={require("src/assets/game_roulette/free-icon-right-arrow-724847.png")}
              className={`${styles.arrowImg}`}
              alt="arrow"
            />
          </div>
          <canvas ref={canvasSketch} width="480" height="480"></canvas>
          <div className={`${styles.buttons}`}>
            {isRoulette && <button onClick={startRoulette} className={`${styles.play}`}>
              룰렛 돌리기
            </button>}
            <button onClick={onClickClose} className={`${styles.play}`}>
              EXIT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Roulette;
