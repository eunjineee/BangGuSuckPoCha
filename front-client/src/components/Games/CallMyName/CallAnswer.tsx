import styles from "./CallAnswer.module.css";

function CallAnswer({
  socket,
  pochaId,
  pochaUsers,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
}): React.ReactElement {
  const roomName = pochaId;

  const onClickClose = () => {
    const signalData = "INTRO";
    // 선택창으로 돌아가기
    socket.emit("game_liar_signal", roomName, signalData);
  };
  
  const onClickRetry = () => {
    const signalData = "INTRO";
    // 선택창으로 돌아가기
    socket.emit("game_liar_signal", roomName, signalData);
  };

  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.box} ${styles.layout}`}>
        <img
          src={require("src/assets/game_liar/CatchImg.png")}
          className={`${styles.img1}`}
          alt="liarcatch"
        />
        <div className={`${styles.box2} ${styles.layout2}`} id="liar"></div>
        <div className={`${styles.layout4}`}>
          <input type="button" onClick={onClickClose} className={`${styles.retry}`} value="EXIT" />
          <input type="button" onClick={onClickRetry} className={`${styles.retry}`} value="RETRY" />     
        </div>
      </div>
    </div>
  );
}

export default CallAnswer;
