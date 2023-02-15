import axios from "axios";
import { FaStar } from 'react-icons/fa'
import styles from './Common.module.css'
import { useState } from "react";
import { changeAlarmApiDataState } from "../../store/store";
import { useAppDispatch } from "../../store/hooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// 리뷰 평가
function StarReview({to_nickname, reviewId, toUsername}:any):JSX.Element {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [starState,setStarState] = useState()
  // username (현재는 내꺼)
  const username = localStorage.getItem('Username')
  const [rating, setRating] = useState(null) as any
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return (
    
    <div className="flex justify-start items-center">
      <div className={`grid `} style={{gridTemplateColumns: '3fr 1fr 1.5fr'}}>
        <StarRating  setStarState={setStarState} rating={rating} setRating={setRating}/>
        <div></div>
        <div className="flex justify-center items-center cursor-pointer w-full h-ful">
          <input className={`text-xs cursor-pointer ${styles.createBtn}`} type="submit" value={'평가하기'} onClick={(e)=> {
            console.log('평가점수: ', starState)
            setRating(null)
            axios({
              method: 'put',
              url: 'https://i8e201.p.ssafy.io/api/user/review',
              data: {
                "reviewId" : reviewId,
                "reviewScore" : starState,
                "toUsername" : toUsername
              },
              headers: {
                accessToken: `${accessToken}`,
              },
            })
            .then((r)=> {
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
                      method: 'put',
                      url: 'https://i8e201.p.ssafy.io/api/user/review',
                      data: {
                        "reviewId" : reviewId,
                        "reviewScore" : starState,
                        "toUsername" : toUsername
                      },
                      headers: {
                        accessToken: `${r.data.accessToken}`,
                      },
                    }).then((r)=> {
                      toast.success(`${to_nickname}님을 평가 완료하였습니다`);
                      axios({
                        method: 'get',
                        url: `https://i8e201.p.ssafy.io/api/user/review/${username}`,
                        headers: {
                          accessToken: `${localStorage.getItem("accessToken")}`,
                        },
                      })
                      .then((r)=>{
                        const datas:any[] = r.data.data
                        // 현재 날짜 지정
                        const now = new Date()
                        // 현재 연도
                        let now_year = now.getFullYear()
                        // 현재 월
                        let now_month = ('0' + (now.getMonth() +  1 )).slice(-2);
                        // 현재 일
                        let now_day= ('0'+(now.getDate())).slice(-2)
                        let two_day_ago= ('0'+(now.getDate()-2)).slice(-2)
                        // 현재 연도-월-일
                        const nowYMD:any = new Date(now_year+"-"+now_month+"-"+now_day)
                        const threeBeforeYMD:any = new Date(now_year+"-"+now_month+"-"+two_day_ago)
                        
                        // 3일 
                        // 리뷰 이전
                        const Beforedata:any = datas.filter((data)=> {  
                          const review_create_at = new Date(((data.create_at).split('T'))[0])
                          return ((data.review_at === null)&&(review_create_at<=nowYMD)&&(threeBeforeYMD<=review_create_at))
                        })
                        dispatch(changeAlarmApiDataState(Beforedata))
                      })
                    })
                  }
                })
              } else {
                toast.success(`${to_nickname}님을 평가 완료하였습니다`);
                axios({
                  method: 'get',
                  url: `https://i8e201.p.ssafy.io/api/user/review/${username}`,
                  headers: {
                    accessToken: `${accessToken}`,
                  },
                })
                .then((r)=>{
                  const datas:any[] = r.data.data
                  // 현재 날짜 지정
                  const now = new Date()
                  // 현재 연도
                  let now_year = now.getFullYear()
                  // 현재 월
                  let now_month = ('0' + (now.getMonth() +  1 )).slice(-2);
                  // 현재 일
                  let now_day= ('0'+(now.getDate())).slice(-2)
                  let two_day_ago= ('0'+(now.getDate()-2)).slice(-2)
                  // 현재 연도-월-일
                  const nowYMD:any = new Date(now_year+"-"+now_month+"-"+now_day)
                  const threeBeforeYMD:any = new Date(now_year+"-"+now_month+"-"+two_day_ago)
                  
                  // 3일 
                  // 리뷰 이전
                  const Beforedata:any = datas.filter((data)=> {  
                    const review_create_at = new Date(((data.create_at).split('T'))[0])
                    return ((data.review_at === null)&&(review_create_at<=nowYMD)&&(threeBeforeYMD<=review_create_at))
                  })
                  dispatch(changeAlarmApiDataState(Beforedata))
                })
              }
            })
          }}/>
        </div>
      </div>
    </div>
  )
}

export default StarReview


// 별점 기능
function StarRating({setStarState,rating, setRating}:any):JSX.Element {
  
  const [hover, setHover] = useState(null) as any
  setStarState(rating)

  return (
    <div className="flex">
      {[...Array(5)].map((star, idx)=> {
        const ratingValue = idx + 1
        return (
          <label>
            <input type="radio" name="rating" value={ratingValue} 
            onClick={()=> {
              setRating(ratingValue)
            }}
            />
            <FaStar className="star" color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'} size={15}
              onMouseEnter={()=> {setHover(ratingValue)}}
              onMouseLeave={()=> {setHover(null)}}
            />
          </label>
        )
      })}
    </div>
  )
}
