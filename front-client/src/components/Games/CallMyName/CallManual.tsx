import styles from "./CallManual.module.css";

function CallManual({
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
    socket.emit("game_call_signal", roomName, signalData);
  };

  return (
    <div className={`${styles.layout3}`}>
    <img 
      src={require("src/assets/game_call/탐정2.png")}
      className={`${styles.img1}`}
    />
    <div className={`${styles.titlespan} `}>CALL MY NAME</div>
    <div className={`${styles.ladderForm} ${styles.layout}`}>
      <div className={`${styles.box} ${styles.layout2}`}>
        <div className={`${styles.smalltitlespan}`}>게임 방법</div>
        <div>
          <span className={`${styles.text1}`}>
            자신의 정답은 자신 빼고 다른 사람들은<br/> 모두 알고 있어요.<br/>
          <br/>
          자신의 순서가 되면 다른 사람들에게 <br/>질문을 하여 정답을 알아내기!<br/>
          <br/>
          순서가 아닌 사람들은 질문에 대답해주세요!</span>
          <span className={`${styles.text2}`}>단, 거짓말은 하면 안 되고 결정적인 힌트를 주지 않기 <br/>위해 노력해야 합니다.</span>
        </div>
      </div>
      <div className={`${styles.layout3}`}>
        <input type="button" onClick={onClickClose} className={`${styles.retry}`} value="BACK" />
      </div>
    </div>
  </div>
  );
}

export default CallManual;
