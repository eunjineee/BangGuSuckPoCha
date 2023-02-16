import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminAdd = () => {
  const navigate = useNavigate();
  const [USERNAME, setUSERNAME] = useState();

  const [NickName, setNickName] = useState<any>();
  const [PASSWORD, setPASSWORD] = useState();
  //중복확인
  const [modifydisplay, setModifydisplay] = useState(false);

  const ChangeNickName = (event: any) => {
    console.log(event.target.value);
    setNickName(event.target.value);
  };
  const ChangePASSWORD = (event: any) => {
    console.log(event.target.value);
    setPASSWORD(event.target.value);
  };
  let accessToken = localStorage.getItem("accessToken");
  const ChangeUSERNAME = (event: any) => {
    console.log(event.target.value);
    setUSERNAME(event.target.value);
  };
  return (
    <div className="inline-block align-baseline text-white h-screen w-screen grid grid-cols-5 gap-5">
      <div>
        <div></div>
      </div>
      <form className="col-span-3 grid grid-rows-5 gap-5">
        <div className="text-8xl">AdminPage</div>
        <div className="row-span-3 border-2 border-white grid grid-rows-6 gap-2">
          <div className="text-6xl"> 관리자 추가 </div>

          <div className="grid grid-cols-6 gap-2">
            <div className="text-center pl-5 text-3xl ">NickName :</div>
            <input
              type="text"
              className="col-span-4 bg-black border-2 caret-white"
              placeholder="NickName를 입력하세요"
              onChange={ChangeNickName}
            />
            <div className="flex flex-row m-7">
              <div
                className="right-7 w-[100%] border-white border-2 text-white cursor-pointer"
                onClick={() => {
                  if (NickName.length < 2) {
                    toast.warning(`2글자 이상 입력바랍니다`);
                  } else {
                    console.log(NickName);
                    console.log("accessToken", accessToken);

                    axios({
                      method: "get",
                      url: `https://i8e201.p.ssafy.io/api/admin/check/${NickName}`,
                      headers: {
                        accessToken: `${accessToken}`,
                      },
                    }).then((r) => {
                      //토큰이상해
                      if ("401" === r.data.status) {
                        //토큰 재요청
                        console.log("토큰 이상함");
                        const refreshToken =
                          localStorage.getItem("refreshToken");
                        const Username = localStorage.getItem("Username");
                        axios({
                          method: "get",
                          url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
                          headers: {
                            refreshToken: refreshToken,
                          },
                        }).then((r) => {
                          //재발급 실패
                          if ("401" === r.data.status) {
                            localStorage.clear();
                            toast.error("인증되지 않은 유저입니다");
                            navigate("/");
                          }
                          //재발급 성공
                          else {
                            console.log("재발급 성공", r.data.accessToken);
                            localStorage.setItem(
                              "accessToken",
                              r.data.accessToken
                            );
                            accessToken = r.data.accessToken;
                            //원래 axios 실행
                            console.log(r.data);
                            const isDouble = r.data.data;
                            if (isDouble) {
                              toast.success(
                                `${NickName}(은)는 수정가능한 닉네임입니다`
                              );
                              setModifydisplay(isDouble);
                            } else {
                              toast.warning(
                                `${NickName}(은)는 중복된 닉네임입니다`
                              );
                              setModifydisplay(isDouble);
                            }
                          }
                        });
                      }
                      //토큰 정상이야
                      else {
                        console.log("토큰 정상함");
                        //실행 결과값 그대로 실행
                        console.log(r.data);
                        const isDouble = r.data.data;
                        if (isDouble) {
                          toast.success(
                            `${NickName}(은)는 수정가능한 닉네임입니다`
                          );
                          setModifydisplay(isDouble);
                        } else {
                          toast.warning(
                            `${NickName}(은)는 중복된 닉네임입니다`
                          );
                          setModifydisplay(isDouble);
                        }
                      }
                    });
                  }
                }}
              >
                중복확인
              </div>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div className="inline-block text-center align-text-bottom pl-5 text-[1.8rem]">
              UserName :
            </div>
            <input
              type="text"
              className="col-span-4 bg-black border-2 caret-white"
              placeholder="USERNAME를 입력하세요"
              onChange={ChangeUSERNAME}
            />
            <div></div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div className="text-center pl-5 text-3xl">PassWord : </div>
            <input
              type="text"
              className="col-span-4 bg-black border-2 caret-white"
              placeholder="PW를 입력하세요"
              onChange={ChangePASSWORD}
            />
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-4"></div>
            <div
              onClick={() => {
                console.log("닉네임", NickName);
                console.log("USERNAME", USERNAME);
                console.log("PASSWORD", PASSWORD);
                axios({
                  method: "post",
                  url: "https://i8e201.p.ssafy.io/api/admin/join",
                  data: {
                    nickname: NickName,
                    username: USERNAME,
                    password: PASSWORD,
                  },

                  headers: {
                    accessToken: accessToken,
                  },
                }).then((r) => {
                  //토큰이상해
                  if ("401" === r.data.status) {
                    //토큰 재요청
                    console.log("토큰 이상함");
                    const refreshToken = localStorage.getItem("refreshToken");
                    const Username = localStorage.getItem("Username");
                    axios({
                      method: "get",
                      url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
                      headers: {
                        refreshToken: refreshToken,
                      },
                    }).then((r) => {
                      //재발급 실패
                      if ("401" === r.data.status) {
                        localStorage.clear();
                        toast.error("인증되지 않은 유저입니다");
                        navigate("/");
                      }
                      //재발급 성공
                      else {
                        console.log("재발급 성공", r.data.accessToken);
                        localStorage.setItem("accessToken", r.data.accessToken);
                        accessToken = r.data.accessToken;
                        //원래 axios 실행
                        axios({
                          method: "post",
                          url: "https://i8e201.p.ssafy.io/api/admin/join",
                          data: {
                            nickname: NickName,
                            username: USERNAME,
                            password: PASSWORD,
                          },

                          headers: {
                            accessToken: accessToken,
                          },
                        }).then((r) => {
                          console.log(r.data);
                        });
                      }
                    });
                  }
                  //토큰 정상이야
                  else {
                    console.log("토큰 정상함");
                    //실행 결과값 그대로 실행
                    console.log(r.data);
                  }
                });
              }}
            >
              관리자 추가
            </div>
            <div></div>
          </div>
          <div> </div>
        </div>
        <div></div>
      </form>
      <div>
        <div></div>
      </div>
    </div>
  );
};

export default AdminAdd;
