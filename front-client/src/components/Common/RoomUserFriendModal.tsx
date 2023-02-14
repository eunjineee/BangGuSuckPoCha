import axios from "axios";
import { useAppDispatch } from "../../store/hooks";
import { roomAddFriendModalState } from "../../store/store";
import { toast } from "react-toastify";
import styles from "./RoomUserProfile.module.css";

const RoomUserFriendModal = ({ userData }: { userData: any }) => {
  const clickUserId:number = userData.data.userId
  let dispatch = useAppDispatch();
  const { nickname } = userData.data;
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  // 친구신청 하는 함수
  const addFriend = async () => {
    try {
      const ffriend = await axios({
        method: "POST",
        url: "https://i8e201.p.ssafy.io/api/user/friend/request",
        data: {
          from_id: localStorage.getItem('userId'),
          to_id: clickUserId,
        },
        headers: {
          accessToken: `${accessToken}`,
        },
      });
      
      if (ffriend.data.message === "success") {
        toast.success(`${nickname}에게 친구신청을 완료하였습니다`);
      } else {
        toast.error(`${nickname}에게 친구신청을 이미 보냈습니다`);
      }
      
    } catch (error) {
      console.log(error);
    }
    dispatch(roomAddFriendModalState());
    
  };

  // 취소 클릭시 모달 끄는 함수
  const closeFriendModal = () => {
    dispatch(roomAddFriendModalState());
  };

  return (
    <div
      className="bg-slate-800 bg-opacity-50 flex justify-center z-20 items-center absolute top-0 right-0 bottom-0 left-0"
    >
      <div className="bg-black px-16 pt-14 pb-7 rounded-md text-center">
        <div className="text-xl mb-4 font-bold text-white">
          <span className="font-bold text-purple-300">{`${nickname}`}</span>
          님에게 친구신청을 하시겠습니까?
        </div>
        <input
          onClick={addFriend}
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

export default RoomUserFriendModal;
