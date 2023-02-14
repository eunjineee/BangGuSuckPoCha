import styles from "./CallTitle.module.css";

function CallTitle({
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
    const signalData = "INPUT";
    // 선택창으로 돌아가기
    socket.emit("game_call_signal", roomName, signalData);
  };
  
  const onClickRetry = () => {
    const signalData = "INTRO";
    // 선택창으로 돌아가기
    socket.emit("game_call_signal", roomName, signalData);
  };

  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.box} ${styles.layout}`}>
        <div className={`${styles.box2} ${styles.layout2}`}>CALL MY NAME</div>
        <div className={`${styles.box3} ${styles.layout5}`}>주제</div>
        <div className={`${styles.layout4}`} id="title">
        </div>
        <div className={`${styles.layout6}`}>
          <input 
            type="button" 
            onClick={onClickClose} 
            className={`${styles.retry}`} 
            value="NEXT" 
          />
        </div>
      </div>
    </div>
  );
}

export default CallTitle;
