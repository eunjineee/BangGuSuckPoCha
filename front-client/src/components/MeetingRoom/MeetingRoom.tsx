import RoomFooterNav from "../Common/RoomFooterNav";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { isRtcLoading, showRoomUserProfile } from "../../store/store";
import RoomUserProfile from "../Common/RoomUserProfile";
import Loading from "../Common/Loading";
import styles from "./MeetingRoom.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import MeetingWebRTC from "../WebRTC/MeetingWebRTC";
import WaitingRoom from "../Common/WaitingRoom";
import FriendSearch from "../Common/FriendSearch";
import NavUserEmojiClickModal from "../Common/NavUserEmojiClickModal";

const socket = io("https://pocha.online");

function MeetingRoom(): JSX.Element {

  const accessToken = localStorage.getItem("accessToken");
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
  const friendSearchState = useAppSelector((state)=> {return  state.friendSearchState})

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

  const getPochaInfo = async () => {
    try {
      const { data } = await axios({
        url: `https://i8e201.p.ssafy.io/api/pocha/${Number(PochaId)}`,
        headers: {
          accessToken: `${accessToken}`,
        },
      });
      setPochaInfo(data.data);
    } catch (error) {
      console.log("포차 정보 받아오기", error);
    }
  };

  const getMyInfo = async () => {
    try {
      const { data } = await axios({
        url: `https://i8e201.p.ssafy.io/api/user/myinfo/${localStorage.getItem(
          "Username"
        )}`,
        headers: {
          accessToken: `${accessToken}`,
        },
      });
      setMyInfo({ username: data.data.username, nickname: data.data.nickname });
    } catch (error) {
      console.log("내 정보 가져오기 ", error);
    }
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
          {
            friendSearchState? <FriendSearch/>:null
          }
          {RoomUserProfileClickCheck ? (
            <NavUserEmojiClickModal userData={navAlarmReviewEmojiUserData} />
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
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default MeetingRoom;
