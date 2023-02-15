import axios from "axios";
import { useAppDispatch } from "../../store/hooks";
import { showRoomUserReportModal } from "../../store/store";
import { toast } from "react-toastify";
import styles from "./RoomUserProfile.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoomUserRepotModal = ({ userData }: { userData: any }) => {
  let dispatch = useAppDispatch();
  const navigate = useNavigate()
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
      await axios({
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
                method: "POST",
                url: "https://i8e201.p.ssafy.io/api/user/report",
                data: {
                  attackerId: userId,
                  reportReason: reportReason,
                  reportType: reportType,
                  reporterId: myId,
                },
                headers: {
                  accessToken: `${r.data.accessToken}`,
                },
              }).then((r)=> {
                toast.success(`${nickname}을 신고하였습니다`)
              })
            }
          })
        } else {
          toast.success(`${nickname}을 신고하였습니다`)
        }
      })
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
      className="bg-slate-800 bg-opacity-50 flex justify-center items-center z-20 absolute top-0 right-0 bottom-0 left-0"
    >
      <div className="bg-black w-[33rem] h-[40.25rem] px-14 pt-14 pb-7 rounded-md text-center">
        <div className="flex justify-center items-center">
          <img className="w-8 h-8 object-contain" src={require('../../assets/roomIcon/alert.png')} alt="" />
        </div>
        <form onSubmit={reportUser}>
          <div className="text-3xl mb-4 mt-2 font-bold text-white">
            신고하기
          </div>
          {/* <div><span className="font-bold text-red-500">{`${nickname} `}</span></div> */}
          <div className="text-[#FF0000] text-[0.9rem] mb-8  font-bold pl-2"><span className="text-[1rem] text-orange-400 ">{nickname}</span><br /><span className="">님과 어떤 일이 있었는지 가능한 한 자세하게 적어주세요.</span></div>
          <div className="flex justify-center h-full w-full pl-3">
            <div className="text-white w-full flex-col jus">
              <div className="text-start mb-4">
                <input onChange={onChange} type="checkbox" name="type" value={0} />
                <span className="text-[1.12rem] pl-3">불쾌한 닉네임</span><br />
                <span className="pl-[1.7rem] text-[0.81rem] text-[#D7D7D7]">불쾌감을 주거나 부적절한 이름 사용</span>
              </div>
              <div className="text-start mb-4">
                <input onChange={onChange} type="checkbox" name="type" value={0} />
                <span className="text-[1.12rem] pl-3">욕설</span><br />
                <span className="pl-[1.7rem] text-[0.81rem] text-[#D7D7D7]">공격적인 언어 사용</span>
              </div>
              <div className="text-start mb-4">
                <input onChange={onChange} type="checkbox" name="type" value={0} />
                <span className="text-[1.12rem] pl-3">음란 행위, 성희롱</span><br />
                <span className="pl-[1.7rem] text-[0.81rem] text-[#D7D7D7]">불쾌감을 주거나 부적절한 이름 사용</span>
              </div>
              <div className="text-start mb-4">
                <input onChange={onChange} type="checkbox" name="type" value={0} />
                <span className="text-[1.12rem] pl-3">기타</span><br />
                <span className="pl-[1.7rem] text-[0.81rem] text-[#D7D7D7]">이외의 사유</span>
              </div>
              <div className="text-start mt-5">
                <textarea
                  className="p-1 w-full text-white border-2 border-[#D7D7D7] bg-black resize-none rounded-[4px]"
                  name="사유"
                  value={reportReason}
                  placeholder="사유"
                  onChange={onChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>
          <div className="mt-2">
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
