import axios from "axios";
import styles from './Common.module.css'
import { changeNavAlarmReviewEmojiUserData, showRoomUserProfile } from "../../store/store";
import { useAppDispatch } from "../../store/hooks";
import StarReview from "./StarReview";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// 리뷰 리스트
function AlarmBeforeReviewListComponent({to_nickname, reviewId, toUsername, to_profile}:any):JSX.Element {
  // 이모지 클릭 여부
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const userName = localStorage.getItem("Username");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  function UserStateSearch() {
    
    axios({
      method: 'get',
      url: `https://i8e201.p.ssafy.io/api/user/info/${toUsername}`,
      headers: {
        accessToken: `${accessToken}`,
      },
    })
    .then((r)=> {
      // 토큰 갱신 필요
      if (r.data.status === '401') {
        axios({
          method: 'get',
          url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${userName}`,
          headers: {
            refreshToken: `${refreshToken}`,
          }
        }).then((r)=> {
          console.log('Tag의 57번줄: ', r.data.status);
          
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
              method: 'get',
              url: `https://i8e201.p.ssafy.io/api/user/info/${toUsername}`,
              headers: {
                accessToken: `${r.data.accessToken}`,
              },
            }).then((r)=> {
              console.log('리뷰전 ',r.data)
              dispatch(changeNavAlarmReviewEmojiUserData(r.data))
              dispatch(showRoomUserProfile())
            })
          }
        })
      } else {
        // 토큰 변경 없을 때
        console.log('리뷰전 ',r.data)
        dispatch(changeNavAlarmReviewEmojiUserData(r.data))
        dispatch(showRoomUserProfile())
      }
    })  
  }

  return (
    <>
    <div className={`grid h-[4rem] w-full ${styles.shortBorder}`} style={{gridTemplateColumns: '0.25fr 1fr'}}>

      {/* 유저 이모지 */}
      <div className="flex justify-center items-start">
        <img className="w-[2rem] h-[2rem] object-fill rounded-full cursor-pointer" src={to_profile} alt="" onClick={UserStateSearch}/>
      </div>
      {/* 별점 및 평가하기 */}
      <div className="grid" style={{gridTemplateRows: '1fr 1fr'}}>
        <div className="flex justify-start items-center text-base">
          <span className={`${styles.nickNameNeon} cursor-pointer`} onClick={UserStateSearch}>{to_nickname}</span>
        </div>
        <StarReview to_nickname={to_nickname} reviewId={reviewId} toUsername={toUsername}/>
      </div>
    </div>
    </>
  )
}



export default AlarmBeforeReviewListComponent
