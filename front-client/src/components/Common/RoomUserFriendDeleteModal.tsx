import axios from "axios";
import { useAppDispatch } from "../../store/hooks";
import { changeRoomDeleteFriendModalCheck, roomAddFriendModalState, showRoomUserProfile } from "../../store/store";
import { toast } from "react-toastify";
import styles from "./RoomUserProfile.module.css";

const RoomUserFriendDeleteModal = ({ userData }: { userData: any }) => {
  const clickUserId:number = userData.data.userId
  let dispatch = useAppDispatch();
  const { nickname } = userData.data;
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  // 친구신청 하는 함수
  const removeFriend = async () => {
    const username = localStorage.getItem('Username')
    try {
      const ffriend = await axios({
        method: "delete",
        url: `https://i8e201.p.ssafy.io/api/user/friend/${username}/${clickUserId}`,
        data: {
          username: username,
          you_id: clickUserId,
        },
        headers: {
          accessToken: `${accessToken}`,
        },
      });
      
      if (ffriend.data.message === "success") {
        toast.success(`친구목록에서 ${nickname}님을 삭제하였습니다`);
      } else {
        toast.error(`이미 요청이 완료되었습니다.`);
      }
      
    } catch (error) {
      console.log(error);
    }
    dispatch(changeRoomDeleteFriendModalCheck());
    // dispatch(showRoomUserProfile())
    
  };

  // 취소 클릭시 모달 끄는 함수
  const closeFriendModal = () => {
    dispatch(changeRoomDeleteFriendModalCheck());
  };

  return (
    <div
      className="bg-slate-800 bg-opacity-50 flex justify-center z-20 items-center absolute top-0 right-0 bottom-0 left-0"
    >
      <div className="bg-black px-16 pt-14 pb-7 rounded-md text-center">
        <div className="text-xl mb-4 font-bold text-white">
          <span className="font-bold text-purple-300">{`${nickname}`}</span>
          님을 삭제 하시겠습니까?
        </div>
        <input
          onClick={()=> {
            removeFriend()
            setTimeout(() => {
              dispatch(showRoomUserProfile())
            }, 100);
          }}
          className={`${styles.createBtn} cursor-pointer`}
          type="submit"
          value="신청"
        />
        <input
          onClick={closeFriendModal}
          className={`${styles.cancelBtn} cursor-pointer`}
          type="submit"
          value="취소"
        />
      </div>
    </div>
  );
};

export default RoomUserFriendDeleteModal;
