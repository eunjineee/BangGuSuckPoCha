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
                const accessToken = localStorage.getItem("accessToken");

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
                  console.log("r.data", r.data);
                  const Info = r.data;
                  if (Info.status === "200") {
                    console.log(
                      "이전 accessToken",
                      localStorage.getItem("accessToken")
                    );
                    localStorage.setItem("accessToken", Info.accessToken);
                    const newlocalaccess = localStorage.getItem("accessToken");
                    console.log(
                      "이전이랑 같나요 엑세스?",
                      newlocalaccess === Info.accessToken
                    );

                    console.log(
                      "이전 refreshToken",
                      localStorage.getItem("refreshToken")
                    );
                    localStorage.setItem("refreshToken", Info.refreshToken);
                    const newlocalrefresh =
                      localStorage.getItem("refreshToken");
                    console.log(
                      "이전이랑 같나요? 리프레쉬",
                      newlocalrefresh === Info.refreshToken
                    );
                    navigate("/adminmain");
                  } else {
                    toast.warning("로그인실패");
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
