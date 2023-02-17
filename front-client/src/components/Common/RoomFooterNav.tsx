import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  changeEnterPochaType,
  inviteMyFriend,
  showPublicModal,
  showUpdatePocha,
  showUpdateRoom,
} from "src/store/store";
import InviteFriend from "./InviteFriend";
import Loading from "./Loading";
import PublicModal from "./PublicModal";
import UpdateChangeStoryAndGame from "./UpdateChangeStoryAndGame";
import UpdateRoomInfo from "./UpdateRoomInfo";

function RoomFooterNav({
  pochaId,
  socket,
  isHost,
  onClickPlayer,
}: {
  pochaId: string;
  socket: any;
  isHost: boolean;
  onClickPlayer?: Function;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const userName = localStorage.getItem("Username");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const myName = localStorage.getItem("Username");
  // 룸 이름
  const roomName = pochaId;
  // 배경음 켜고 끄기
  const [playing, setPlaying] = useState<boolean>(true);
  
  // Public모달 데이터
  const [modalData, setModalData] = useState<any>(null);
  // 현재 포차테마 가져올 주소
  const url = window.location.href;
  const [roomTheme, setRoomTheme] = useState<number>();
  // 현재 포차테마 가져오기
  useEffect(() => {
    if (url.indexOf("story") !== -1) {
      setRoomTheme(1);
      dispatch(changeEnterPochaType(1))
    } else if (url.indexOf("game") !== -1) {
      setRoomTheme(2);
      dispatch(changeEnterPochaType(2))
    } else if (url.indexOf("meeting") !== -1) {
      setRoomTheme(3);
      dispatch(changeEnterPochaType(3))
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // 현재 시간 관련
  const [currentDate, setCurrentDate] = useState<any>("⏳");
  setInterval(() => {
    const date = new Date();
    // console.log(date.toLocaleTimeString('ko-kr').slice(0,7));
    let hour = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    setCurrentDate((hour + ":" + minutes) as any);
  }, 1000);

  // 음악 끄는거 관련
  const onClickMusic = () => {
    if (onClickPlayer) {
      onClickPlayer();
      setPlaying((prev) => !prev);
    }
    return
  }

  // Public 모달 보이기 관련
  const showModal = useAppSelector((state) => {
    return state.PublicModal;
  });

  // 포차변경 모달 보이기 관련
  const showChangeUpdatePocha = useAppSelector((state) => {
    return state.changeUpdatePocha;
  });

  // Update 모달 보이기 관련
  const showUpdateModal = useAppSelector((state) => {
    return state.updateRoomInfo;
  });


  // 친구 초대 모달 보이기 관련
  const showInviteFriend = useAppSelector((state) => {
    return state.inviteFriendModal;
  });

  // 클릭시 Public모달 보이는 함수
  const onClickShowModal = (event: React.MouseEvent<HTMLImageElement>) => {
    switch (event.currentTarget.id) {
      // 시간추가 관련 데이터
      case "addTime":
        setModalData({
          type: "addTime",
          msg: "시간을 연장하시겠습니까?",
          pochaId,
          socket,
        });
        break;
      // 나가기 관련 데이터
      case "exit":
        setModalData({
          type: "exit",
          msg: "포차에서 퇴장하시겠습니까?",
          pochaId,
          socket,
        });
        break;
      // 짠 관련 데이터
      case "jjan":
        setModalData({
          type: "jjan",
          msg: "짠??",
          pochaId,
          img: `${require("src/assets/roomIcon/cheer.png")}`,
          socket,
        });
        break;
    }
    // 모달 켜는 dispatch
    dispatch(showPublicModal(true));
  };

  const onClickShowInvite = (username: string, nickname: string) => {
    setModalData({
      type: "invite",
      msg: "포차에 초대하시겠습니까?",
      username,
      nickname,
      pochaId,
    });
    // 모달 켜는 dispatch
    dispatch(showPublicModal(true));
  };

  // 포차 정보 업데이트 모달 켜기
  const onClickUpdateModal = () => {
    // 방장 체크후 처리
    if (!isHost) {
      setModalData({
        type: "host",
        nickname: "포차수정은",
        msg: "방장만 가능합니다",
      });
      dispatch(showPublicModal(true));
      return;
    }
    dispatch(showUpdateRoom(true));
  };

  // const onClickChangePocha = () => {
  //   // 방장 체크후 처리
  //   if (!isHost) {
  //     setModalData({
  //       type: "host",
  //       nickname: "포차수정은",
  //       msg: "방장만 가능합니다",
  //     });
  //     dispatch(showPublicModal(true));
  //     return;
  //   }
  //   dispatch(showUpdatePocha(true));
  // }

  // 친구 초대 창 켜기
  const onClickInviteFriend = () => {
    dispatch(inviteMyFriend(true));
  };

  // ----- 소켓 관련 썰 변경 이벤트 ------
  async function handleSsulClick() {
    // 방장 체크후 처리
    if (!isHost) {
      setModalData({
        type: "host",
        nickname: "썰",
        msg: "변경은 방장만 가능합니다",
      });
      dispatch(showPublicModal(true));
      return;
    }
    let input = prompt("Ssul을 입력하세요!", "썰을 등록해주세요");
    if (input == null) return;
    if (input.length > 20) {
      alert("썰 제한은 20글자 입니다");
      handleSsulClick();
      return
    }
    try {
      await axios({
        method: "PUT",
        url: `https://i8e201.p.ssafy.io/api/pocha/talk/ssul/${roomName}`,
        data: {
          ssulTitle: input,
          username: myName,
        },
        headers: {
          accessToken: `${accessToken}`,
        },
      }).then((r)=> {
        // 토큰 갱신 필요
        if (r.data.status === '401') {
          axios({
            method: 'get',
            url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${userName}`,
            headers: {
              refreshToken: `${refreshToken}`,
            }
          }).then((r)=> {
            // 돌려보내기
            if (r.data.status === '401') {
              localStorage.clear();
              toast.error('인증되지 않은 유저입니다')
              navigate('/')
              } else {
                // 엑세스 토큰 추가
                localStorage.setItem("accessToken", r.data.accessToken);
                // 재요청  
                axios({
                  method: "PUT",
                  url: `https://i8e201.p.ssafy.io/api/pocha/talk/ssul/${roomName}`,
                  data: {
                    ssulTitle: input,
                    username: myName,
                  },
                  headers: {
                    accessToken: `${r.data.accessToken}`,
                  },
                }).then((r)=> {
                  // webRTC 썰 변경.
                  socket.emit("ssul_change", roomName, input);
                })
              } 
            })
          } else {
          // webRTC 썰 변경.
          socket.emit("ssul_change", roomName, input);
          }
        })      
      } catch (error) {
        console.log("썰 변경 요청에러", error);
    }
  }

  return (
    <>
      {isLoading ? <Loading /> : null}
      {showModal && <PublicModal data={modalData} socket={socket} />}
      {showUpdateModal && (
        <UpdateRoomInfo
          pochaId={pochaId}
          roomTheme={roomTheme!}
          socket={socket}
        />
      )}
      {showChangeUpdatePocha && (
        <UpdateChangeStoryAndGame
          pochaId={pochaId}
          roomTheme={roomTheme!}
          socket={socket}
        />
      )}
      {showInviteFriend && (
        <InviteFriend pochaId={pochaId} onClickShowInvite={onClickShowInvite} />
      )}
      <div className="w-full flex justify-center items-center">
        <div className="min-w-fit w-[40rem] text-white p-2 flex justify-evenly items-center border-2 border-b-0 rounded-t-xl">
          <div className="flex justify-center items-center text-[2rem] ">
            {currentDate}
          </div>
          <div className="flex flex-col justify-center items-center min-h-full max-h-full cursor-pointer w-[3.2rem]">
            <img
              onClick={onClickMusic}
              className="h-[2.2rem] py-[0.2rem] transition-all duration-300 hover:scale-110"
              src={playing ? require("src/assets/roomIcon/pause.png") : require("src/assets/roomIcon/play.png")}
              alt="addTime"
              id="addTime"
            />
            <span className="text-[0.8rem] mt-1">{playing ? `BGM Off` : 'BGM On'}</span>
          </div>
          {/* <div className="flex flex-col justify-center items-center min-h-full max-h-full cursor-pointer">
            <img
              onClick={onClickChangePocha}
              className="h-[2.2rem] py-auto transition-all duration-300 hover:scale-110"
              src={roomTheme === 1 ? require("src/assets/roomIcon/game_control.png") : require("src/assets/roomIcon/story_chat.png")}
              alt="change"
              id="change"
            />
            <span className="text-[0.8rem] mt-1">{roomTheme === 1 ? "게임포차" : "소통포차"}</span>
          </div> */}
          <div className="flex flex-col justify-center items-center min-h-full max-h-full cursor-pointer">
            <img
              onClick={onClickShowModal}
              className="h-[2.2rem] py-auto transition-all duration-300 hover:scale-110"
              src={require("src/assets/roomIcon/cheers.png")}
              alt="jjan"
              id="jjan"
            />
            <span className="text-[0.8rem] mt-1">짠</span>
          </div>
          <div className="flex flex-col justify-center items-center min-h-full max-h-full cursor-pointer">
            <img
              onClick={onClickInviteFriend}
              className="h-[2.2rem] py-auto transition-all duration-300 hover:scale-110"
              src={require("src/assets/roomIcon/add-user.png")}
              alt="invite"
              id="invite"
            />
            <span className="text-[0.8rem] mt-1">친구초대</span>
          </div>
          {roomTheme === 1 ? (
            <div className="flex flex-col justify-center items-center min-h-full max-h-full cursor-pointer">
              <img
                onClick={handleSsulClick}
                className="h-[2.2rem] py-auto transition-all duration-300 hover:scale-110"
                src={require("src/assets/roomIcon/communication.png")}
                alt="ssul"
              />
              <span className="text-[0.8rem] mt-1">썰</span>
            </div>
          ) : null}
          <div className="flex flex-col justify-center items-center min-h-full max-h-full cursor-pointer">
            <img
              onClick={onClickUpdateModal}
              className="h-[2.2rem] py-auto transition-all duration-300 hover:scale-110"
              src={require("src/assets/roomIcon/exclamation-mark.png")}
              alt="update"
              id="update"
            />
            <span className="text-[0.8rem] mt-1">포차정보</span>
          </div>
          <div className="flex flex-col justify-center items-center min-h-full max-h-full cursor-pointer">
            <img
              onClick={onClickShowModal}
              className="h-[2.2rem] py-auto transition-all duration-300 hover:scale-110"
              src={require("src/assets/roomIcon/cancel.png")}
              alt="exit"
              id="exit"
            />
            <span className="text-[0.8rem] mt-1">나가기</span>
          </div>
        </div>
      </div>
    </>
  );
}
export default RoomFooterNav;
