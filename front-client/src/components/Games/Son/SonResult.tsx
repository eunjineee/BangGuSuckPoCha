import styles from "./SonResult.module.css";

function SonResult({
  socket,
  pochaId,
  resultData,
}: {
  socket: any;
  pochaId: string;
  resultData?: any;
}): React.ReactElement {
  const roomName = pochaId;

  const onClickIntro = () => {
    const signalData = "INTRO";
    // 선택창으로 돌아가기
    socket.emit("game_son_signal", roomName, signalData);
  };
  const onClickClose = () => {
    // 선택창으로 돌아가기
    socket.emit("game_back_select", roomName);
  };

  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.box} ${styles.layout}`}>
        <img
          src={require("src/assets/game_son/fingers0.png")}
          className={`${styles.img1}`}
        />
        <div className={`${styles.box2}`}>손병호 게임</div>
        <div className={`${styles.box3} text-4xl`}>{resultData.map((data: any) => {
          return <span>{`${data} `}</span>
        })}</div>
        <div className={`${styles.box4}`}>마셔라! 마셔라!</div>

        <div className={`${styles.layout5}`}>
          <input
            onClick={onClickIntro}
            type="button"
            className={`${styles.retry}`}
            value="RETRY"
          />
          <input
            type="button"
            className={`${styles.retry}`}
            onClick={onClickClose}
            value="EXIT"
          />
        </div>
      </div>
    </div>
  );
}

export default SonResult;
