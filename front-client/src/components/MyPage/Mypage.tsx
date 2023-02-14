import axios from "axios";
import { log } from "console";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  changeMyInfo,
  changeMyPageCheck,
  changeMyPageProfile,
  showMyPageProfileSelect,
  showSecessionModal,
} from "src/store/store";
import FriendChat from "../Common/FriendChat";
import FriendList from "../Common/FriendList";
import Navbar from "../Common/Navbar";
import NavbarAlarm from "../Common/NavbarAlarm";
import NavbarMenu from "../Common/NavbarMenu";
import SecessionModal from "./SecessionModal";
import ProfileImg from "./ProfileImg";

import Loading from "../Common/Loading";
import ProfileSelectModal from "./ProfileSelectModal";

//최초 호출시 내 지역 보여주기 / profile 보여주기

function Mypage(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // -----------state-------------
  //첫번째 Select박스에 넣을 state
  const [SelectedFirst, setSelectedFirst] = useState<any>();
  //두번째 Select박스에 넣을 state
  const [Selected2, setSelected2] = useState<any>();
  //첫번째 Select박스가 선택되었다는 것을 알릴 state
  const [isSelected, setIsSelected] = useState<any>();
  //광역시를 담을 state
  const [city, setCity] = useState<any>();

  //내정보 지역코드
  const [regioncode, setRegioncode] = useState();
  //지역코드 전체 목록(시도)
  const [regionlist, setRegionlist] = useState<any | null>();

  //지역코드 전체 목록(구군)
  const [regionlist2, setRegionlist2] = useState<any | null>();

  //중복확인
  const [modifydisplay, setModifydisplay] = useState(false);
  //바뀔이름
  const [nickname, setNickname] = useState<any>();
  //이름
  const [nowName, setNowName] = useState();
  //생일
  const [birth, setBirth] = useState<any | null>("0000.00.00");
  //성별
  const [gender, setGender] = useState();
  //본인만나이
  const [age, setAge] = useState<any | null>();
  //본인 지역
  const [region, setRegion] = useState("3000000000");
  //포인트
  const [point, setPoint] = useState();
  //자기소개
  const [comment, setComment] = useState();
  //매너온도
  const [manner, setManner] = useState();
  //프로필경로
  const [profile, setProfile] = useState();
  //모달에 넣을정보
  const [userData, setUserData] = useState();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  //localStorage
  const Username: any = localStorage.getItem("Username");

  //Store
  let myInfo: any = useAppSelector((state: any) => {
    // console.log("store에 넣은 내정보", state.myInfo);
    return state.myInfo;
  });
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

  const MyPageProfileImg = useAppSelector((state) => {
    return state.SelectProfile;
  });

  // click 함수
  const onChangeNikename = (event: any) => {
    // console.log(event.target.value);
    setNickname(event.target.value);
  };

  const onChangeComment = (event: any) => {
    // console.log(event.target.value);
    setComment(event.target.value);
  };

  const handleSelect = (event: any) => {
    // console.log("select1의 선택은?", event.target.value);
    setSelectedFirst(event.target.value);
    setIsSelected(false);
    city.map((it: any): any => {
      if (it.regionCode === event.target.value) {
        setIsSelected(true);
      }
    });
  };

  const handleSelect2 = (event: any) => {
    // console.log(event.target.value);
    setSelected2(event.target.value);
  };

  function show(temp: any): any {
    // console.log("나 저장됩니다!", temp);
  }

  // 탈퇴 묻는 모달 띄우기
  const clickSecession = () => {
    dispatch(showSecessionModal());
  };

  useEffect(() => {
    // console.log("profile바뀌나?", profile);
  }, [profile]);

  useEffect(() => {
    console.log("나바뀌었소", MyPageProfileClickCheck);
  }, [MyPageProfileClickCheck]);

  useEffect(() => {
    console.log("region바뀌나?", region);
  }, [region]);

  useEffect(() => {
    console.log("SelectedFirst가 바뀌었습니다!", SelectedFirst);
  }, [SelectedFirst]);

  //최초 호출시 axios호출
  useEffect(() => {
    // console.log("useEffect실행");
    //토큰처리
    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    // axios.defaults.headers.common["Authorization"] = `${accessToken}`;
    // axios
    //   .get(`https://i8e201.p.ssafy.io/api/user/myinfo/${Username}`)
    //   .then((r) => {
    //     console.log("성공인가요?", r.data);
    //   });

    axios({
      method: "get",
      url: `https://i8e201.p.ssafy.io/api/user/myinfo/${Username}`,
      headers: {
        accessToken: `${accessToken}`,
      },
    }).then((r) => {
      console.log("성공인가요?", r.data);
      //
      axios({
        method: "post",
        url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
        headers: {
          accessToken: `${accessToken}`,
        },
      }).then((r) => {
        console.log(r.data);
      });
    }).catch(e=>{
      console.log(e.data);
      
    });

    axios({
      method: "get",
      url: `https://i8e201.p.ssafy.io/api/user/myinfo/${Username}`,
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      headers: {
        accessToken: `${accessToken}`,
      },
    }).then((r) => {
      // console.log("1번째 axios 실행");

      // console.log("내정보 : ", r.data.data);
      dispatch(changeMyInfo(r.data.data));
      setUserData(r.data);
      show(r.data);
      //data내용
      const a = r.data.data;
      setNickname(a.nickname);
      setNowName(a.nickname);
      const birth = a.birth;
      setGender(a.gender);

      const today = new Date();

      const birthDate = new Date(
        birth.split(".")[0],
        birth.split(".")[1],
        birth.split(".")[2]
      );
      let age = today.getFullYear() - birthDate.getFullYear();
      // console.log("age1 : " + age);
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setBirth(birth);
      setAge(age);
      // console.log("내 지역입니다!", a.region);
      setRegion(a.region);
      setRegioncode(a.regioncode);
      // 일단 내 regioncode를 받는다
      setSelectedFirst(a.regioncode);
      // console.log("a.regionCode가 들어왔어", a.regioncode);
      if (a.regioncode.substr(2, 8) !== "00000000") {
        setIsSelected(false);
      } else {
        setIsSelected(true);
      }
      dispatch(changeMyPageProfile(a.profile));
      setSelected2(a.regioncode);
      setComment(a.comment);
      setPoint(a.point);
      setManner(a.manner.toFixed(1));
      setProfile(a.profile);
      // console.log("첫번째 axios끝");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    });

    //광역시 랑 (도/시) 구분
    axios({
      method: "get",
      url: "https://i8e201.p.ssafy.io/api/admin/region",
      headers: {
        accessToken: `${accessToken}`,
      },
    }).then((r) => {
      // console.log("2번째 axios 시작");
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
      setRegionlist(rlist1);
      setCity(rlist1.slice(0, 7));
      setRegionlist2(rlist2);
      // console.log("2번째 axios 끝");
    });
  }, []);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          {SecessionClickCheck ? <SecessionModal userData={userData} /> : null}
          {/* nav의 메뉴 => friend 클릭 시 친구 목록 보이기 */}
          <FriendList />
          {menuFriendChatClickCheck ? <FriendChat /> : null}
          {MyPageProfileClickCheck ? (
            <ProfileSelectModal profileData={ProfileImg} />
          ) : null}

          <div>
            <div
              className="grid w-screen h-screen font-nanum "
              style={{ gridTemplateRows: "11rem 1fr 0.1fr" }}
            >
              <div className="h-48"></div>
              <div
                className="grid w-full "
                style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
              >
                <div className="bg-black "></div>
                {/* 회원 정보 */}
                <div
                  className="grid h-full border-white border-4 border-opacity-40"
                  style={{
                    gridTemplateRows: "1.7fr 0.7fr 4.2fr 0.9fr 1.3fr",
                    borderRadius: "24px 24px 24px 24px",
                  }}
                >
                  {/* 이모지 및 변경 아이콘 */}
                  <div className="flex flex-row justify-center  items-end h-full">
                    <div className="ml-30 right-7 w-[7rem] " />
                    <div className="right-7 w-[3rem] " />
                    <div className="h-[1.5rem] w-[1.5rem]" />
                    {profile ? (
                      // console.log("사진경로", profile),
                      // console.log("profile type", typeof profile),
                      <img
                        className=" h-[9rem] w-[9rem] ml-6 rounded-full"
                        style={{ objectFit: "contain" }}
                        src={`${MyPageProfileImg}`}
                        alt=""
                      />
                    ) : (
                      <img
                        className="h-[9rem] w-[9rem] ml-6 rounded-full"
                        style={{ objectFit: "contain" }}
                        // src={"/profile/icon_0003.png"}
                        alt="로딩중"
                      />
                    )}
                    <img
                      className="h-[1.5rem] w-[1.5rem] cursor-pointer"
                      style={{ objectFit: "contain" }}
                      src={require("../../assets/myPage/settings.png")}
                      alt=""
                      onClick={() => {
                        //톱니바퀴 클릭하면 modal클릭변경
                        console.log("클릭했다");
                        dispatch(showMyPageProfileSelect());
                        console.log("안녕");
                      }}
                    />
                    <div className="right-7 w-[3rem] " />
                    <div className="flex flex-col items-start">
                      <div
                        className="ml-30 right-7 w-[7rem] border-white border-2 text-white cursor-pointer"
                        onClick={() => {
                          clickSecession();
                        }}
                      >
                        탈퇴하기
                      </div>
                      <div className="h-[3rem]" />
                      <div className="h-[3rem]" />
                    </div>
                  </div>
                  {/* 닉네임 */}
                  <div className="grid grid-cols-7 flex justify-center items-center ">
                    <div></div>
                    <div></div>
                    <input
                      className="col-span-3 text-center rounded-lg text-lg w-[80%] h-[60%] mx-auto my-auto bg-black caret-white"
                      value={nickname}
                      type="text"
                      maxLength={6}
                      onChange={onChangeNikename}
                    />
                    <div
                      className="right-7 w-[100%] border-white border-2 text-white cursor-pointer"
                      onClick={() => {
                        if (nickname.length < 2) {
                          toast.warning(`2글자 이상 입력바랍니다`);
                        } else {
                          axios({
                            method: "post",
                            url: `https://i8e201.p.ssafy.io/api/user/auth/check/nickname`,
                            data: {
                              changeName: nickname,
                              nowName: nowName,
                            },
                          }).then((r) => {
                            const isDouble = r.data.data;
                            if (isDouble) {
                              toast.success(
                                `${nickname}(은)는 수정가능한 닉네임입니다`
                              );
                              setModifydisplay(isDouble);
                            } else {
                              toast.warning(
                                `${nickname}(은)는 중복된 닉네임입니다`
                              );
                              setModifydisplay(isDouble);
                            }
                          });
                        }
                      }}
                    >
                      중복확인
                    </div>
                    <div></div>
                  </div>
                  {/* 정보 */}
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                  >
                    {/* 나이, 생일, 매너온도 */}
                    <div
                      className="grid  w-full h-full"
                      style={{ gridTemplateRows: "1fr 1fr 1fr" }}
                    >
                      {/* 나이 */}
                      <div
                        className="grid  w-full h-[40%] my-auto "
                        style={{ gridTemplateColumns: "1.2fr 2fr" }}
                      >
                        <div className="flex justify-center items-center text-white text-[1.4rem] font-bold w-[80%] mx-auto">
                          나이
                        </div>
                        <div
                          className="grid  border-purple-300 w-[90%] mr-[10%]"
                          style={{ gridTemplateColumns: "1fr 1fr" }}
                        >
                          <div className="flex justify-center items-center text-white text-[1rem] text-center bg-black h-full border-2">
                            {age}
                          </div>
                        </div>
                      </div>
                      {/* 생일 */}
                      <div
                        className="grid  w-full h-[40%] my-auto "
                        style={{ gridTemplateColumns: "1.2fr 2fr" }}
                      >
                        <div className="flex justify-center items-center text-white text-[1.4rem] font-bold w-[80%] mx-auto">
                          생일
                        </div>
                        <div
                          className="grid  border-purple-300 w-[90%] mr-[10%]"
                          style={{ gridTemplateColumns: "1fr 1fr" }}
                        >
                          <div className="flex justify-center items-center text-white text-[1rem] text-center bg-black h-full border-2">
                            {birth.split(".")[1]}월 {birth.split(".")[2]}일
                          </div>
                        </div>
                      </div>
                      {/* 매너온도 */}
                      <div
                        className="grid  w-full h-[40%] my-auto "
                        style={{ gridTemplateColumns: "1.2fr 2fr" }}
                      >
                        <div className="flex justify-center items-center text-white text-[1.4rem] font-bold w-[80%] mx-auto">
                          매너온도
                        </div>
                        <div
                          className="grid  border-purple-300 w-[90%] mr-[10%]"
                          style={{ gridTemplateColumns: "1fr 1fr" }}
                        >
                          <div className="flex justify-center items-center text-white text-[1rem] text-center bg-black h-full border-2">
                            {manner} ℃
                          </div>
                          <div></div>
                        </div>
                      </div>
                    </div>
                    {/* 성별, 지역, 포인트 */}
                    <div
                      className="grid  w-full h-full"
                      style={{ gridTemplateRows: "1fr 1fr 1fr" }}
                    >
                      {/* 성별 */}
                      <div
                        className="grid  w-full h-[40%] my-auto "
                        style={{ gridTemplateColumns: "1.2fr 2fr" }}
                      >
                        <div className="flex justify-center items-center text-white text-[1.4rem] font-bold w-[80%] mx-auto">
                          성별
                        </div>
                        {gender === "F" ? (
                          <div
                            className="grid  border-purple-300 w-[90%] mr-[10%]"
                            style={{ gridTemplateColumns: "1fr 1fr" }}
                          >
                            <div className="flex justify-center items-center text-white text-[1rem] text-center bg-black h-full border-2">
                              여
                            </div>
                          </div>
                        ) : (
                          <div
                            className="grid  border-purple-300 w-[90%] mr-[10%]"
                            style={{ gridTemplateColumns: "1fr 1fr" }}
                          >
                            <div className="flex justify-center items-center text-white text-[1rem] text-center bg-black h-full border-2">
                              남
                            </div>
                          </div>
                        )}
                      </div>
                      {/* 지역위치보기 */}
                      <div
                        className="grid  w-full h-[40%] my-auto "
                        style={{ gridTemplateColumns: "1.2fr 2fr" }}
                      >
                        <div className="flex justify-center items-center text-white text-[1.4rem] font-bold w-[80%] mx-auto">
                          지역
                        </div>
                        <div
                          className="grid  border-purple-300 w-[90%] mr-[10%]"
                          style={{ gridTemplateColumns: "1fr 1fr" }}
                        >
                          <select
                            className="text-white text-[1rem] text-center bg-black border-2 max-w-[6rem] overflow-auto "
                            onChange={handleSelect}
                          >
                            {regionlist
                              ? regionlist.map(
                                  (it: any): any => (
                                    console.log("Selected는", SelectedFirst),
                                    console.log(
                                      "Selected는",
                                      SelectedFirst.substr(0, 2)
                                    ),
                                    console.log(
                                      "비교할거",
                                      it.regionCode.substr(0, 2)
                                    ),
                                    it.regionCode.substr(0, 2) ===
                                    SelectedFirst.substr(0, 2) ? (
                                      <option value={it.regionCode} selected>
                                        {it.sidoName}
                                      </option>
                                    ) : (
                                      <option value={it.regionCode}>
                                        {it.sidoName}
                                      </option>
                                    )
                                  )
                                )
                              : null}
                          </select>

                          {isSelected === false ? (
                            <select
                              className="text-white text-[1rem] text-center bg-black border-2 max-w-[6rem] overflow-auto "
                              onChange={handleSelect2}
                              value={Selected2}
                            >
                              {regionlist2
                                ? regionlist2.map((it: any): any =>
                                    SelectedFirst.substr(0, 2) ===
                                    it.regionCode.substr(0, 2) ? (
                                      <option value={it.regionCode}>
                                        {it.gugunName}
                                      </option>
                                    ) : null
                                  )
                                : null}
                            </select>
                          ) : null}
                        </div>
                      </div>
                      {/* 포인트 */}
                      <div
                        className="grid  w-full h-[40%] my-auto "
                        style={{ gridTemplateColumns: "1.2fr 2fr" }}
                      >
                        <div className="flex justify-center items-center text-white text-[1.4rem] font-bold w-[80%] mx-auto">
                          포인트
                        </div>
                        <div
                          className="grid w-[90%] mr-[10%]"
                          style={{ gridTemplateColumns: "1fr 1fr" }}
                        >
                          <div className="flex justify-center items-center text-white text-[1rem] text-center bg-black h-full border-2">
                            {point}
                          </div>
                          <div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 자기소개 */}
                  <div
                    className="grid w-full h-[100%] "
                    style={{ gridTemplateColumns: "0.45fr 2fr" }}
                  >
                    <div className="flex justify-start items-center text-white text-[1.4rem] font-bold  h-[100%] w-full pl-[1rem]">
                      자기소개
                    </div>
                    <input
                      className="flex justify-start items-center text-white text-[1rem] text-center my-auto bg-black h-[70%] w-[95.8%] border-2 caret-white"
                      value={comment}
                      type="text"
                      onChange={onChangeComment}
                    />
                  </div>
                  {/* Navfooter */}
                  <div className="flex justify-center items-end h-full w-full">
                    <div
                      className="grid h-[70%] w-[40%] border-2 border-white border-b-0 "
                      style={{
                        gridTemplateColumns: "1fr 1fr",
                        border: "solid 2px white",
                        borderBottom: "solid 0px",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      <div
                        className="flex flex-col justify-end items-center w-[80%] h-full mx-auto cursor-pointer "
                        onClick={() => {
                          navigate("/main");
                        }}
                      >
                        <img
                          className="h-[2.5rem]"
                          src={require("../../assets/myPage/back.png")}
                          alt=""
                        />
                        <span className="text-white my-1">뒤로가기</span>
                      </div>
                      {/*
               수정버튼 
               modifydisplay : true => display
               modifydisplay : false => display
                */}
                      {modifydisplay === true ? (
                        <div
                          className="flex flex-col justify-end items-center w-[80%] h-full mx-auto cursor-pointer"
                          onClick={() => {
                            // console.log("modifydisplay : " + modifydisplay);
                            //수정가능

                            console.log("앞쪽꺼", SelectedFirst.substr(0, 2));
                            console.log("city", city);
                            let back = Selected2;

                            city.map((it: any) => {
                              console.log("it", it.regionCode);
                              console.log(
                                "it substr",
                                it.regionCode.substr(0, 2)
                              );
                              console.log(
                                "조건문",
                                it.regionCode.substr(0, 2) ===
                                  SelectedFirst.substr(0, 2)
                              );

                              if (
                                it.regionCode.substr(0, 2) ===
                                SelectedFirst.substr(0, 2)
                              ) {
                                console.log("나바뀐다!");
                                back = "0000000000";
                                setSelected2("0000000000");
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
                                nickname: nickname,
                                profile: MyPageProfileImg,
                                regionCode: Code,
                              },
                            }).then((r) => {
                              // console.log("성공");
                              toast.success("수정에 성공하셨습니다");
                              navigate("/main");
                            });
                          }}
                        >
                          <img
                            className="h-[2.5rem]"
                            src={require("../../assets/myPage/save.png")}
                            alt=""
                          />
                          <span className="text-white my-1">수정</span>
                        </div>
                      ) : (
                        <div className="opacity-50 flex flex-col justify-end items-center w-[80%] h-full mx-auto">
                          <img
                            className="h-[2.5rem]"
                            src={require("../../assets/myPage/save.png")}
                            alt=""
                          />
                          <span className="text-white my-1">수정</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-black "></div>
              </div>
              {/* 메뉴 클릭시 보이기 */}
              <NavbarMenu />
              {/* 알림 클릭시 보이기 */}
              <NavbarAlarm />
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default Mypage;
