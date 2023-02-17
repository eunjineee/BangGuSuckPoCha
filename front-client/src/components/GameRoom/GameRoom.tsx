import Loading from "../Common/Loading";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./GameRoom.module.css";
import GameWebRTC from "../WebRTC/GameWebRTC";
import RoomFooterNav from "../Common/RoomFooterNav";
import { toast } from "react-toastify";
import FriendSearch from "../Common/FriendSearch";
import { useAppSelector } from "src/store/hooks";
import NavUserEmojiClickModal from "../Common/NavUserEmojiClickModal";
import RoomUserProfile from "../Common/RoomUserProfile";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
function GameRoom(): JSX.Element {
  // const dispatch = useAppDispatch();
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const { PochaId } = useParams();
  const [socket, setSocket] = useState<any>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 처음에 받아오는 포차 정보
  const [pochaInfo, setPochaInfo] = useState<any>(null);
  // 방장 여부
  const [isHost, setIsHost] = useState<boolean>(false);
  // 친구 요청 검색 모달
  const friendSearchState = useAppSelector((state) => {
    return state.friendSearchState;
  });
  const propSocket = (socket: any) => {
    setSocket(socket);
  };
  const navAlarmReviewEmojiUserData: any = useAppSelector((state: any) => {
    return state.navAlarmReviewEmojiUserData;
  });
  const RoomUserProfileClickCheck: any = useAppSelector((state: any) => {
    return state.RoomUserProfileClickCheck;
  });

  const [play, setPlay] = useState<boolean>(true);

  const player = useRef<any>();
  const Player = () => (
    <AudioPlayer
      ref={player}
      autoPlay={play}
      src="/RoomBGM/Game.mp3"
      loop
      onPlay={(e) => console.log("onPlay")}
      style={{ display: "none" }}
      volume={0.1}
      // other props here
    />
  );

  // 배경음 끄고 켜기 관련
  const onClickPlayer = () => {
    setPlay((prev) => !prev);
  }

  const propIsHost = (isHost: boolean) => {
    setIsHost(isHost);
  };

  console.log("pochaInfo", pochaInfo);

  const getPochaInfo = async () => {
    // try {
    //   const { data } = await axios({
    //     url: `https://i8e201.p.ssafy.io/api/pocha/${Number(PochaId)}`,
    //     headers: {
    //       accessToken: `${accessToken}`,
    //     },
    //   });
    //   setPochaInfo(data.data);
    //   switch (data.data.themeId) {
    //     case "T0B0":
    //       navigate(`/storyroom/${PochaId}`);
    //       // toast.success("포차 설정이 변경되었습니다");
    //       break;
    //     case "T0B1":
    //       navigate(`/storyroom/${PochaId}`);
    //       // toast.success("포차 설정이 변경되었습니다");
    //       break;
    //     case "T0B2":
    //       navigate(`/storyroom/${PochaId}`);
    //       // toast.success("포차 설정이 변경되었습니다");
    //       break;
    //     case "T1B0":
    //       navigate(`/gameroom/${PochaId}`);
    //       break;
    //   }
    //   setIsLoading(false);

    // } catch (error) {
    //   console.log("포차 정보 받아오기", error);
    // }
    axios({
      method: "GET",
      url: `https://i8e201.p.ssafy.io/api/pocha/${Number(PochaId)}`,
      headers: {
        accessToken: `${accessToken}`,
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
              method: "GET",
              url: `https://i8e201.p.ssafy.io/api/pocha/${Number(PochaId)}`,
              headers: {
                accessToken: `${accessToken}`,
              },
            }).then((r) => {
              setPochaInfo(r.data.data);
              switch (r.data.data.themeId) {
                case "T0B0":
                  navigate(`/storyroom/${PochaId}`);
                  // toast.success("포차 설정이 변경되었습니다");
                  break;
                case "T0B1":
                  navigate(`/storyroom/${PochaId}`);
                  // toast.success("포차 설정이 변경되었습니다");
                  break;
                case "T0B2":
                  navigate(`/storyroom/${PochaId}`);
                  // toast.success("포차 설정이 변경되었습니다");
                  break;
                case "T1B0":
                  navigate(`/gameroom/${PochaId}`);
                  break;
              }
              setIsLoading(false);
            });
          }
        });
      }
      //토큰 정상이야
      else {
        //실행 결과값 그대로 실행
        setPochaInfo(r.data.data);
        switch (r.data.data.themeId) {
          case "T0B0":
            navigate(`/storyroom/${PochaId}`);
            // toast.success("포차 설정이 변경되었습니다");
            break;
          case "T0B1":
            navigate(`/storyroom/${PochaId}`);
            // toast.success("포차 설정이 변경되었습니다");
            break;
          case "T0B2":
            navigate(`/storyroom/${PochaId}`);
            // toast.success("포차 설정이 변경되었습니다");
            break;
          case "T1B0":
            navigate(`/gameroom/${PochaId}`);
            break;
        }
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    getPochaInfo();
  }, []);

  return (
    <>
    {
      <Player />
    }
      {isLoading ? (
        <Loading />
      ) : (
        <div
          className={`w-screen min-h-screen ${styles.gameroomimg} bg-cover bg-no-repeat bg-center bg-scroll`}
        >
          {friendSearchState ? <FriendSearch /> : null}
          {RoomUserProfileClickCheck ? (
            <RoomUserProfile userData={navAlarmReviewEmojiUserData} pochaId={String(PochaId)} isHost={isHost} socket={socket}/>
          ) : null}
          
          {/* 화면 및 게임 공간 */}
          <div className="min-h-[90vh]">
            <GameWebRTC
              pochaId={PochaId!}
              propSocket={propSocket}
              propIsHost={propIsHost}
              getPochaInfo={getPochaInfo}
            />
          </div>
          <div className="relative bottom-0 left-0 right-0">
            {socket && (
              <RoomFooterNav
                pochaId={PochaId!}
                socket={socket}
                isHost={isHost}
                onClickPlayer={onClickPlayer}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default GameRoom;
