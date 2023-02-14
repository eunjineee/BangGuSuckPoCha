import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./LiarVoteAgain.module.css";

function LiarVoteAgain({
  socket,
  pochaId,
  pochaUsers,
  pochaInfo,
  isliar,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
  pochaInfo: any;
  isliar: boolean;
}): React.ReactElement {
  const roomName = pochaId;

  const [titles, setTitles] = useState<any>(null)
  const [nowtitle, setNowtitle] = useState<any>(null)
  const onClickClose = () => {
    const signalData = "INTRO";
    // 다음 페이지로 이동
    socket.emit("game_liar_signal", roomName, signalData);
  };

  // //토글 보여주기
  // function dropdown() {
  //   var v = document.querySelector('.dropdown_content');
  //   v.classList.toggle('show');
  // }

  // window.onload = () => {
  //   document.querySelector('.dropbtn_click').onclick = () => {
  //     dropdown();
  //   }
  //   document.getElementsByClassName('fastfood').onclick = () => {
  //     showMenu(value);
  //   };
  //   dropdown = () => {
  //     var v = document.querySelector('.dropdown-content');
  //     var dropbtn = document.querySelector('.dropbtn')
  //     v.classList.toggle('show');
  //     dropbtn.style.borderColor = 'rgb(94, 94, 94)';
  //   }
  // }

  // window.onclick = (e) => {
  //   if (!e.target.matches('.dropbtn_click')) {
  //     var dropdowns = document.getElementsByClassName("dropdown-content");
  //     var dropbtn_content = document.querySelector('.dropbtn_content');
  //     var dropbtn_click = document.querySelector('.dropbtn_click');
  //     var dropbtn = document.querySelector('.dropbtn');

  //     var i;
  //     for (i = 0; i < dropdowns.length; i++) {
  //       var openDropdown = dropdowns[i];
  //       if (openDropdown.classList.contains('show')) {
  //         openDropdown.classList.remove('show');
  //       }
  //     }
  //   }
  // }
  

  // //타이머 시작
  // var time = document.querySelector(".showTime");
  // var sec = 100;
  // time.innerHTML = `${sec}`;
  // timer();

  // function timer() {
  //   voteTime = setInterval(function () {
  //     sec = sec - 1; //1초씩 줄어듦
  //     time.innerHTML = `${sec}`;

  //   }, 1000); //1초마다 
  // }


  // setTimeout(function () {
  //   clearTimeout(voteTime);
  //   // 성공했을 때
  //   window.location.replace("LiarSuccess.html")

  //   // 실패했을 때

  //   // 투표수가 동일하게 나왔을 때

  // }, 100000);


  // //토글 선택했을 때
  // function selectP = (value) => {
  //   console.log(value);
  //   var dropbtn_content = document.querySelector('.dropbtn_content');
  //   var dropbtn_click = document.querySelector('.dropbtn_click');
  //   var dropbtn = document.querySelector('.dropbtn');

  //   dropbtn_content.innerText = value;
  //   dropbtn_content.style.color = '#252525';
  //   dropbtn.style.borderColor = '#3992a8';
  // }


  return (
    // <div className={`${styles.layout3}`}>
    //   <div className={`${styles.box} ${styles.layout}`}>
    //     <div className={`${styles.box2} ${styles.layout2}`}>LIAR GAME</div>
    //     <div className={`${styles.layout5}`}>
    //       <div className={`${styles.box3}`}>동점이 나왔습니다.<br/> 의논 후 다시 투표해주세요.</div>
    //     </div>
    //     <div className={`${styles.box4}`}>
    //       <div className={`${styles.text1} ${styles.showTime}`}></div>
          <div className={`${styles.text1}`} id="title">초</div>
    //     </div>
    //     <div className={`${styles.layout6}`}>
    //       <div className={`${styles.dropdown}`}>
    //         <button className={`${styles.dropbtn}`}>
    //           <span className={`${styles.dropbtn_content}`}>라이어는...?</span>
    //           <span className={`${styles.dropbtn_click} ${styles.dropbtn_click_style}`}
    //             onClick={dropdown}
    //             >
    //               arrow_drop_down
    //             </span>
    //         </button>
    //         <div className={`${styles.dropdown_content}`}>
    //           <div onClick={selectP(this.innerText)}>{}</div>
    //           <div onClick={selectP(this.innerText)}>애림이2</div>
    //           <div onClick={selectP(this.innerText)}>남규 짱짱맨</div>
    //           <div onClick={selectP(this.innerText)}>핑크빈</div>
    //           <div onClick={selectP(this.innerText)}>찬희한츼</div>

    //           <div className={`${styles.layout6}`}>
    //       <input 
    //         type="button" 
    //         onClick={onClickClose} 
    //         className={`${styles.retry}`} 
    //         value="NEXT" 
    //       />
    //         </div>
    //       </div>
    //       <a href="./LiarIntro.html"><input type="button" className={`${styles.retry}`} value="투표"/></a>
    //     </div>
    //   </div>
    // </div>
  );
}

export default LiarVoteAgain;
