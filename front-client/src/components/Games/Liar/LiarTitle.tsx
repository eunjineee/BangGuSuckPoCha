import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./LiarTitle.module.css";

function LiarTitle({
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
  const navigate = useNavigate();
  const [titles, setTitles] = useState<any>(null);

  const [nowtitle, setNowtitle] = useState<any>(null);

  const [isliar, setIsliar] = useState<any>(false);

  const [mynum, setMyNum] = useState<any>(null); // 내번호

  const myName = localStorage.getItem("Username"); // 내 이름

  const onClickClose = () => {
    const signalData = "VOTE";
    // 다음 페이지로 이동
    socket.emit("game_liar_signal", roomName, signalData);
  };

  // 라이어 게임 주제 받아오기
  const getLiarSubject = async () => {
    let accessToken = localStorage.getItem("accessToken");

    await axios({
      url: `https://i8e201.p.ssafy.io/api/pocha/game/liar`,
      headers: {
        accessToken: accessToken,
      },
    }).then((r) => {
      //토큰이상해
      if ("401" === r.data.status) {
        //토큰 재요청
        console.log("토큰 이상함");
        const refreshToken = localStorage.getItem("refreshToken");
        const Username = localStorage.getItem("Username");
        axios({
          method: "get",
          url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
          headers: {
            refreshToken: refreshToken,
          },
        }).then((r) => {
          //재발급 실패
          if ("401" === r.data.status) {
            localStorage.clear();
            toast.error("인증되지 않은 유저입니다");
            navigate("/");
          }
          //재발급 성공
          else {
            console.log("재발급 성공", r.data.accessToken);
            localStorage.setItem("accessToken", r.data.accessToken);
            accessToken = r.data.accessToken;
            //원래 axios 실행
            axios({
              url: `https://i8e201.p.ssafy.io/api/pocha/game/liar`,
              headers: {
                accessToken: accessToken,
              },
            }).then((r) => {
              setTitles(r.data.data);
            });
          }
        });
      }
      //토큰 정상이야
      else {
        console.log("토큰 정상함");
        //실행 결과값 그대로 실행
        setTitles(r.data.data);
      }
    });
  };

  // 이번 턴 주제
  const maintitle = () => {
    if (titles) {
      const titleone = Math.floor(Math.random() * (titles.length - 1));
      setNowtitle(titles[titleone]);
    }
  };

  // 내가 몇번째인지
  const setPeopleInfo = () => {
    pochaUsers.forEach((user: any, index: number) => {
      if (user.username === myName) {
        setMyNum(index);
      }
    });
  };

  // 나 라이어??
  const imliar = () => {
    if (liarnum === mynum) {
      setIsliar(true);
    } else {
      setIsliar(false);
    }
  };

  useEffect(() => {
    getLiarSubject(); //라이어 주제 받아오기
    setPeopleInfo(); // 방참가인원 정보
    imliar(); // 내가 라이어인지?
  }, []);

  useEffect(() => {
    maintitle();
  }, [titles]);

  console.log("~~~~~~~~~중에 라이어는-------", liarnum, "mynum---", mynum);
  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.box} ${styles.layout}`}>
        <div className={`${styles.box2} ${styles.layout2}`}>LIAR GAME</div>
        <div className={`${styles.layout5}`}>
          <div className={`${styles.box3}`}>주제 :</div>
          {nowtitle && (
            <div className={`${styles.box4}`} id="maintitle">
              {nowtitle.type}
            </div>
          )}
        </div>
        {nowtitle && (
          <div className={`${styles.layout4}`} id="title">
            {isliar ? nowtitle.word : "라이어입니다"}
          </div>
        )}
        <span className={`${styles.text1}`}>
          두 턴을 돌고 난 후,
          <br />
          NEXT를 클릭하여 라이어를 투표하십시오.
        </span>
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

export default LiarTitle;
