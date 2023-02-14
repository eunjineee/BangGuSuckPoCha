import axios from "axios";
import { useAppDispatch } from "../../store/hooks";
import { showRoomUserReportModal } from "../../store/store";
import { toast } from "react-toastify";
import styles from "./RoomUserProfile.module.css";
import { useState } from "react";

const RoomUserRepotModal = ({ userData }: { userData: any }) => {
  let dispatch = useAppDispatch();
  const { username, nickname, userId } = userData.data;
  const [reportReason, setReportReason] = useState<string>("");
  const [reportType, setReportType] = useState<number>(0);
  console.log('데이터보자', userData.data)
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  //주석추가
  const onChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    switch (name) {
      case "사유":
        setReportReason(value);
        break;
      case "type":
        setReportType(Number(value));
        break;
    }
  };

  // 나의 아이디 값
  const myId = localStorage.getItem("userId");
  

  // 신고하는 함수
  const reportUser = async (event: any) => {
    event.preventDefault();
    console.log('신고내역', username, reportReason, reportType, myId);
    try {
      const rreport = await axios({
        method: "POST",
        url: "https://i8e201.p.ssafy.io/api/user/report",
        data: {
          attackerId: userId,
          reportReason: reportReason,
          reportType: reportType,
          reporterId: myId,
        },
        headers: {
          accessToken: `${accessToken}`,
        },
      });
      toast.success(`${nickname}을 신고하였습니다`)
      console.log("report신고갔냐", rreport);
    } catch (error) {
      console.log("유저신고에러", error);
    }
    dispatch(showRoomUserReportModal());
  };

  // 취소 클릭시 모달 끄는 함수
  const closeReportModal = () => {
    dispatch(showRoomUserReportModal());
  };

  return (
    <div
      className="bg-slate-800 bg-opacity-50 flex justify-center z-20 items-center absolute top-0 right-0 bottom-0 left-0"
    >
      <div className="bg-black w-[22%] px-14 pt-14 pb-7 rounded-md text-center">
        <form onSubmit={reportUser}>
          <div className="text-2xl mb-6 font-bold text-white">
            <span className="font-bold text-red-500">{`${nickname} `}</span>
            신고하기
          </div>
          <div className="flex justify-center">
            <div className="text-white w-3/4 flex-col">
              <div className="text-start my-2">
                <input onChange={onChange} type="radio" name="type" value={0} />
                <span className="text-lg pl-3">욕설/협박</span>
              </div>
              <div className="text-start my-2">
                <input onChange={onChange} type="radio" name="type" value={1} />
                <span className="text-lg pl-3">혐오발언</span>
              </div>
              <div className="text-start my-2">
                <input onChange={onChange} type="radio" name="type" value={2} />
                <span className="text-lg pl-3">부적절한 닉네임</span>
              </div>
              <div className="text-start my-2">
                <input onChange={onChange} type="radio" name="type" value={3} />
                <span className="text-lg pl-3">음란행위/성희롱</span>
              </div>
              <div className="text-start my-2">
                <input onChange={onChange} type="radio" name="type" value={4} />
                <span className="text-lg pl-3">기타</span>
              </div>
              <div className="text-start mt-5">
                <textarea
                  className="p-1 w-full text-white border-2 border-white bg-black resize-none"
                  name="사유"
                  value={reportReason}
                  placeholder="신고사유"
                  onChange={onChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <input
              className={`${styles.cancelBtn} cursor-pointer`}
              type="submit"
              value="신고"
            />
            <input
              onClick={closeReportModal}
              className={`${styles.createBtn} cursor-pointer`}
              type="button"
              value="취소"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomUserRepotModal;
