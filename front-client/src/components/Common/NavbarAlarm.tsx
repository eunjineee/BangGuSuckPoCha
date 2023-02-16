import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { changeMenuState, changeAlarmClickState, changeAlarmApiDataState } from "../../store/store";
import AlarmRequest from "./AlarmRequest";
import "./NavbarAlarm.css"
import "./Common.css"
function NavbarAlarm(): JSX.Element {

  let dispatch = useAppDispatch();
  const navigate = useNavigate()

  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  // username (현재는 내꺼)
  const username = localStorage.getItem('Username')

  const alarmIcon = useRef<any>(null);
  const resetIcon = useRef<any>(null);
  // 알람 클릭 상태
  const alarmClickCheck: any = useAppSelector((state: any) => {
    return state.alarmClickCheck;
  });
  // 메뉴 클릭 상태
  const menuClickCheck: any = useAppSelector((state: any) => {
    return state.menuClickCheck;
  });
  const alarmClickState = useAppSelector((state:any)=> {return state.alarmClickState})

  // 알람 클릭시 조건 분기
  useEffect(()=> {
    if ((alarmClickCheck) && (menuClickCheck)) {
      dispatch(changeMenuState())
      alarmIcon.current.classList.remove("hidden");
    } else if (alarmClickCheck) {
      alarmIcon.current.classList.remove("hidden");
    } else if (!(alarmClickCheck)) {
      alarmIcon.current.classList.add("hidden");
    } 
  }, [alarmClickCheck])
  

  function handleReset() {
    resetIcon.current.classList.add('reset_cycle')
    setTimeout(() => {
      resetIcon.current.classList.remove('reset_cycle')
    }, 600);
    
  }

  return (
    <div ref={alarmIcon} className={`absolute w-[16rem] `} style={{ right: "4.8rem", top: "11.5rem", height: "35.2rem"}}>
      <div className="grid h-full w-full rounded-3xl bg-black text-white" style={{gridTemplateRows: '0.5fr 0.5fr 5fr' }}>
        <div className="grid" style={{gridTemplateColumns: '2fr 1fr 1fr 1fr'}}>
          <div></div>
          <div className="flex justify-center items-center basicTextColor">알람</div>
          <div></div>
          {/* 새로고침 */}
          <div className="flex justify-center items-center cursor-pointer">
            <img ref={resetIcon} className={`h-[40%] `} src={require('../../assets/NavIcon/reset.png')} alt="" onClick={()=> {
              handleReset()
              if (alarmClickState === 0) {
                axios({
                  method:'get',
                  url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`,
                  headers: {
                    accessToken: `${accessToken}`,
                  },
                })
                .then((r)=> {
                   // 요청 실패했을 경우
                  if (r.data.state === '401') {
                    axios({
                      method: 'get',
                      url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
                      headers: {
                        refreshToken: `${refreshToken}`,
                      }
                    }).then((r)=> {
                      if (r.data.status === '401') {
                        localStorage.clear();
                        toast.error('인증되지 않은 유저입니다')
                        navigate('/')
                      } else {
                        // accessToken 담아주고 재요청
                        localStorage.setItem("accessToken", r.data.accessToken);
                        // 재요청
                        axios({
                          method:'get',
                          url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`,
                          headers: {
                            accessToken: `${r.data.accessToken}`,
                          },
                        }).then((r)=> {
                          // 요청 보낸 유저Id에 따른 중복제거 후 데이터 보내기
                          const checkFrom_id:number[] = []
                          const setData:(number|string)[] = []
                          const data:(number|string)[] = r.data.data
                          data.forEach((e:any)=> {
                            if (checkFrom_id.includes(e.from_id)!== true) {
                              checkFrom_id.push(e.from_id)
                              setData.push(e)
                            }
                          })
                          dispatch(changeAlarmClickState(0))
                          dispatch(changeAlarmApiDataState(setData))
                        })
                      }
                    })
                  } else {
                    // 요청 보낸 유저Id에 따른 중복제거 후 데이터 보내기
                    const checkFrom_id:number[] = []
                    const setData:(number|string)[] = []
                    const data:(number|string)[] = r.data.data
                    data.forEach((e:any)=> {
                      if (checkFrom_id.includes(e.from_id)!== true) {
                        checkFrom_id.push(e.from_id)
                        setData.push(e)
                      }
                    })
                    dispatch(changeAlarmClickState(0))
                    dispatch(changeAlarmApiDataState(setData))
                  }
                })
              } else if (alarmClickState === 1) {
                axios({
                  method:'get',
                  url: `https://i8e201.p.ssafy.io/api/pocha/invite/${username}`,
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
                          method:'get',
                          url: `https://i8e201.p.ssafy.io/api/pocha/invite/${username}`,
                          headers: {
                            accessToken: `${r.data.accessToken}`,
                          },
                        }).then((r)=> {
                          // 포차Id에 따른 중복제거 후 데이터 보내기
                          const checkpochaId:number[] = []
                          const setData:(number|string)[] = []
                          const data:(number|string)[] = r.data.data
                          data.forEach((e:any)=> {
                            if (checkpochaId.includes(e.pochaId)!== true) {
                              checkpochaId.push(e.pochaId)
                              setData.push(e)
                            }
                          })
                          dispatch(changeAlarmClickState(1))
                          dispatch(changeAlarmApiDataState(setData))
                        })
                      }
                    })
                  } else {
                    // 포차Id에 따른 중복제거 후 데이터 보내기
                    const checkpochaId:number[] = []
                    const setData:(number|string)[] = []
                    const data:(number|string)[] = r.data.data
                    data.forEach((e:any)=> {
                      if (checkpochaId.includes(e.pochaId)!== true) {
                        checkpochaId.push(e.pochaId)
                        setData.push(e)
                      }
                    })
                    dispatch(changeAlarmClickState(1))
                    dispatch(changeAlarmApiDataState(setData))
                  }
                })
              } else if (alarmClickState === 2) {
                axios({
                  method: 'get',
                  url: `https://i8e201.p.ssafy.io/api/user/review/${username}`,
                  headers: {
                    accessToken: `${accessToken}`,
                  },
                })
                .then((r)=>{
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
                          method: 'get',
                          url: `https://i8e201.p.ssafy.io/api/user/review/${username}`,
                          headers: {
                            accessToken: `${r.data.accessToken}`,
                          },
                        }).then((r)=> {
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
                          dispatch(changeAlarmClickState(2))
                          dispatch(changeAlarmApiDataState(Beforedata))
                        })
                      }
                    })
                  } else {
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
                    dispatch(changeAlarmClickState(2))
                    dispatch(changeAlarmApiDataState(Beforedata))
                  }
                })
              }
            }}/>
          </div>
        </div>
        {/* 요청 */}
        <div className="grid" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
          <div className="flex justify-center items-center cursor-pointer hoverTextColor" onClick={()=> {
            axios({
              method:'get',
              url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`,
              headers: {
                accessToken: `${accessToken}`,
              },
            })
            .then((r)=> {
               // 요청 실패했을 경우
              if (r.data.state === '401') {
                axios({
                  method: 'get',
                  url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
                  headers: {
                    refreshToken: `${refreshToken}`,
                  }
                }).then((r)=> {
                  if (r.data.status === '401') {
                    localStorage.clear();
                    toast.error('인증되지 않은 유저입니다')
                    navigate('/')
                  } else {
                    // accessToken 담아주고 재요청
                    localStorage.setItem("accessToken", r.data.accessToken);
                    // 재요청
                    axios({
                      method:'get',
                      url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`,
                      headers: {
                        accessToken: `${r.data.accessToken}`,
                      },
                    }).then((r)=> {
                      // 요청 보낸 유저Id에 따른 중복제거 후 데이터 보내기
                      const checkFrom_id:number[] = []
                      const setData:(number|string)[] = []
                      const data:(number|string)[] = r.data.data
                      data.forEach((e:any)=> {
                        if (checkFrom_id.includes(e.from_id)!== true) {
                          checkFrom_id.push(e.from_id)
                          setData.push(e)
                        }
                      })
                      dispatch(changeAlarmClickState(0))
                      dispatch(changeAlarmApiDataState(setData))
                    })
                  }
                })
              } else {
                // 요청 보낸 유저Id에 따른 중복제거 후 데이터 보내기
                const checkFrom_id:number[] = []
                const setData:(number|string)[] = []
                const data:(number|string)[] = r.data.data
                data.forEach((e:any)=> {
                  if (checkFrom_id.includes(e.from_id)!== true) {
                    checkFrom_id.push(e.from_id)
                    setData.push(e)
                  }
                })
                dispatch(changeAlarmClickState(0))
                dispatch(changeAlarmApiDataState(setData))
              }
            })
          }}>요청</div>
          {/* 초대 */}
          <div className="flex justify-center items-center cursor-pointer hoverTextColor" onClick={()=> {
            axios({
              method:'get',
              url: `https://i8e201.p.ssafy.io/api/pocha/invite/${username}`,
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
                      method:'get',
                      url: `https://i8e201.p.ssafy.io/api/pocha/invite/${username}`,
                      headers: {
                        accessToken: `${r.data.accessToken}`,
                      },
                    }).then((r)=> {
                      // 포차Id에 따른 중복제거 후 데이터 보내기
                      const checkpochaId:number[] = []
                      const setData:(number|string)[] = []
                      const data:(number|string)[] = r.data.data
                      data.forEach((e:any)=> {
                        if (checkpochaId.includes(e.pochaId)!== true) {
                          checkpochaId.push(e.pochaId)
                          setData.push(e)
                        }
                      })
                      dispatch(changeAlarmClickState(1))
                      dispatch(changeAlarmApiDataState(setData))
                    })
                  }
                })
              } else {
                // 포차Id에 따른 중복제거 후 데이터 보내기
                const checkpochaId:number[] = []
                const setData:(number|string)[] = []
                const data:(number|string)[] = r.data.data
                data.forEach((e:any)=> {
                  if (checkpochaId.includes(e.pochaId)!== true) {
                    checkpochaId.push(e.pochaId)
                    setData.push(e)
                  }
                })
                dispatch(changeAlarmClickState(1))
                dispatch(changeAlarmApiDataState(setData))
              }
            })
          }}>초대</div>
          {/* review_at이 null 값인 리뷰 목록을 보이도록 하기 */}
          <div className="flex justify-center items-center cursor-pointer hoverTextColor" onClick={()=> {
            axios({
              method: 'get',
              url: `https://i8e201.p.ssafy.io/api/user/review/${username}`,
              headers: {
                accessToken: `${accessToken}`,
              },
            })
            .then((r)=>{
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
                      method: 'get',
                      url: `https://i8e201.p.ssafy.io/api/user/review/${username}`,
                      headers: {
                        accessToken: `${r.data.accessToken}`,
                      },
                    }).then((r)=> {
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
                      dispatch(changeAlarmClickState(2))
                      dispatch(changeAlarmApiDataState(Beforedata))
                    })
                  }
                })
              } else {
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
                dispatch(changeAlarmClickState(2))
                dispatch(changeAlarmApiDataState(Beforedata))
              }
            })
          }}>리뷰</div>
        </div>
        <AlarmRequest />
        <div></div>
      </div>
      
    </div>
  );
}
export default NavbarAlarm;
