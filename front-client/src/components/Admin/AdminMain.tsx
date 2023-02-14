import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  changeMainCreateRoomList,
  changeSelectDetailUser,
  changeUserList,
} from "src/store/store";
// test지워도됨
function AdminMain(): React.ReactElement {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <div className="inline-block align-baseline text-white h-screen w-screen grid grid-cols-5 gap-5">
      <div>
        <div></div>
      </div>
      <form className="col-span-3 grid grid-rows-5 gap-5">
        <div className="text-8xl">AdminPage</div>
        <div className="w-full row-span-3 border-2 border-white grid grid-rows-6 gap-5">
          <div className="empty"> </div>
          <div
            className="cursor-pointer "
            onClick={() => {
              const accessToken = localStorage.getItem("accessToken");

              axios({
                method: "get",
                url: `https://i8e201.p.ssafy.io/api/admin/user`,

                headers: {
                  accessToken: accessToken,
                },
              }).then((r) => {
                console.log(r.data.data);
                dispatch(changeUserList(r.data.data));
                dispatch(changeSelectDetailUser(false));
              });
              navigate("/userList");
            }}
          >
            유저 정보
          </div>
          <div
            className="cursor-pointer "
            onClick={() => {
              const accessToken = localStorage.getItem("accessToken");
              axios({
                method: "get",
                url: "https://i8e201.p.ssafy.io/api/admin/pocha",

                headers: {
                  accessToken: accessToken,
                },
              }).then((r) => {
                console.log(r.data.data);
                dispatch(changeMainCreateRoomList(r.data.data));
              });
              navigate("/roomlist");
            }}
          >
            현재 방 목록
          </div>
          <div
            className="cursor-pointer "
            onClick={() => {
              navigate("/userreport/wait");
            }}
          >
            신고 목록
          </div>
          <div
            className="cursor-pointer "
            onClick={() => {
              navigate("/adminadd");
            }}
          >
            관리자 추가
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              navigate("/admingamesetting");
            }}
          >
            게임 관리
          </div>
        </div>
        <div></div>
      </form>
      <div>
        <div></div>
      </div>
    </div>
  );
}

export default AdminMain;
