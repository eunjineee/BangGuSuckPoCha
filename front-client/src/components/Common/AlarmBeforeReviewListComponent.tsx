import axios from "axios";
import styles from './Common.module.css'
import { changeNavAlarmReviewEmojiUserData, showRoomUserProfile } from "../../store/store";
import { useAppDispatch } from "../../store/hooks";
import StarReview from "./StarReview";

// 리뷰 리스트
function AlarmBeforeReviewListComponent({to_nickname, reviewId, toUsername, to_profile}:any):JSX.Element {
  // 이모지 클릭 여부
  const dispatch = useAppDispatch()
  let accessToken = localStorage.getItem("accessToken");
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
      console.log('리뷰전 ',r.data)
      dispatch(changeNavAlarmReviewEmojiUserData(r.data))
      dispatch(showRoomUserProfile())
    })
  }

  return (
    <>
    <div className={`grid h-[4rem] w-full ${styles.shortBorder}`} style={{gridTemplateColumns: '0.25fr 1fr'}}>

      {/* 유저 이모지 */}
      <div className="flex justify-center items-start">
        <img className="w-[2rem] h-[2rem] object-fill rounded-full" src={to_profile} alt="" onClick={UserStateSearch}/>
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
