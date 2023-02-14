import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./LiarVote.module.css";

function LiarVote({
  socket,
  pochaId,
  pochaUsers,
  pochaInfo,
  liarnum,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
  pochaInfo: any;
  liarnum: any;
}): React.ReactElement {
  const roomName = pochaId;
  const {totalCount} = pochaInfo;
  const [titles, setTitles] = useState<any>(null)
  const [nowtitle, setNowtitle] = useState<any>(null)

  const onClickClose = () => {
    const signalData = "INTRO";
    // 다음 페이지로 이동
    socket.emit("game_liar_signal", roomName, signalData);
  };

  // //토글 보여주기
  // function onClickdropdown() {
  //   var v = document.querySelector('.dropdown_content');
  //   v.classList.toggle('show');
  // }

  // //토글 선택했을 때
  // function selectP :any = (value:an) => {
  //   console.log(value);
  //   var dropbtn_content = document.querySelector('.dropbtn_content');
  //   var dropbtn_click = document.querySelector('.dropbtn_click');
  //   var dropbtn = document.querySelector('.dropbtn');

  //   dropbtn_content.innerText = value;
  //   dropbtn_content.style.color = '#252525';
  //   dropbtn.style.borderColor = '#3992a8';
  // }

  // function onClickVoteLiar = () => {
  //   const signalData = "vote liar";
  //   const data = voteliar;
  //   socket.emit("game_son_signal", roomName, signalData, data);
  // }

  return (
    <div></div>
    // <div className={`${styles.layout3}`}>
    //   <div className={`${styles.box} ${styles.layout}`}>
    //     <div className={`${styles.box2} ${styles.layout2}`}>LIAR GAME</div>
    //     <div className={`${styles.layout5}`}>
    //       <div className={`${styles.box3}`}>라이어를 투표해주세요.</div>
    //     </div>
    //     <div className={`${styles.box4}`}>
    //       <div className={`${styles.text1} ${styles.showTime}`}></div>
    //       <div className={`${styles.text1}`} id="title">초</div>
    //     </div>
    //     <div className={`${styles.layout6}`}>
    //       <div className={`${styles.dropdown}`}>
    //         <button className={`${styles.dropbtn}`}>
    //           <span className={`${styles.dropbtn_content}`}>라이어는...?</span>
    //           <span className={`${styles.dropbtn_click} ${styles.dropbtn_click_style}`}
    //             onClick={onClickdropdown}>arrow_drop_down</span>
    //         </button>
    //         <div className={`${styles.dropdown_content}`}>
    //           <div onClick={selectP(this.innerText)}>{pochaUsers[0]}</div>
    //           <div onClick={selectP(this.innerText)}>{pochaUsers[1]}</div>
    //           <div onClick={selectP(this.innerText)}>{pochaUsers[2]}</div>
    //           <div onClick={selectP(this.innerText)}>{pochaUsers[3]}</div>
    //           <div onClick={selectP(this.innerText)}>{pochaUsers[4]}</div>
    //           <div onClick={selectP(this.innerText)}>{pochaUsers[5]}</div>
    //         </div>
    //       </div>
    //       <input
    //         onClick={onClickVoteLiar}
    //         type="button"
    //         className={`${styles.retry}`}
    //         value="투표하기"
    //       />
    //     </div>
    //   </div>
    // </div>
  );
}

export default LiarVote;
