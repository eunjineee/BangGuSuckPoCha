import axios from "axios";
import { info, log } from "console";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, useToastContainer } from "react-toastify";
import { inflate } from "zlib";

function AdminLogin(): React.ReactElement {
  const navigate = useNavigate();
  const [ID, setID] = useState();
  const [PASSWORD, setPASSWORD] = useState();
  const Username = localStorage.getItem("Username");

  const ChangeID = (event: any) => {
    console.log(event.target.value);
    setID(event.target.value);
  };
  const ChangePASSWORD = (event: any) => {
    console.log(event.target.value);
    setPASSWORD(event.target.value);
  };
  return (
    <div className="inline-block align-baseline text-white h-screen w-screen grid grid-cols-5 gap-5">
      <div>
        <div></div>
      </div>
      <form className="col-span-3 grid grid-rows-5 gap-5">
        <div className="text-8xl">AdminPage</div>
        <div className="row-span-3 border-2 border-white grid grid-rows-6 gap-2">
          <div className="row-span-2 text-6xl"> Admin Login </div>
          <div className="grid grid-cols-6 gap-2">
            <div className="text-justify pl-9 text-4xl">ID :</div>
            <input
              type="text"
              className="col-span-4 bg-black border-2"
              placeholder="ID를 입력하세요"
              onChange={ChangeID}
            />
            <div></div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div className="text-justify pl-9 text-4xl">PW : </div>
            <input
              type="text"
              className="col-span-4 bg-black border-2"
              placeholder="PW를 입력하세요"
              onChange={ChangePASSWORD}
            />
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-4"></div>
            <div
              onClick={() => {
                console.log(ID);
                console.log(PASSWORD);
                let accessToken = localStorage.getItem("accessToken");

                axios({
                  method: "post",
                  url: `https://i8e201.p.ssafy.io/api/login`,
                  data: {
                    username: ID,
                    password: PASSWORD,
                  },
                  headers: {
                    accessToken: accessToken,
                  },
                }).then((r) => {
                  if ("401" === r.data.status) {
                    //토큰 재요청
                    const refreshToken = localStorage.getItem("refreshToken");
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
                        localStorage.setItem("accessToken", r.data.accessToken);
                        accessToken = r.data.accessToken;
                        axios({
                          method: "post",
                          url: `https://i8e201.p.ssafy.io/api/login`,
                          data: {
                            username: ID,
                            password: PASSWORD,
                          },
                          headers: {
                            accessToken: accessToken,
                          },
                        }).then((r) => {
                          if ("200" === r.data.status) {
                            navigate("/adminmain");
                          } else {
                            toast.warning("로그인실패");
                          }
                        });
                      }
                    });
                  }
                  //토큰 정상이야
                  else {
                    if ("200" === r.data.status) {
                      navigate("/adminmain");
                    } else {
                      toast.warning("로그인실패");
                    }
                  }
                });
              }}
            >
              Login
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
}

export default AdminLogin;
