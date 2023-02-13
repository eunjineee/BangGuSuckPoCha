import styles from "./LiarMenual.module.css";

function LiarMenual({
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

  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.titlespan}`}>LIAR GAME</div>
      <div className={`${styles.ladderForm} ${styles.layout}`}>
        <div className={`${styles.box} ${styles.layout2}`}>
          <div className={`${styles.smalltitlespan}`}>게임 방법</div>
          <div>
            <span className={`${styles.text1}`}>
              모든 사람이 제시어를 확인한 후,
              <br />
              한 명씩 제시어에 대해 설명합니다
              <br />
              <br />
              일반 사람들은 라이어에게 제시어가 들키지 않게,
              <br />
              라이어는 정체가 들키지 않게 거짓말로 설명합니다.
              <br />
              <br />
              두 번씩 설명 한 뒤, 제한 시간 이내에
              <br />
              라이어가 누구인지 투표한다.
              <br />
              <br />
              라이어 아닌 사람이 라이어로 뽑히거나,
              <br />
              라이어가 마지막 찬스에서 제시어를 맞히면 라이어의 승리!
            </span>
          </div>
        </div>
        <div className={`${styles.layout4}`}>
          <input type="button" onClick={onClickClose} className={`${styles.retry}`} value="BACK" />
        </div>
      </div>
    </div>
  );
}

export default LiarMenual;
