import Loading from "../Common/Loading";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./GameRoom.module.css";
import GameWebRTC from "../WebRTC/GameWebRTC";
import RoomFooterNav from "../Common/RoomFooterNav";
import { toast } from "react-toastify";
import FriendSearch from "../Common/FriendSearch";
import { useAppSelector } from "src/store/hooks";
import NavUserEmojiClickModal from "../Common/NavUserEmojiClickModal";

function GameRoom(): JSX.Element {
  // const dispatch = useAppDispatch();
  const { PochaId } = useParams();
  const [socket, setSocket] = useState<any>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 처음에 받아오는 포차 정보
  const [pochaInfo, setPochaInfo] = useState<any>(null);
  // 방장 여부
  const [isHost, setIsHost] = useState<boolean>(false);
// 친구 요청 검색 모달
  const friendSearchState = useAppSelector((state)=> {return  state.friendSearchState})
  const propSocket = (socket: any) => {
    setSocket(socket);
  };
  const navAlarmReviewEmojiUserData: any = useAppSelector((state: any) => {
    return state.navAlarmReviewEmojiUserData;
  });
  const RoomUserProfileClickCheck: any = useAppSelector((state: any) => {
    return state.RoomUserProfileClickCheck;
  });

  const propIsHost = (isHost: boolean) => {
    setIsHost(isHost);
  };

  console.log("pochaInfo", pochaInfo);

  const getPochaInfo = async () => {
    try {
      const { data } = await axios({
        url: `https://i8e201.p.ssafy.io/api/pocha/${Number(PochaId)}`,
      });
      setPochaInfo(data.data);
      switch (data.data.themeId) {
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
      
    } catch (error) {
      console.log("포차 정보 받아오기", error);
    }
  };

  useEffect(() => {
    getPochaInfo();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
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
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default GameRoom;
