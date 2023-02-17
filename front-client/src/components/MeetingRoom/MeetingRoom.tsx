import RoomFooterNav from "../Common/RoomFooterNav";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { isRtcLoading, showRoomUserProfile } from "../../store/store";
import RoomUserProfile from "../Common/RoomUserProfile";
import Loading from "../Common/Loading";
import styles from "./MeetingRoom.module.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import MeetingWebRTC from "../WebRTC/MeetingWebRTC";
import WaitingRoom from "../Common/WaitingRoom";
import FriendSearch from "../Common/FriendSearch";
import NavUserEmojiClickModal from "../Common/NavUserEmojiClickModal";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { toast } from "react-toastify";
const socket = io("https://pocha.online");

function MeetingRoom(): JSX.Element {
  const navigate = useNavigate();
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  // const dispatch = useAppDispatch();
  const { PochaId } = useParams();
  // const [socket, setSocket] = useState<any>(null);
  const [isWaiting, setIsWaiting] = useState<boolean>(true);

  // 처음에 받아오는 포차 정보
  const [pochaInfo, setPochaInfo] = useState<any>(null);

  // 본인 정보 가져오기
  const [myInfo, setMyInfo] = useState<any>(null);

  // 친구 요청 검색 모달
  const friendSearchState = useAppSelector((state) => {
    return state.friendSearchState;
  });

  const RoomUserProfileClickCheck: any = useAppSelector((state: any) => {
    return state.RoomUserProfileClickCheck;
  });

  const navAlarmReviewEmojiUserData: any = useAppSelector((state: any) => {
    return state.navAlarmReviewEmojiUserData;
  });

  // 방장 여부
  const [isHost, setIsHost] = useState<boolean>(false);

  const propIsHost = (isHost: boolean) => {
    setIsHost(isHost);
  };

  const [play, setPlay] = useState<boolean>(true);

  const player = useRef<any>();
  const Player = () => (
    <AudioPlayer
      ref={player}
      autoPlay={play}
      src="/RoomBGM/Meeting.mp3"
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

  const getPochaInfo = async () => {
    await axios({
      url: `https://i8e201.p.ssafy.io/api/pocha/${Number(PochaId)}`,
      headers: {
        accessToken: `${accessToken}`,
      },
    }).then((r) => {
      console.log('75번줄',r);
      console.log('75번줄',r.data);
      console.log('75번줄',r.data.data);
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
          console.log('92번줄',r);
          console.log('92번줄',r.data);
          console.log('92번줄',r.data.data);
          
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
              url: `https://i8e201.p.ssafy.io/api/pocha/${Number(PochaId)}`,
              headers: {
                accessToken: `${accessToken}`,
              },
            }).then((r) => {
              console.log('113번줄',r);
              console.log('113번줄',r.data);
              console.log('113번줄',r.data.data);
              setPochaInfo(r.data.data);
            });
          }
        });
      }
      //토큰 정상이야
      else {
        //실행 결과값 그대로 실행
        console.log('124번줄',r);
        console.log('124번줄',r.data);
        console.log('124번줄',r.data.data);
        setPochaInfo(r.data.data);
      }
    });
  };

  const getMyInfo = async () => {
    await axios({
      url: `https://i8e201.p.ssafy.io/api/user/myinfo/${localStorage.getItem(
        "Username"
      )}`,
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
              url: `https://i8e201.p.ssafy.io/api/user/myinfo/${localStorage.getItem(
                "Username"
              )}`,
              headers: {
                accessToken: `${accessToken}`,
              },
            }).then((r) => {
              setMyInfo({
                username: r.data.data.data.username,
                nickname: r.data.data.data.nickname,
              });
            });
          }
        });
      }
      //토큰 정상이야
      else {
        //실행 결과값 그대로 실행
        setMyInfo({
          username: r.data.data.username,
          nickname: r.data.data.nickname,
        });
      }
    });
  };

  //const test = io("https://pocha.online")
  // const socket = io("https://pocha.online");
  // const setSocketInfo = () => {
  //   setSocket("https://pocha.online");
  // };
  // const propSocket = (socket: any) => {
  //   setSocket(socket);
  // };

  // setInterval(() => {
  //   setTestNumber(testNumber + 1);
  // }, 1000);

  const waitEnd = () => {
    setIsWaiting(false);
  };

  useEffect(() => {
    getPochaInfo();
    getMyInfo();
    return () => {
      localStorage.removeItem("myIntroduce");
    };
  }, []);

  return (
    <>
      {<Player />}
      {socket == null || myInfo == null ? (
        <div></div>
      ) : isWaiting ? (
        <WaitingRoom
          pochaId={PochaId!}
          socket={socket}
          waitEnd={waitEnd}
          myInfo={myInfo}
        />
      ) : (
        <div
          className={`w-screen min-h-screen ${styles.gameroomimg} bg-cover bg-no-repeat bg-center bg-scroll`}
        >
          {friendSearchState ? <FriendSearch /> : null}
          {RoomUserProfileClickCheck ? (
            <RoomUserProfile
              userData={navAlarmReviewEmojiUserData}
              pochaId={String(PochaId)}
              isHost={isHost}
              socket={socket}
            />
          ) : null}

          {/* 화면 및 게임 공간 */}
          <div className="h-[90%]">
            <MeetingWebRTC
              pochaId={PochaId!}
              socket={socket}
              propIsHost={propIsHost}
              pochaInfo={pochaInfo}
              getPochaInfo={getPochaInfo}
            />
          </div>
          <div className="relative bottom-0 left-0 right-0">
            {socket && (
              // <RoomMeetingFooterNav pochaId={PochaId!} socket={socket} />
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
export default MeetingRoom;
