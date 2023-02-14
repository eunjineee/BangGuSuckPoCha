import styles from "./LiarLose.module.css";

function LiarLose({
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
    // 선택창으로 돌아가기
    socket.emit("game_back_select", roomName);
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
          src={require("src/assets/game_liar/Lose.png")}
          className={`${styles.img1}`}
          alt="liarcatch"
        />
        <div className={`${styles.layout2}`}>
        <div className={`${styles.text2}`} id="liar"></div>
        <span className={`${styles.text1}`}>
          은(는) 라이어가 아니었습니다.<br/>
        </span>
      </div>
        <div className={`${styles.layout4}`}>
          <input type="button" onClick={onClickClose} className={`${styles.retry}`} value="EXIT" />
          <input type="button" onClick={onClickRetry} className={`${styles.retry}`} value="RETRY" />     
        </div>
      </div>
    </div>
  );
}

export default LiarLose;
