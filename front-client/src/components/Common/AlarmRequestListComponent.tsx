import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { changeAlarmApiDataState, changeAlarmClickState } from "../../store/store";
import styles from './Common.module.css'

// 요청리스트
function RequestListComponent({from_nickname,sentence,invite_id,pocha_id,f_request_id}:any):JSX.Element {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const username = localStorage.getItem('Username')
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const alarmClickState = useAppSelector((state:any)=> {return state.alarmClickState})
  console.log('포차번호',pocha_id, '초대번호',invite_id );
  
  return (
    <div className={`grid h-[4rem] w-full ${styles.shortBorder}`} style={{gridTemplateRows: '1fr 0.8fr' }}>
      <div className="flex justify-start items-center h-full w-[95%] ml-[5%] text-lg font-normal"><span className={`${styles.nickNameNeon}`}>{from_nickname}</span></div>
      <div className="grid" style={{gridTemplateColumns: '3fr 1fr'}}>
        <div className="flex justify-start items-center h-full w-[92%] ml-[8%] text-xs"><span className={`${styles.sentenceNeon}`}>님에게 {sentence} 왔습니다</span></div>
        <div className="grid" style={{gridTemplateColumns: '1fr 1fr'}}>
          <div className="flex justify-center items-center cursor-pointer">
            <img className="flex justify-center items-center h-[60%]" src={require('../../assets/roomIcon/check.png')} alt="" 
            onClick={()=> {
              // 승인했을때
              if (alarmClickState === 0) {
                  axios({
                    method: 'post',
                    url: `https://i8e201.p.ssafy.io/api/user/friend/accept/${f_request_id}`,
                    headers: {
                      accessToken: `${accessToken}`,
                    },
                  })
                  .then((r)=> {
                    if (r.data.status === '401') {
                      axios({
                        method: 'get',
                        url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
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
                            method: 'post',
                            url: `https://i8e201.p.ssafy.io/api/user/friend/accept/${f_request_id}`,
                            headers: {
                              accessToken: `${r.data.accessToken}`,
                            },
                          }).then((r)=> {
                            axios({
                              method:'get',
                              url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`,
                              headers: {
                                accessToken: `${localStorage.getItem("accessToken")}`,
                              },
                            })
                            .then((r)=> {
                              dispatch(changeAlarmApiDataState(r.data.data))
                              toast.success("요청을 승인하였습니다");
                            })
                          })
                        }
                      })
                    } else {
                        axios({
                          method:'get',
                          url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`,
                          headers: {
                            accessToken: `${accessToken}`,
                          },
                        })
                        .then((r)=> {
                          dispatch(changeAlarmApiDataState(r.data.data))
                          toast.success("요청을 승인하였습니다");
                        })
                      } 
                    })
              } else if (alarmClickState === 1) {
                axios({
                  method: 'post',
                  url: `https://i8e201.p.ssafy.io/api/pocha/invite/accept/${invite_id}/${pocha_id}`,
                  headers: {
                    accessToken: `${accessToken}`,
                  },
                })
                .then((r)=> {
                  // 갱신이 필요할 때 
                  if (r.data.status === '401') {
                    axios({
                      method: 'get',
                      url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
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
                        // 다시 처음 요청하기
                        // 엑세스 토큰 추가
                        localStorage.setItem("accessToken", r.data.accessToken);
                        // 재요청
                        axios({
                          method: 'post',
                          url: `https://i8e201.p.ssafy.io/api/pocha/invite/accept/${invite_id}/${pocha_id}`,
                          headers: {
                            accessToken: `${r.data.accessToken}`,
                          },
                        }).then((r)=> {
                          console.log('초대 승인해따', r.data.data);
                          // 못들어 갈 경우
                          if (r.data.message === 'fail') {
                            toast.error('만료된 요청입니다')
                            // 다시 데이터 갱신시켜주기
                            axios({
                              method:'get',
                              url: `https://i8e201.p.ssafy.io/api/pocha/invite/${username}`,
                              headers: {
                                accessToken: `${localStorage.getItem("accessToken")}`,
                              },
                            })
                            .then((r)=> {
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
                          } else {
                            console.log('현재 방 데이터: ', r.data.data);
                            const myAge = Number(localStorage.getItem('age'))
                            const myRegion = localStorage.getItem('region')
                            // 요청에 성공해서 들어가려고 할 때
                            const e = r.data.data
                            const pochaId = e.pochaId
                            const themeId = e.themeId.slice(0,2) 
                            const age = e.age
                            const region = e.region
                            // const isPrivate = e.isPrivate
                            const limitUser = e.limitUser
                            const totalCount = e.totalCount

                            // 헌팅방 입장
                            if (themeId === 'T2') {
                              toast.error('입장할 수 없는 방입니다')
                            } else {
                                // 소통&게임방
                                // 나이,지역,잠금,총인원수 체크
                                if ((age===0 || age===myAge) && (region === '전국' || region === myRegion) 
                                  && (limitUser > totalCount)) {
                                    axios({
                                      method: 'post',
                                      url: 'https://i8e201.p.ssafy.io/api/pocha/enter',
                                      data: {
                                        isHost: false,
                                        pochaId: pochaId,
                                        username: username,
                                      },
                                      headers: {
                                        accessToken: `${localStorage.getItem("accessToken")}`,
                                      },
                                    }).then(()=> {
                                      if (themeId === 'T0') {
                                        navigate(`/storyroom/${pochaId}`);
                                      } else if (themeId === 'T1') {
                                          navigate(`/gameroom/${pochaId}`);
                                        } 
                                    })
                                } else {
                                  toast.error('입장할 수 없는 방입니다')
                                }
                            }
                          }
                        })                     
                        }                    
                      })                
                    } else {
                      // 갱신이 필요 없을 때 
                      console.log('초대 승인해따', r.data.data);
                      // 못들어 갈 경우
                      if (r.data.message === 'fail') {
                        toast.error('만료된 요청입니다')
                        // 다시 데이터 갱신시켜주기
                        axios({
                          method:'get',
                          url: `https://i8e201.p.ssafy.io/api/pocha/invite/${username}`,
                          headers: {
                            accessToken: `${accessToken}`,
                          },
                        })
                        .then((r)=> {
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
                      } else {
                        console.log('현재 방 데이터: ', r.data.data);
                        const myAge = Number(localStorage.getItem('age'))
                        const myRegion = localStorage.getItem('region')
                        // 요청에 성공해서 들어가려고 할 때
                        const e = r.data.data
                        const pochaId = e.pochaId
                        const themeId = e.themeId.slice(0,2) 
                        const age = e.age
                        const region = e.region
                        // const isPrivate = e.isPrivate
                        const limitUser = e.limitUser
                        const totalCount = e.totalCount

                        // 헌팅방 입장
                        if (themeId === 'T2') {
                          toast.error('입장할 수 없는 방입니다')
                        } else {
                            // 소통&게임방
                            // 나이,지역,잠금,총인원수 체크
                            if ((age===0 || age===myAge) && (region === '전국' || region === myRegion) 
                              && (limitUser > totalCount)) {
                                axios({
                                  method: 'post',
                                  url: 'https://i8e201.p.ssafy.io/api/pocha/enter',
                                  data: {
                                    isHost: false,
                                    pochaId: pochaId,
                                    username: username,
                                  },
                                  headers: {
                                    accessToken: `${accessToken}`,
                                  },
                                }).then(()=> {
                                  if (themeId === 'T0') {
                                    navigate(`/storyroom/${pochaId}`);
                                  } else if (themeId === 'T1') {
                                      navigate(`/gameroom/${pochaId}`);
                                    } 
                                })
                            } else {
                              toast.error('입장할 수 없는 방입니다')
                            }
                        }
                      }
                    }
                  })
                }
              }}/>
          </div>
          {/* 여기서부터 하기 */}
          {/* 거절했을때 */}
          <div className="flex justify-center items-center cursor-pointer">
            <img className="flex justify-center items-center h-[60%]" src={require('../../assets/roomIcon/cancel.png')} alt="" 
            onClick={()=> {
              if (alarmClickState === 0) {
                axios({
                  method: 'delete',
                  url: `https://i8e201.p.ssafy.io/api/user/friend/refuse/${f_request_id}`,
                  headers: {
                    accessToken: `${accessToken}`,
                  },
                })
                .then((r)=> {
                  // 갱신이 필요할 때 
                  if (r.data.status === '401') {
                    axios({
                      method: 'get',
                      url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
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
                        // 원래 작동 순서
                        localStorage.setItem("accessToken", r.data.accessToken);
                        axios({
                          method: 'delete',
                          url: `https://i8e201.p.ssafy.io/api/user/friend/refuse/${f_request_id}`,
                          headers: {
                            accessToken: `${r.data.accessToken}`,
                          },
                        }).then((r)=> {
                          axios({
                            method:'get',
                            url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`,
                            headers: {
                              accessToken: `${localStorage.getItem("accessToken")}`,
                            },
                          })
                          .then((r)=> {
                            dispatch(changeAlarmApiDataState(r.data.data))
                            toast.success("요청을 거절하였습니다.");
                          })
                        })
                      }        
                    })
                  } else {
                    // 토큰에 문제 없을 때
                    axios({
                      method:'get',
                      url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`,
                      headers: {
                        accessToken: `${accessToken}`,
                      },
                    })
                    .then((r)=> {
                      dispatch(changeAlarmApiDataState(r.data.data))
                      toast.success("요청을 거절하였습니다.");
                    })
                  }
                })
                // 1번 클릭시
              } else if (alarmClickState === 1) {
                axios({
                  method: 'delete',
                  url: `https://i8e201.p.ssafy.io/api/pocha/invite/refuse/${invite_id}`,
                  headers: {
                    accessToken: `${accessToken}`,
                  },
                })
                .then((r)=> {
                  if (r.data.status === '401') {
                    axios({
                      method: 'get',
                      url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
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
                          method: 'delete',
                          url: `https://i8e201.p.ssafy.io/api/pocha/invite/refuse/${invite_id}`,
                          headers: {
                            accessToken: `${r.data.accessToken}`,
                          },
                        }).then((r)=> {
                          axios({
                            method:'get',
                            url: `https://i8e201.p.ssafy.io/api/pocha/invite/${username}`,
                            headers: {
                              accessToken: `${localStorage.getItem("accessToken")}`,
                            },
                          })
                          .then((r)=> {
                            dispatch(changeAlarmClickState(1))
                            dispatch(changeAlarmApiDataState(r.data.data))
                            toast.success("요청을 거절하였습니다.");
                          })
                        })
                      }      
                    })
                  } else {
                    // 토큰에 문제 없을 때
                    axios({
                      method:'get',
                      url: `https://i8e201.p.ssafy.io/api/pocha/invite/${username}`,
                      headers: {
                        accessToken: `${accessToken}`,
                      },
                    })
                    .then((r)=> {
                      dispatch(changeAlarmClickState(1))
                      dispatch(changeAlarmApiDataState(r.data.data))
                      toast.success("요청을 거절하였습니다.");
                    })
                  }
                })
              }
            }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default RequestListComponent