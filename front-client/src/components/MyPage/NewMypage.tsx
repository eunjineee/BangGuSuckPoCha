import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import FriendChat from "../Common/FriendChat";
import FriendList from "../Common/FriendList";
import Navbar from "../Common/Navbar";
import ProfileSelectModal from "./ProfileSelectModal";
import SecessionModal from "./SecessionModal";
import ProfileImg from "./ProfileImg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  changeMyInfo,
  changeMyPageProfile,
  showMyPageProfileSelect,
  showSecessionModal,
} from "src/store/store";
import Loading from "../Common/Loading";
import { toast } from "react-toastify";
import NavbarMenu from "../Common/NavbarMenu";
import NavbarAlarm from "../Common/NavbarAlarm";
import { log } from "console";

const NewMyPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  let accessToken = localStorage.getItem("accessToken");
  let refreshToken = localStorage.getItem("refreshToken");
  const Username: any = localStorage.getItem("Username");

  //--------------useState-------------------
  //내 정보
  const [MyInfo, setMyInfo] = useState<any>();

  //로딩변경
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //바뀔이름
  const [ModifyNickname, setModifyNickname] = useState<any>();
  //내 닉네임 변동X
  const [MyNickname, setMyNickname] = useState();

  //본인만나이
  const [age, setAge] = useState<any | null>();

  //자기소개
  const [comment, setComment] = useState();

  //내정보 지역코드
  const [MyRegionCode, setMyRegionCode] = useState();

  //첫번째 Select박스가 선택되었다는 것을 알릴 state
  const [isSelected, setIsSelected] = useState<any>("false");

  //첫번째 Select박스에 보일 state
  const [SelectedFirst, setSelectedFirst] = useState<any>();

  //두번째 Select박스에 보일 state
  const [SelectedSecond, setSelectSecond] = useState<any>();

  //광역시를 담을 state
  const [city, setCity] = useState<any>();

  //지역코드 전체 목록(시도)
  const [RegionlistFirst, setRegionlistFirst] = useState<any | null>();

  //지역코드 전체 목록(구군)
  const [RegionlistSecond, setRegionlistSecond] = useState<any | null>();

  //중복확인되면 수정가능하도록
  const [modifydisplay, setModifydisplay] = useState();

  //------------함수------------------------
  //  메뉴 -> 친구 클릭 -> 채팅 상태
  const menuFriendChatClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendChatClickCheck;
  });
  // 탈퇴 확인 모달 상태 체크
  const SecessionClickCheck = useAppSelector((state) => {
    return state.SecessionClickCheck;
  });

  // 프로필 설정 클릭 체크
  const MyPageProfileClickCheck = useAppSelector((state) => {
    return state.MyPageProfileClickCheck;
  });

  //내 프로필 이미지 경로
  const MyPageProfileImg = useAppSelector((state) => {
    return state.SelectProfile;
  });

  // 닉네임 변경 함수
  const onChangeNikename = (event: any) => {
    setModifyNickname(event.target.value);
  };

  //코멘트 변경
  const onChangeComment = (event: any) => {
    // console.log(event.target.value);
    setComment(event.target.value);
  };

  // 탈퇴 묻는 모달 띄우기
  const clickSecession = () => {
    dispatch(showSecessionModal());
  };

  const handleSelect = (event: any) => {
    setSelectedFirst(event.target.value);
    let TempSelete = false;
    city.map((it: any): any => {
      if (it.regionCode === event.target.value) {
        console.log("대도시랑 같네?");
        TempSelete = true;
      }
    });

    setIsSelected(TempSelete);
  };

  const handleSelectSecond = (event: any) => {
    // console.log(event.target.value);
    setSelectSecond(event.target.value);
  };

  const duffle = () => {
    axios({
      method: "post",
      url: `https://i8e201.p.ssafy.io/api/user/auth/check/nickname`,
      data: {
        changeName: ModifyNickname,
        nowName: MyNickname,
      },
      headers: {
        accessToken: accessToken,
      },
    }).then((r) => {
      console.log("음 토큰이 이상하려나?", r.data);
      if ("401" === r.data.status) {
        console.log("토큰 맛탱이 갔네 재발급 ㄱㅈㅇ");
        axios({
          method: "get",
          url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
          headers: {
            refreshToken: refreshToken,
          },
        }).then((r) => {
          console.log("해치웠나?", r.data);
          if ("401" === r.data.status) {
            localStorage.clear();
            toast.error("인증되지 않은 유저입니다");
            navigate("/");
          } else {
            localStorage.setItem("accessToken", r.data.accessToken);
            accessToken = r.data.accessToken;
            axios({
              method: "post",
              url: `https://i8e201.p.ssafy.io/api/user/auth/check/nickname`,
              data: {
                changeName: ModifyNickname,
                nowName: MyNickname,
              },
              headers: {
                accessToken: accessToken,
              },
            }).then(() => {
              const isDouble = r.data.data;
              if (isDouble) {
                toast.success(
                  `${ModifyNickname}(은)는 수정가능한 닉네임입니다`
                );
                setModifydisplay(isDouble);
              } else {
                toast.warning(`${ModifyNickname}(은)는 중복된 닉네임입니다`);
                setModifydisplay(isDouble);
              }
            });
          }
        });
      } else if ("401" !== r.data.status) {
        const isDouble = r.data.data;
        if (isDouble) {
          toast.success(`${ModifyNickname}(은)는 수정가능한 닉네임입니다`);
          setModifydisplay(isDouble);
        } else {
          toast.warning(`${ModifyNickname}(은)는 중복된 닉네임입니다`);
          setModifydisplay(isDouble);
        }
      }
    });
  };

  //------------useEffect------------------

  useEffect(() => {
    //토큰처리
    axios({
      method: "get",
      url: `https://i8e201.p.ssafy.io/api/user/myinfo/${Username}`,
      headers: {
        accessToken: accessToken,
      },
    }).then((r) => {
      console.log("나 토큰있나???111", r.data);
      //401이면 토큰 없는거
      if ("401" === r.data.status) {
        console.log("없는것같아");
        axios({
          method: "get",
          url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
          headers: {
            refreshToken: refreshToken,
          },
        }).then((r) => {
          console.log("해치웠나?", r.data);
          //token갱신
          if ("401" === r.data.status) {
            localStorage.clear();
            toast.error("인증되지 않으 유저입니다");
            navigate("/");
          } else {
            localStorage.setItem("accessToken", r.data.accessToken);
            accessToken = r.data.accessToken;
            axios({
              method: "get",
              url: `https://i8e201.p.ssafy.io/api/user/myinfo/${Username}`,
              headers: {
                accessToken: accessToken,
              },
            }).then((r) => {
              console.log("갱신 후 axios시작");

              dispatch(changeMyInfo(r.data.data));
              setMyInfo(r.data.data);

              //data내용
              const a = r.data.data;
              //변경될 닉네임
              setModifyNickname(a.nickname);
              // //고정될 닉네임
              setMyNickname(a.nickname);
              //코멘트 저장
              setComment(a.comment);

              const birth = a.birth;
              const today = new Date();
              const birthDate = new Date(
                birth.split(".")[0],
                birth.split(".")[1],
                birth.split(".")[2]
              );
              let age = today.getFullYear() - birthDate.getFullYear();
              const m = today.getMonth() - birthDate.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
              setAge(age);
              // setRegion(a.region);
              setMyRegionCode(a.regioncode);
              //첫번째 박스의 코드로 확인
              setSelectedFirst(a.regioncode);

              dispatch(changeMyPageProfile(a.profile));
              setSelectSecond(a.regioncode);

              //광역시 랑 (도/시) 구분
              axios({
                method: "get",
                url: "https://i8e201.p.ssafy.io/api/admin/region",
                headers: {
                  accessToken: accessToken,
                },
              }).then((r) => {
                console.log("2번째 axios 시작");
                const result = r.data.data;
                let rlist1 = new Array();
                let rlist2 = new Array();
                for (var i = 0; i < result.length; i++) {
                  if (i === 0) {
                    rlist1.push(result[i]);
                  } else {
                    if (
                      result[i - 1].regionCode.substr(0, 2) ===
                      result[i].regionCode.substr(0, 2)
                    ) {
                      rlist2.push(result[i]);
                    } else {
                      rlist1.push(result[i]);
                    }
                  }
                }
                setCity(rlist1.slice(0, 7));

                setRegionlistFirst(rlist1);

                setRegionlistSecond(rlist2);

                const templist = rlist1.slice(0, 7);

                let temp = false;

                templist.map((it) => {
                  if (
                    it.regionCode.substr(0, 2) === a.regioncode.substr(0, 2)
                  ) {
                    temp = true;
                  }
                });
                setIsSelected(temp);
              });

              setTimeout(() => {
                setIsLoading(false);
              }, 1000);
            });
          }
        });
      }
      //토큰있는것같아
      else if ("401" !== r.data.status) {
        console.log("토큰 있는 체로 시작");

        dispatch(changeMyInfo(r.data.data));
        setMyInfo(r.data.data);

        //data내용
        const a = r.data.data;
        //변경될 닉네임
        setModifyNickname(a.nickname);
        // //고정될 닉네임
        setMyNickname(a.nickname);
        //코멘트 저장
        setComment(a.comment);

        const birth = a.birth;
        const today = new Date();
        const birthDate = new Date(
          birth.split(".")[0],
          birth.split(".")[1],
          birth.split(".")[2]
        );
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        setAge(age);
        // setRegion(a.region);
        setMyRegionCode(a.regioncode);
        //첫번째 박스의 코드로 확인
        setSelectedFirst(a.regioncode);

        dispatch(changeMyPageProfile(a.profile));
        setSelectSecond(a.regioncode);

        //광역시 랑 (도/시) 구분
        axios({
          method: "get",
          url: "https://i8e201.p.ssafy.io/api/admin/region",
          headers: {
            accessToken: accessToken,
          },
        }).then((r) => {
          console.log("2번째 axios 시작");
          const result = r.data.data;
          let rlist1 = new Array();
          let rlist2 = new Array();
          for (var i = 0; i < result.length; i++) {
            if (i === 0) {
              rlist1.push(result[i]);
            } else {
              if (
                result[i - 1].regionCode.substr(0, 2) ===
                result[i].regionCode.substr(0, 2)
              ) {
                rlist2.push(result[i]);
              } else {
                rlist1.push(result[i]);
              }
            }
          }
          setCity(rlist1.slice(0, 7));

          setRegionlistFirst(rlist1);

          setRegionlistSecond(rlist2);

          const templist = rlist1.slice(0, 7);

          let temp = false;

          templist.map((it) => {
            if (it.regionCode.substr(0, 2) === a.regioncode.substr(0, 2)) {
              temp = true;
            }
          });
          setIsSelected(temp);
        });

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {SecessionClickCheck ? <SecessionModal userData={MyInfo} /> : null}
          {/* nav의 메뉴 => friend 클릭 시 친구 목록 보이기 */}
          <FriendList />
          {menuFriendChatClickCheck ? <FriendChat /> : null}
          {MyPageProfileClickCheck ? (
            <ProfileSelectModal profileData={ProfileImg} />
          ) : null}
          {/* 메뉴 클릭시 보이기 */}
          <NavbarMenu />
          {/* 알림 클릭시 보이기 */}
          <NavbarAlarm />
          <div
            className="grid grid-rows-4 w-screen h-screen font-nanum "
            style={{ gridTemplateRows: "11rem" }}
          >
            <Navbar />
            <div className="w-full"></div>
            {/* 여기가 배경색 */}
            <div className="w-full flex flex-col  text-white">
              <div className="flex flex-row h-[15%] ">
                <div className="w-[25%] "></div>
                <div className="flex flex-row w-[46%]">
                  <div className="w-[28%]text-justify font-bold text-4xl pt-16">
                    프로필 편집
                  </div>
                </div>
                <div className="w-[29%] "></div>
              </div>
              <div className="h-[5%]"></div>
              <div className="flex flex-row h-[80%]">
                <div className="w-[25%] "></div>
                <div className="flex flex-row w-[45%]">
                  <div className="flex flex-row w-[28%] h-[30%]">
                    {MyInfo ? (
                      <>
                        <div className="w-[80%]">
                          <img
                            className=" h-[9rem] w-[9rem] ml-6 rounded-full"
                            style={{ objectFit: "contain" }}
                            src={`${MyPageProfileImg}`}
                            alt="프로필"
                          />
                        </div>
                        <div className="w-[20%] pt-[45%]">
                          <img
                            className="h-[2rem] w-[2rem]  cursor-pointer"
                            style={{ objectFit: "contain" }}
                            src={require("../../assets/myPage/settings.png")}
                            alt=""
                            onClick={() => {
                              dispatch(showMyPageProfileSelect());
                            }}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div className="flex flex-col w-[72%] ">
                    <div className="h-[30%] ">
                      <div className="h-[32%] pt-4">
                        <div className="w-[30%] h-[80%] text-justify text-2xl ">
                          닉네임
                        </div>
                      </div>
                      <div className="flex flex-row h-[45%]">
                        <div className="w-[70%] pr-5 pt-2 pb-2">
                          <input
                            className="w-[100%] h-full bg-neutral-600 text-2xl pl-5 caret-white"
                            value={ModifyNickname}
                            type="text"
                            maxLength={6}
                            onChange={onChangeNikename}
                          />
                        </div>
                        <div className="w-[30%] pl-3 pt-[8px]">
                          <div
                            className="w-[10rem] h-[3.5rem] text-2xl pt-3 border-2 cursor-pointer"
                            onClick={() => {
                              if (ModifyNickname.length < 2) {
                                toast.warning(`2글자 이상 입력바랍니다`);
                              } else {
                                duffle();
                              }
                            }}
                          >
                            중복확인
                          </div>
                        </div>
                      </div>
                      <div className="h-[20%] text-justify text-stone-500">
                        *6자 이내로 입력 가능합니다.
                      </div>
                    </div>
                    <div className="h-[28%]">
                      <div className="h-[40%] pt-6 ">
                        <div className="w-[7rem] text-2xl text-justify">
                          자기소개
                        </div>
                      </div>
                      <div className="h-[40%] w-[80%] border-b-2">
                        <input
                          className="h-full w-full bg-transparent text-2xl pl-3 caret-white"
                          value={comment}
                          placeholder={"#오늘의날씨 #맑음 #오운완 적어봐요!"}
                          type="text"
                          onChange={onChangeComment}
                        />
                      </div>
                    </div>
                    <div className="h-[25%] ">
                      <div className="h-[30%]  text-justify text-2xl">지역</div>
                      <div className="flex flex-row h-[70%] ">
                        <div className="w-[35%] h-[55%] pr-6 ">
                          {MyInfo ? (
                            <select
                              className="w-full h-full border-2 text-[1.5rem] bg-black text-center overflow-auto"
                              onChange={handleSelect}
                            >
                              {RegionlistFirst
                                ? RegionlistFirst.map((it: any) => {
                                    return it.regionCode.substr(0, 2) ===
                                      SelectedFirst.substr(0, 2) ? (
                                      <option
                                        className="text-[20px]"
                                        value={it.regionCode}
                                        selected
                                      >
                                        {it.sidoName}
                                      </option>
                                    ) : (
                                      <option
                                        className="text-[20px]"
                                        value={it.regionCode}
                                      >
                                        {it.sidoName}
                                      </option>
                                    );
                                  })
                                : null}
                            </select>
                          ) : null}
                        </div>
                        <div className="w-[35%] h-[55%] pr-6 ">
                          {isSelected === false ? (
                            <select
                              className="w-full h-full border-2 text-[1.5rem] bg-black text-center overflow-auto"
                              onChange={handleSelectSecond}
                              value={SelectedSecond}
                            >
                              {RegionlistSecond
                                ? RegionlistSecond.map((it: any): any =>
                                    SelectedFirst.substr(0, 2) ===
                                    it.regionCode.substr(0, 2) ? (
                                      <option
                                        className="text-[20px]"
                                        value={it.regionCode}
                                      >
                                        {it.gugunName}
                                      </option>
                                    ) : null
                                  )
                                : null}
                            </select>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row font-extrabold text-[20px] h-[17%] ">
                      <div className="w-[25%] pt-3 pb-[27px] pr-3 ">
                        {modifydisplay === true ? (
                          <div
                            className="h-full pt-3 border-2 cursor-pointer"
                            onClick={() => {
                              let back = SelectedSecond;
                              console.log("city", city);
                              console.log("SelectedFirst", SelectedFirst);
                              console.log("SelectedSecond", SelectedSecond);

                              city.map((it: any) => {
                                if (
                                  it.regionCode.substr(0, 2) ===
                                  SelectedFirst.substr(0, 2)
                                ) {
                                  back = "0000000000";
                                  setSelectSecond("0000000000");
                                }
                              });
                              console.log("뒤쪽꺼", back.substr(2, 8));
                              const Code =
                                SelectedFirst.substr(0, 2) + back.substr(2, 8);
                              console.log("수정될Code입니다", Code);

                              axios({
                                method: "put",
                                url: `https://i8e201.p.ssafy.io/api/user/${Username}`,
                                data: {
                                  comment: comment,
                                  nickname: ModifyNickname,
                                  profile: MyPageProfileImg,
                                  regionCode: Code,
                                },
                                headers: {
                                  accessToken: accessToken,
                                },
                              }).then((r) => {
                                console.log("토큰 상태?", r.data.status);
                                //토큰 이상하네?
                                if ("401" === r.data.status) {
                                  //토큰 요청
                                  axios({
                                    method: "get",
                                    url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
                                    headers: {
                                      refreshToken: refreshToken,
                                    },
                                  }).then((r) => {
                                    console.log("해치웠나?", r.data);
                                    //token갱신
                                    if ("401" === r.data.status) {
                                      localStorage.clear();
                                      toast.error("인증되지 않은 유저입니다");
                                      navigate("/");
                                    } else {
                                      localStorage.setItem(
                                        "accessToken",
                                        r.data.accessToken
                                      );
                                      accessToken = r.data.accessToken;
                                      //새 토큰 받았으니까 axios요청
                                      axios({
                                        method: "put",
                                        url: `https://i8e201.p.ssafy.io/api/user/${Username}`,
                                        data: {
                                          comment: comment,
                                          nickname: ModifyNickname,
                                          profile: MyPageProfileImg,
                                          regionCode: Code,
                                        },
                                        headers: {
                                          accessToken: accessToken,
                                        },
                                      }).then(() => {
                                        toast.success("수정에 성공하셨습니다");
                                        window.location.reload();
                                      });
                                    }
                                  });
                                }
                                //음 토큰이 정상적이군
                                else if ("401" !== r.data.status) {
                                  toast.success("수정에 성공하셨습니다");
                                  window.location.reload();
                                }
                              });
                            }}
                          >
                            저장
                          </div>
                        ) : (
                          <div className="h-full opacity-50  pt-3 border-2">
                            <div className="h-[80%]">중복필수</div>
                          </div>
                        )}
                      </div>
                      <div className="w-[25%] pt-3 pb-[27px] pr-3 ">
                        <div className="h-full pt-3 border-2 cursor-pointer">
                          <div
                            className="h-[80%]"
                            onClick={() => {
                              navigate("/main");
                            }}
                          >
                            나가기
                          </div>
                        </div>
                      </div>
                      <div className="w-[25%] pt-3 pb-[27px] pr-3 ">
                        <div
                          className="h-full pt-3 border-2 cursor-pointer"
                          onClick={() => {
                            clickSecession();
                          }}
                        >
                          <div className="h-[80%]">탈퇴</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[20%] h-[90%] border-l-2">
                  <div className="h-[27%] pt-7 pl-4 pr-2">
                    <div className="flex flex-row w-full h-full border-2">
                      <div className="w-[50%] pt-[25px] pl-[25px]">
                        <div className="w-[6rem] h-[3rem] text-justify text-[20px] ">
                          매너온도
                        </div>
                      </div>
                      <div className="w-[50%] pl-10 pt-8">
                        <div className="flex flex-row h-[4rem] font-bold  text-[38px] text-amber-700">
                          <div>{MyInfo.manner.toFixed(1)}</div>
                          <div className="text-[25px] pl-2 pt-4">℃</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[27%] pt-7 pl-4 pr-2">
                    <div className="flex flex-row w-full h-full border-2">
                      <div className="w-[50%] pt-[25px] pl-[25px]">
                        <div className="w-[7rem] h-[3rem] text-justify text-[20px] ">
                          현재 포인트
                        </div>
                      </div>
                      <div className="w-[50%] pl-7 pt-8">
                        <div className="flex flex-row h-[4rem] font-bold  text-[38px] text-cyan-600">
                          <div>{MyInfo.point}</div>
                          <div className="text-[25px] pl-2 pt-4">P</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[35%] pl-[15rem] pr-2 pt-2">
                    <div
                      className="w-full h-[30%] cursor-pointer"
                      onClick={() => {
                        navigate("/pointhistory");
                      }}
                    >
                      포인트 내역
                    </div>
                  </div>
                  <div className="h-[21%] pl-6 pr-6 ">
                    <div className="flex flex-row h-[75%] ">
                      <div className="flex flex-col w-[33.3%] ">
                        <div className="h-[40%] pt-2"> 나이</div>
                        <div className="h-[60%] font-bold text-[28px] ">
                          {" "}
                          {age}살
                        </div>
                      </div>
                      <div className="flex flex-col w-[33.3%] ">
                        <div className="h-[40%] pt-2 "> 성별</div>
                        {MyInfo.gender === "M" ? (
                          <div className="h-[60%] font-bold  text-[28px]">
                            남성
                          </div>
                        ) : (
                          <div className="h-[60%] font-bold  text-[28px]">
                            여성
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col w-[33.3%] ">
                        <div className="h-[40%] pt-2"> 생일</div>
                        <div className="h-[60%]  font-bold text-[28px] ">
                          {MyInfo.birth.split(".")[1]}.
                          {MyInfo.birth.split(".")[2]}
                        </div>
                      </div>
                    </div>
                    <div className="h-[25%]">
                      나이, 성별, 생일은 변경하실 수 없습니다
                    </div>
                  </div>
                </div>
                <div className="w-[9%]"></div>
              </div>
              <div className="h-[10%]"></div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NewMyPage;
