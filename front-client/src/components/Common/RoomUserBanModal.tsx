import axios from "axios";
import { useAppDispatch } from "../../store/hooks";
import { showRoomUserBanModal, showRoomUserProfile } from "../../store/store";
import { toast } from "react-toastify";
import styles from "./RoomUserProfile.module.css";
import { useNavigate } from "react-router-dom";

const RoomUserBanModal = ({ userData, pochaId, socket }: { userData: any, pochaId: string, socket: any }) => {
  let dispatch = useAppDispatch();
  const navigate = useNavigate()
  const { nickname, username } = userData.data;
  const pochaID = Number(pochaId);
  const roomName = pochaId;
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  // console.log(' 유유유저데이터j', userData);
  // 강퇴하는 함수
  const banUser = async () => {
    try {
      await axios({
        method: "PUT",
        url: "https://i8e201.p.ssafy.io/api/pocha/exit",
        data: {
          isHost: true,
          pochaId: pochaID,
          username: username,
          waiting: true,
        },
        headers: {
          accessToken: `${accessToken}`,
        },
      }).then((r)=> {
        // 토큰 갱신 필요
        if (r.data.status === '401') {
          axios({
            method: 'get',
            url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
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
                url: "https://i8e201.p.ssafy.io/api/pocha/exit",
                data: {
                  isHost: true,
                  pochaId: pochaID,
                  username: username,
                  waiting: true,
                },
                headers: {
                  accessToken: `${r.data.accessToken}`,
                },
              }).then((r)=>{
                socket.emit("ban", roomName, username);
                toast.success(`${nickname}을 강퇴하였습니다`);
              })
            }
          })
        } else {
          socket.emit("ban", roomName, username);
          toast.success(`${nickname}을 강퇴하였습니다`);
        }
      })
    } catch (error) {
      console.log("강퇴에러", error);
    }
    dispatch(showRoomUserBanModal());
    dispatch(showRoomUserProfile());
  };

  // 취소 클릭시 모달 끄는 함수
  const closeFriendModal = () => {
    dispatch(showRoomUserBanModal());
  };

  return (
    <div
      className="bg-slate-800 bg-opacity-50 flex justify-center z-20 items-center absolute top-0 right-0 bottom-0 left-0"
    >
      <div className="bg-black px-16 pt-14 pb-7 rounded-md text-center">
        <div className="text-xl mb-4 font-bold text-white">
          <span className="font-bold text-red-500" >{`${nickname}`}</span>
          님을 방에서 강퇴하시겠습니까?
        </div>
        <input
          onClick={banUser}
          className={`${styles.cancelBtn} cursor-pointer`}
          type="submit"
          value="강퇴"
        />
        <input
          onClick={closeFriendModal}
          className={`${styles.createBtn} cursor-pointer`}
          type="submit"
          value="취소"
        />
      </div>
    </div>
  );
};

export default RoomUserBanModal;
