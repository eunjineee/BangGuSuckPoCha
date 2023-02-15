import styles from "./CallResult.module.css";

function CallResult({
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
    socket.emit("game_call_signal", roomName, signalData);
  };
  const onClickClose = () => {
    // 선택창으로 돌아가기
    socket.emit("game_back_select", roomName);
  };
  
  console.log("djkfhadlskjfhdalskhjfkjsdahflkjhsda",resultData)
  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.box} ${styles.layout}`}>
        <img
          src={require("src/assets/game_call/callmyname1.png")}
          className={`${styles.img1}`}
        />
        <div className={`${styles.box2}`}>CALL MY NAME</div>
        <div className={`${styles.box3} text-4xl`}>{resultData? resultData[0]:null}</div>
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

export default CallResult;
