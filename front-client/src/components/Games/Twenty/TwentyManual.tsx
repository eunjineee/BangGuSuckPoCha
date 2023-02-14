import styles from "./Twenty.module.css";

function TwentyManual({
    socket,
    pochaId,
  }: {
    socket: any;
    pochaId: string;
}) : React.ReactElement { 
    const onClickClose = () => {
        const signalData = "INTRO";
        // 선택창으로 돌아가기
        socket.emit("game_twenty_signal", pochaId, signalData);
      };
    return(
    <>
        <div className={`${styles.setSize} ${ styles.manual }`}>
            <div className={`${styles.manualButton}`} onClick={onClickClose}>BACK</div>
        </div>
    </>
    )
}

export default TwentyManual;