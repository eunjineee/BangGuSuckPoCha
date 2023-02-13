import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  roomAddFriendModalState,
  showRoomUserProfile,
  showRoomUserBanModal,
  showRoomUserReportModal,
} from "../../store/store";
import RoomUserBanModal from "./RoomUserBanModal";
import RoomUserFriendModal from "./RoomUserFriendModal";
import RoomUserReportModal from "./RoomUserReportModal";

const RoomUserProfile = ({ userData, pochaId, isHost, socket }: { userData: any, pochaId: string, isHost?: boolean, socket: any }) => {
  let dispatch = useAppDispatch();
  let { manner, gender, birth, region, comment, profile } = userData.data;
  const { nickname } = userData.data;
  // 백그라운드 div
  const bgDiv = useRef<any>();

  // 유저 중간 정보관련 이미지들
  const userInfoImages = [
    require("../../assets/myPage/temprature.png"),
    require("../../assets/myPage/gender.png"),
    require("../../assets/myPage/age.png"),
    require("../../assets/myPage/place.png"),
  ];
  // 유저 정보관련 칼라값들
  const infoColors = [
    "text-red-500",
    "text-orange-500",
    "text-green-500",
    "text-blue-500",
  ];
  // 친추 묻는 모달 띄우기
  const clickAddFriend = () => {
    dispatch(roomAddFriendModalState());
  };
  // 강퇴 묻는 모달 띄우기
  const clickBanUser = () => {
    dispatch(showRoomUserBanModal());
  };
  // 신고창 모달 띄우기
  const clickReportUser = () => {
    dispatch(showRoomUserReportModal());
  };

  console.log(isHost,"방장?**********************")
  // 유저 아래 친추, 강퇴, 신고하기 등
  // 이벤트핸들러들 [친추, 강퇴, 신고]
  let userInfoFootIcons : any[];
  let userInfoFootTitle : string[];
  let handlers: any[] = [];
  if (isHost) {
    userInfoFootIcons = [
      require("../../assets/roomIcon/add-user.png"),
      require("../../assets/roomIcon/exclamation-mark.png"),
      require("../../assets/roomIcon/report.png"),
    ];
    userInfoFootTitle = ["친구신청", "강퇴하기", "신고하기"];
    handlers = [clickAddFriend, clickBanUser, clickReportUser];
  } else {
    userInfoFootIcons = [
      require("../../assets/roomIcon/add-user.png"),
      require("../../assets/roomIcon/report.png"),
    ];
    userInfoFootTitle = ["친구신청", "신고하기"];
    handlers = [clickAddFriend, clickReportUser];
  }


  // 유저 정보
  const userInfosData = userDataReBuild();

  // 유저 정보 데이터 재가공 함수
  function userDataReBuild() {
    const date: any = new Date();
    //매너온도 가공
    manner = (manner).toFixed(1) + "℃"
    // 성별 데이터 다시 가공
    if (gender === "F") {
      gender = "여자";
    } else if (gender === "M") {
      gender = "남자";
    }
    // 연령 데이터 다시 가공
    const ageGroup = date.getFullYear() - Number(birth.substr(0, 4));
    if (ageGroup < 30) {
      birth = "20대";
    } else {
      birth = "30대";
    }
    // 지역 데이터 가공
    if (region !== "의정부" || region !== "동두천" || region !== "남양주") {
      region = region.substr(0, 2);
    }
    return [manner, gender, birth, region];
  }

  // 프로필 모달 끄는 함수
  function CloseProfileModal(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === bgDiv.current) {
      console.log("프로필꺼짐!");
      dispatch(showRoomUserProfile());
    }
  }

 
  // 친구추가 확인 모달 상태 체크
  const roomAddFriendModalCheck = useAppSelector((state) => {
    return state.roomAddFriendModalCheck;
  });

  // 강퇴 확인 모달 상태 체크
  const RoomUserBanClickCheck = useAppSelector((state) => {
    return state.RoomUserBanClickCheck;
  });

  // 신고 확인 모달 상태 체크
  const RoomUserReportClickCheck = useAppSelector((state) => {
    return state.RoomUserReportClickCheck;
  });

  return (
    <>
      {roomAddFriendModalCheck ? (
        <RoomUserFriendModal userData={userData} />
      ) : null}
      {RoomUserBanClickCheck ? <RoomUserBanModal userData={userData} pochaId={pochaId} socket={socket} /> : null}
      {RoomUserReportClickCheck ? <RoomUserReportModal userData={userData} /> : null}
      <div
        ref={bgDiv}
        onMouseDown={CloseProfileModal}
        className={`z-10 bg-slate-800 bg-opacity-50 fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center text-white`}
      >
        <div
          className={`min-w-[24rem] bg-black px-10 pt-10 pb-5 rounded-3xl `}
        >
          <div className={`w-full h-24 flex justify-center items-center`}>
            <img
              className={`h-full object-fill rounded-full h-[6rem] w-[6rem]`}
              src={profile}
              alt="sunglass"
            />
          </div>
          <div className={`w-full h-16 text-3xl font-bold`}>
            <div>{nickname}</div>
          </div>
          <div className={`w-full h-10 text-lg`}>
            {comment}
          </div>
          <div className={`flex h-32 my-12 justify-evenly`}>
            {userInfosData.map((info, index) => {
              return (
                <div key={info} className={`w-1/4 h-3/5 flex-col`}>
                  <img
                    className={`block mx-auto h-4/5`}
                    src={userInfoImages[index]}
                    alt={`${info}`}
                  />
                  {/* <div className="text-base">{info}</div> */}
                  <div
                    className={`text-lg my-3 font-bold ${infoColors[index]}`}
                  >
                    {info}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`flex h-20 p-2 justify-evenly border-t rounded-full`}>
            {userInfoFootTitle.map((info, index) => {
              return (
                <div key={info} className={`w-1/4 h-full flex-col`}>
                  <div
                    className={`w-full h-3/4 flex justify-center items-center`}
                  >
                    <img
                      onClick={handlers[index]}
                      className={`h-3/4 cursor-pointer hover:scale-110`}
                      src={userInfoFootIcons[index]}
                      alt={info}
                    />
                  </div>
                  <div className="text-sm">{info}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomUserProfile;
