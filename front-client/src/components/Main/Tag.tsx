import axios from 'axios'
import {useEffect, useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import {
  changeCarouselState,
  changeMainCreateRoomList,
} from "../../store/store";
import styles from './Tag.module.css'
import "../Common/Common.css"
function Tag(): JSX.Element {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const username = localStorage.getItem('Username')
  const [filter, setFilter] = useState<any>({isAll:true ,age:'연령',region:'지역',theme:'테마',sul:'술',hobby:'태그', speedEnter: false})
  const [ageRegion, setAgeRegion] = useState<any>({age:null, region:null})
  const ageRef = useRef<any>(null)
  const regionRef = useRef<any>(null)
  const themeRef = useRef<any>(null)
  const sulRef = useRef<any>(null)
  const hobbyRef = useRef<any>(null)
   // 방 생성 관련
  const createBtn = useRef<any>(null);
  const mainCreateRoomCarouselCheck: any = useAppSelector(
    (state: any) => state.mainCreateRoomCarouselCheck
  );
   // 선택한 포차 테마 체크
  const createThemeRoomCheck: number = useAppSelector((state) => {
    return state.createThemeRoomCheck;
  });
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  // 유저 정보(연령, 지역)조사
  useEffect(()=> {
    
    axios({
      method: 'get',
      url:`https://i8e201.p.ssafy.io/api/user/info/${username}`,
      headers: {
        accessToken: `${accessToken}`,
      }
    })
    .then((r:any)=> {
      console.log(r.data)
      // 실패시
      if (r.data.status === '401') {
        axios({
          method: 'get',
          url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
          headers: {
            refreshToken: `${refreshToken}`,
          }
        }).then((r)=> {
          console.log('Tag의 r.data.status보자: ', r.data.status);
          console.log('Tag의 r.data보자: ', r.data);
          console.log('Tag의 r보자: ', r);
          
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
              url:`https://i8e201.p.ssafy.io/api/user/info/${username}`,
              headers: {
                accessToken: `${r.data.accessToken}`,
              }
            }).then((r)=> {
              const now = new Date()
              const nowYear = now.getFullYear()
              // 연령 파악
              let myAge:(number|string) = nowYear-Number(r.data.data.birth?.slice(0,4))
              // 지역 파악
              let myRegion = r.data.data.region.split(' ')[0]
              myAge = String(Math.floor(myAge/10)*10)+'대'
              setAgeRegion({age:myAge, region:myRegion})
            })
          }
        })
      } else {
        // 만료가 안됐을 경우
        const now = new Date()
        const nowYear = now.getFullYear()
        // 연령 파악
        let myAge:(number|string) = nowYear-Number(r.data.data.birth?.slice(0,4))
        // 지역 파악
        let myRegion = r.data.data.region.split(' ')[0]
        myAge = String(Math.floor(myAge/10)*10)+'대'
        setAgeRegion({age:myAge, region:myRegion})
      }
    })
  },[])
  
  // useEffect(()=> {
  //   if (mainCreateRoomCarouselCheck) {
  //     createBtn.current.classList.add("hidden");
  //   } else if (createThemeRoomCheck){
  //     createBtn.current.classList.add("hidden");
  //   } else {
  //     createBtn.current.classList.remove("hidden");
  //   }
  // })

  useEffect(()=> {
    console.log(ageRegion, setAgeRegion)
    console.log('갱신해따!!')
    if (filter.isAll) {
      console.log('원상복구')
      ageRef.current.value = '연령'
      regionRef.current.value = '지역'
      themeRef.current.value = '테마'
      sulRef.current.value = '술'
      hobbyRef.current.value = '태그'
      // 모든 포차 조회
      axios({
        method:'get',
        url: 'https://i8e201.p.ssafy.io/api/pocha/all',
        headers: {
          accessToken: `${accessToken}`,
        },
      }).then((r)=> {
        // 요청 실패했을 경우
        if (r.data.state === '401') {
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
              // accessToken 담아주고 재요청
              localStorage.setItem("accessToken", r.data.accessToken);
              axios({
                method:'get',
                url: 'https://i8e201.p.ssafy.io/api/pocha/all',
                headers: {
                  accessToken: `${r.data.accessToken}`,
                },
              }).then((r)=> {
                // 재요청 후 필터가 ALL이며 빠른 입장일 경우
                if (filter.speedEnter) {
                  const roomData:any[] = r.data.data
                  const enterPossibleRoomList:any[] = roomData.filter((data:any)=> {
                    return ((data.age === 0 || data.age === ageRegion.age) && (data.region === '전국' || data.region === ageRegion.region) && (data.themeId !== "T2B0") && (data.isPrivate === false) && (data.limitUser>data.totalCount))
                  })
                  // 입장 가능한 방을 랜덤으로 하나 골라서 
                  const randomPickRoom:any = enterPossibleRoomList[Math.floor(Math.random()*enterPossibleRoomList.length)]
                  // 입장 요청
                  const username = localStorage.getItem('Username')
                  console.log('픽한 방: ', randomPickRoom)
                  const themeId = randomPickRoom.themeId
                  const pochaId = randomPickRoom.pochaId
                  console.log('==============','username:', username, 'pochaId: ', pochaId, 'themeId: ', themeId)
                  axios({
                    method: 'post',
                    url: 'https://i8e201.p.ssafy.io/api/pocha/enter',
                    data: {
                      // 초대 받은거를 승인하는거라 false
                      isHost: 'false',
                      pochaId: pochaId,
                      username: username
                      },
                    headers: {
                      accessToken: `${localStorage.getItem("accessToken")}`,
                    },
                  })
                  .then((r)=> {
                    console.log('113번줄 tag 데이터값 : ',r.data);
                    
                    console.log('슬라이싱값: ',themeId.slice(0,2))
                    if (themeId.slice(0,2) === 'T0') {
                      console.log('소통방입장')
                      navigate(`/storyroom/${pochaId}`)
                    } else if (themeId.slice(0,2) === 'T1') {
                      console.log('게임방입장')
                      navigate(`/gameroom/${pochaId}`)
                    }
                  }).catch((e)=> {
                    console.log(e);
                  })
                } else {
                  const currenDataFirst = r.data.data.reverse()
                  // const currenDataFirst = r.data.data
                  console.log(r.data)
                  dispatch(changeMainCreateRoomList(currenDataFirst));
                }
              })
            }
          })
        } else {
          // 요청 실패하지 않았을 때
            if (filter.speedEnter) {
              const roomData:any[] = r.data.data
              const enterPossibleRoomList:any[] = roomData.filter((data:any)=> {
                return ((data.age === 0 || data.age === ageRegion.age) && (data.region === '전국' || data.region === ageRegion.region) && (data.themeId !== "T2B0") && (data.isPrivate === false) && (data.limitUser>data.totalCount))
              })
              // 입장 가능한 방을 랜덤으로 하나 골라서 
              const randomPickRoom:any = enterPossibleRoomList[Math.floor(Math.random()*enterPossibleRoomList.length)]
              // 입장 요청
              const username = localStorage.getItem('Username')
              console.log('픽한 방: ', randomPickRoom)
              const themeId = randomPickRoom.themeId
              const pochaId = randomPickRoom.pochaId
              console.log('==============','username:', username, 'pochaId: ', pochaId, 'themeId: ', themeId)
              axios({
                method: 'post',
                url: 'https://i8e201.p.ssafy.io/api/pocha/enter',
                data: {
                  // 초대 받은거를 승인하는거라 false
                  isHost: 'false',
                  pochaId: pochaId,
                  username: username
                  },
                headers: {
                  accessToken: `${accessToken}`,
                },
              })
              .then((r)=> {
                console.log('113번줄 tag 데이터값 : ',r.data);
                
                console.log('슬라이싱값: ',themeId.slice(0,2))
                if (themeId.slice(0,2) === 'T0') {
                  console.log('소통방입장')
                  navigate(`/storyroom/${pochaId}`)
                } else if (themeId.slice(0,2) === 'T1') {
                  console.log('게임방입장')
                  navigate(`/gameroom/${pochaId}`)
                }
              }).catch((e)=> {
                console.log(e);
              })
            } else {
              const currenDataFirst = r.data.data.reverse()
              // const currenDataFirst = r.data.data
              console.log(r.data)
              dispatch(changeMainCreateRoomList(currenDataFirst));
            }
        }
      }) 
    } else {
      // 필터가 isALL이 아닌 경우
      console.log('현재 클릭한 태그정보: ',filter)
      let age:any
      let region:any
      let theme:any
      let sul
      let hobby
      let fastClick
      const tagList:any[] = []
      for (const [key,value] of Object.entries(filter)) {
        if (key === 'age') {
          if ((value === '연령') || (value === 'ALL')) {
            age = 0
          } else {
            age = Number(ageRegion.age.slice(0,2))
          }
        } else if (key === 'region') {
            if ((value === '지역')||(value === '전국')) {
              region = '전국'
            } else {
              region = ageRegion.region
            }
        } else if (key === 'theme') {
            if ((value === '테마')||(value === '소통포차')) {
              theme = 'T0'
            } else if (value === '게임포차') {
              theme = 'T1'
            } else {
              theme = 'T2'
            }
        } else if (key === 'sul') {
            if (value === '술') {
              sul = null
            } else {
              sul = value
              tagList.push(value)
            }
        } else if (key === 'hobby') {
            if (value === '태그') {
              hobby = null
            } else {
              hobby = value
              tagList.push(value)
            }
        } else if (key === 'speedEnter') {
          fastClick = value
          
        }
        console.log(key,value)
      }
      // console.log('빠른입장 ',)
      console.log('포차 조사',filter.isAll,age,region,theme,sul,hobby, tagList,'빠른 입장 유무', fastClick)
      const sendTagList = tagList.join(',')
      // 선택한 태그에 따른 방 데이터 가져오기
      axios({
        method: 'get',
        url: 'https://i8e201.p.ssafy.io/api/pocha',
        params: {
          age:age, region:region,themeId:theme,tag:sendTagList
        },
        headers: {
          accessToken: `${accessToken}`,
        },
      }).then((r:any)=> {
        // 요청 실패시
        if (r.data.status === '401') {
          axios({
            method: 'get',
            url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${username}`,
            headers: {
              refreshToken: `${refreshToken}`,
            }
          }).then((r)=> {
            console.log('Tag의 326번줄: ', r.data.status);
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
                url: 'https://i8e201.p.ssafy.io/api/pocha',
                params: {
                  age:age, region:region,themeId:theme,tag:sendTagList
                },
                headers: {
                  accessToken: `${r.data.accessToken}`,
                },
              })
            }
          }).then((r:any)=> {
            if (filter.speedEnter) {
              // 전체로 선택되어있을 수도 있기에 조회된 방 데이터를 가지고 
              // 연령(All(0)||본인 연령(ageRegion.age)), 지역(전국,본인 지역(ageRegion.region)), 잠금여부, 인원수(입장가능한 인원수) 필터해서
              // 이후 해당 pochaId에 맞는 방으로 이동 (포차테마에 따라 다른 방으로 이동)
              const roomData:any[] = r.data.data
              
              const enterPossibleRoomList:any[] = roomData.filter((data:any)=> {
                console.log('방목록: ',data)
                return ((data.age === 0 || data.age === ageRegion.age) && (data.region === '전국' || data.region === ageRegion.region) && (data.themeId !== "T2B0") && (data.isPrivate === false) && (data.limitUser>data.totalCount))
              })
              
              // 입장 가능한 방을 랜덤으로 하나 골라서 
              const randomPickRoom:any = enterPossibleRoomList[Math.floor(Math.random()*enterPossibleRoomList.length)]
              // 입장 요청
              const username = localStorage.getItem('Username')
              console.log('픽한 방: ', randomPickRoom)
              const themeId = randomPickRoom.themeId
              const pochaId = randomPickRoom.pochaId
              console.log('==============','username:', username, 'pochaId: ', pochaId, 'themeId: ', themeId)
              axios({
                method: 'post',
                url: 'https://i8e201.p.ssafy.io/api/pocha/enter',
                data: {
                  // 초대 받은거를 승인하는거라 false
                  isHost: 'false',
                  pochaId: pochaId,
                  username: username
                  },
                  headers: {
                    accessToken: `${localStorage.getItem("accessToken")}`,
                  }
                })
                .then(()=> {
                  console.log('슬라이싱값: ',themeId.slice(0,2))
                  if (themeId.slice(0,2) === 'T0') {
                    console.log('소통방입장')
                    navigate(`/storyroom/${pochaId}`)
                  } else if (themeId.slice(0,2) === 'T1') {
                    console.log('게임방입장')
                    navigate(`/gameroom/${pochaId}`)
                  }
                })
    
            } else {
              console.log("스피드 아님")
              console.log('태그에 넣으려는 값: ', r.data.data)
              console.log('태그에 넣으려는 값: ', r.data)
              // 그냥 방 해당 태그에 맞게 갱신해주기
              dispatch(changeMainCreateRoomList(r.data.data));
              console.log(r.data)
            }
          })
        } else {
          if (filter.speedEnter) {
            // 전체로 선택되어있을 수도 있기에 조회된 방 데이터를 가지고 
            // 연령(All(0)||본인 연령(ageRegion.age)), 지역(전국,본인 지역(ageRegion.region)), 잠금여부, 인원수(입장가능한 인원수) 필터해서
            // 이후 해당 pochaId에 맞는 방으로 이동 (포차테마에 따라 다른 방으로 이동)
            const roomData:any[] = r.data.data
            
            const enterPossibleRoomList:any[] = roomData.filter((data:any)=> {
              console.log('방목록: ',data)
              return ((data.age === 0 || data.age === ageRegion.age) && (data.region === '전국' || data.region === ageRegion.region) && (data.themeId !== "T2B0") && (data.isPrivate === false) && (data.limitUser>data.totalCount))
            })
            
            // 입장 가능한 방을 랜덤으로 하나 골라서 
            const randomPickRoom:any = enterPossibleRoomList[Math.floor(Math.random()*enterPossibleRoomList.length)]
            // 입장 요청
            const username = localStorage.getItem('Username')
            console.log('픽한 방: ', randomPickRoom)
            const themeId = randomPickRoom.themeId
            const pochaId = randomPickRoom.pochaId
            console.log('==============','username:', username, 'pochaId: ', pochaId, 'themeId: ', themeId)
            axios({
              method: 'post',
              url: 'https://i8e201.p.ssafy.io/api/pocha/enter',
              data: {
                // 초대 받은거를 승인하는거라 false
                isHost: 'false',
                pochaId: pochaId,
                username: username
                },
                headers: {
                  accessToken: `${accessToken}`,
                }
              })
              .then(()=> {
                console.log('슬라이싱값: ',themeId.slice(0,2))
                if (themeId.slice(0,2) === 'T0') {
                  console.log('소통방입장')
                  navigate(`/storyroom/${pochaId}`)
                } else if (themeId.slice(0,2) === 'T1') {
                  console.log('게임방입장')
                  navigate(`/gameroom/${pochaId}`)
                }
              })
  
          } else {
            console.log("스피드 아님")
            // 그냥 방 해당 태그에 맞게 갱신해주기
            dispatch(changeMainCreateRoomList(r.data.data));
            console.log(r.data)
          }
        }

    })
  }},[filter])


  return (
    <>
    
      <div className='flex flex-col justify-end '>
      <div className='h-[100%] grid' style={{gridTemplateRows: '1fr 0.8fr'}}>
        <div className='flex justify-start items-end h-full pl-[2.5rem]'>
          <span className='text-5xl text-white font-extrabold '>일취월장&nbsp;</span><span className='text-lg font-bold text-yellow-500'>홈술 환영</span>
        </div>
        <div className='flex justify-start items-center h-full pl-[2.9rem]'>
          <span className='text-white font-semibold text-lg '>일요일날 취하면 월요일날 장난 아님</span>
        </div>
      </div>
      <div className="grid w-full min-w-[75rem] h-[40%] pb-5" style={{gridTemplateColumns:'7fr 5fr', backgroundColor: "rgb(25, 25, 25)"}}>
        <div className="grid items-end w-full h-full text-white" style={{gridTemplateColumns:'2.5rem 0.7fr 1fr 1fr 1fr 1fr 1fr'}}>
          <div className="flex justify-center items-center font-normal ml-2 "> &nbsp;&nbsp;&nbsp;&nbsp;</div>
          {/* All */}
          <div className={`flex justify-center items-center font-normal rounded-full ml-auto w-[85%] h-[2rem] ${styles.tagBtn}`}>
            <select className={`hoverTextColor flex text-center justify-center items-center font-bold text-lg border-0 rounded-full ml-auto h-[2rem] w-full cursor-pointer  ${styles.tagSelect}`} onClick={()=> {
                setFilter((preState:any)=> {
                  return {...preState, isAll:true, age:'연령',region:'지역',theme:'테마',sul:'술',hobby:'태그', speedEnter: false}
                })
              }}>
                <option className='text-center' value="전체" selected disabled hidden> 전체 </option>
                
            </select>
          </div>
          {/* 연령 */}
          <div className={`flex justify-center items-center font-normal rounded-full ml-auto w-[85%] h-[2rem] ${styles.tagBtn} `}>
            <select ref={ageRef} className={`hoverTextColor flex justify-center font-bold text-lg items-center w-full rounded-full h-full cursor-pointer ${styles.tagSelect}`} name="" id="" onChange={(e)=> {
              setFilter((preState:any)=> {
                return {...preState, isAll:false, age: e.target.value}
              } )
            }}>
              <option className={`text-center rounded-full`} style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="연령" selected>연령</option>
              <option className={`text-center rounded-full`} style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="ALL">ALL</option>
              <option className={`text-center rounded-full`} style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value={ageRegion.age}>{ageRegion.age}</option>
            </select>
          </div>
          {/* 지역 */}
          <div className={`flex justify-center items-center font-normal border-2 rounded-full ml-auto w-[85%] h-[2rem] ${styles.tagBtn}`}>
            <select ref={regionRef} className={`hoverTextColor flex justify-center font-bold text-lg items-center  w-full rounded-full h-full cursor-pointer ${styles.tagSelect}`} name="" id="" onChange={(e)=> {
              setFilter((preState:any)=> {
                return {...preState, isAll:false ,region: e.target.value}
              } )
            }}>
              <option className="text-center rounded-full" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="지역">지역</option>
              <option className="text-center rounded-full" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="전국">전국</option>
              <option className="text-center rounded-full" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value={ageRegion.region}>{ageRegion.region}</option>
            </select>
          </div>
          {/* 테마 */}
          <div className={`flex justify-center items-center font-normal border-2 rounded-full ml-auto w-[85%] h-[2rem] ${styles.tagBtn}`}>
            <select ref={themeRef} className={`hoverTextColor flex justify-center font-bold text-lg items-center w-full rounded-full h-full cursor-pointer ${styles.tagSelect}`} name="" id=""  onChange={(e)=> {
              setFilter((preState:any)=> {
                return {...preState, isAll:false ,theme: e.target.value}
              } )
            }}>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="테마">테마</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="소통포차">소통포차</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="게임포차">게임포차</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="미팅포차">미팅포차</option>
            </select>
          </div>
          {/* 술 종류 */}
          <div className={`flex justify-center items-center font-normal border-2 rounded-full ml-auto w-[85%] h-[2rem] ${styles.tagBtn}`}>
            <select ref={sulRef} className={`hoverTextColor flex justify-center items-center font-bold text-lg w-full rounded-full h-full cursor-pointer ${styles.tagSelect}`} name="" id=""  onChange={(e)=> {
              setFilter((preState:any)=> {
                return {...preState, isAll:false ,sul: e.target.value}
              } )
            }}>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="술">술</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="소주">소주</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="맥주">맥주</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="와인">와인</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="위스키">위스키</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="보드카">보드카</option>
            </select>
          </div>
          <div className={`flex justify-center items-center font-normal border-2 rounded-full ml-auto w-[85%] h-[2rem] ${styles.tagBtn}`}>
            <select ref={hobbyRef} className={`hoverTextColor flex justify-center items-center font-bold text-lg  w-full rounded-full h-full cursor-pointer ${styles.tagSelect}`} name="" id=""  onChange={(e)=> {
              setFilter((preState:any)=> {
                return {...preState, isAll:false ,hobby: e.target.value}
              } )
            }}>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="태그">태그</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="애니메이션">애니메이션</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="게임">게임</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="연애">연애</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="영화">영화</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="음악">음악</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="연예인">연예인</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="직장">직장</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="잡담">잡담</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="운동">운동</option>
              <option className="text-center" style={{backgroundColor: 'rgb(25, 25, 25)', color: 'white'}} value="축구">축구</option>
            </select>
          </div>
        </div>
        <div className={`fixed flex flex-col justify-end items-end rounded-[1.25rem] bg-[#FFEE58] w-[12rem] h-[7.3rem] bottom-12 right-12 text-xl font-black text-[#5E2F00] ${styles.tagBtn}`}>
          <div className={`flex justify-center items-center w-[60%] mx-auto h-full `} style={{borderBottom: 'solid 2px white'}} onClick={()=> {
            setFilter((preState:any)=> {
              return {...preState, speedEnter: true}
            })
            }}>
              <span className={`cursor-pointer ${styles.tagFixed}`}>빠른 입장</span>
          </div>
          {/* 방 생성 버튼 */}
          <div
            ref={createBtn}
            onClick={() => {
              dispatch(changeCarouselState());
              // onClickHiddenBtn();
            }}
            className={`flex justify-center items-center w-[60%] mx-auto h-full cursor-pointer`}
          >
            <span className={`cursor-pointer ${styles.tagFixed}`}>포차 생성</span>
          </div>

        </div>
      </div>
    </div>
    </>
    
  )
}

export default Tag