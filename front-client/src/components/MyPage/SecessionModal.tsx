import axios from "axios";
import { useAppDispatch } from "../../store/hooks";
import { showSecessionModal } from "../../store/store";
import { toast } from "react-toastify";
import styles from "./SecessionModal.module.css";
import { Navigate, useNavigate } from "react-router-dom";

const SecessionModal = ({ userData }: { userData: any }) => {
  const navigate = useNavigate();
  let dispatch = useAppDispatch();
  console.log(userData);
  const accessToken = localStorage.getItem("accessToken");
  const { nickname, username } = userData;
  // 탈퇴하는 함수
  const SecessionUser = async () => {
    try {
      const ssecession = await axios({
        method: "DELETE",
        url: `https://i8e201.p.ssafy.io/api/user/${username}`,
        headers: {
          accessToken: `${accessToken}`,
        },
      });
      toast.success(`${nickname}님은 회원탈퇴하였습니다`);
      // console.log("Secession", ssecession);
      window.localStorage.clear();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    dispatch(showSecessionModal());
  };

  // 취소 클릭시 모달 끄는 함수
  const closeSecessionModal = () => {
    dispatch(showSecessionModal());
  };

  return (
    <div className="bg-slate-800 bg-opacity-50 flex justify-center z-20 items-center absolute top-0 right-0 bottom-0 left-0">
      <div className="bg-black px-16 pt-14 pb-7 rounded-md text-center">
        <div className="text-xl mb-4 font-bold text-white">
          <span className="font-bold text-red-500">{`${nickname}`}</span>님
          탈퇴하시겠습니까?
        </div>
        <input
          onClick={SecessionUser}
          className={`${styles.cancelBtn} cursor-pointer`}
          type="submit"
          value="탈퇴"
        />
        <input
          onClick={closeSecessionModal}
          className={`${styles.createBtn} cursor-pointer`}
          type="submit"
          value="취소"
        />
      </div>
    </div>
  );
};

export default SecessionModal;
