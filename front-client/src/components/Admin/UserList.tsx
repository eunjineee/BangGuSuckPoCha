import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  changeDetailUser,
  changeSelectDetailUser,
  changeUserList,
} from "src/store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function UserDetail() {
  const detailUser: any = useAppSelector((state: any) => {
    return state.DetailUser;
  });
  return (
    <div className="row-span-6 w-full overflow-x-auto  max-h-[39.5rem] grid grid-rows-12">
      <div className="grid grid-cols-2 ">
        <div className="w-[10rem]">profile : </div>
        <div className="max-w-[10rem]">{detailUser.profile}</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[10rem]">nickname : </div>
        <div className="w-[10rem] max-w-[10rem]">{detailUser.nickname}</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[10rem]">birth :</div>
        <div className="max-w-[10rem]">{detailUser.birth}</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[10rem]">gender :</div>
        <div className="max-w-[10rem]">{detailUser.gender}</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[10rem]">region : </div>
        <div className="max-w-[10rem]">{detailUser.region}</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[10rem]">username : </div>
        <div className="w-[10rem] max-w-[10rem]">{detailUser.username}</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[10rem]">point : </div>
        <div className="max-w-[10rem]">{detailUser.point}</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[10rem]">userId : </div>
        <div className="max-w-[10rem]">{detailUser.userId}</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[10rem]">manner : </div>
        <div className="max-w-[10rem]">{detailUser.manner.toFixed(1)}</div>
      </div>
    </div>
  );
}

function UserSelect() {
  const dispatch = useAppDispatch();
  const userList: any = useAppSelector((state: any) => {
    return state.UserList;
  });
  return (
    <div className="row-span-6 w-full overflow-x-auto  max-h-[34rem]">
      <table className="border-collapse border border-slate-400 w-full">
        <thead>
          <tr>
            <th className="border border-slate-200 w-[35%]">닉네임</th>
            <th className="border border-slate-300 w-[20%]">나이</th>
            <th className="border border-slate-300 w-[20%]">매너온도</th>
            <th className="border border-slate-300 w-[25%]">지역</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((it: any) => {
            return (
              <tr className="h-full">
                <td
                  className="border border-slate-300 max-w-[10rem] text-ellipsis overflow-hidden cursor-pointer"
                  onClick={() => {
                    // console.log(it);
                    dispatch(changeDetailUser(it));
                    dispatch(changeSelectDetailUser(true));
                  }}
                >
                  {it.nickname}
                </td>
                <td className="border border-slate-300 max-w-[10rem] ">
                  {it.birth}
                </td>
                <td className="border border-slate-300  max-w-[5rem]">
                  {it.manner.toFixed(1)}
                </td>
                <td className="border border-slate-300 max-w-[10rem] ">
                  {" "}
                  {it.region}
                </td>
              </tr>
            );
          })}
          {userList.map((it: any) => {
            return (
              <tr className="h-full">
                <td
                  className="border border-slate-300 max-w-[10rem] text-ellipsis overflow-hidden cursor-pointer"
                  onClick={() => {
                    // console.log(it);
                    dispatch(changeDetailUser(it));
                    dispatch(changeSelectDetailUser(true));
                  }}
                >
                  {it.nickname}
                </td>
                <td className="border border-slate-300 max-w-[10rem] ">
                  {it.birth}
                </td>
                <td className="border border-slate-300  max-w-[5rem]">
                  {it.manner.toFixed(1)}
                </td>
                <td className="border border-slate-300 max-w-[10rem] ">
                  {" "}
                  {it.region}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
function UserList() {
  const dispatch = useAppDispatch();
  const userList: any = useAppSelector((state: any) => {
    // console.log(state.UserList);
    return state.UserList;
  });
  const isSelect: any = useAppSelector((state: any) => {
    return state.SelectDetailUser;
  });
  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken");
    axios({
      method: "get",
      url: `https://i8e201.p.ssafy.io/api/admin/user`,
      headers: {
        accessToken: accessToken,
      },
    }).then((r) => {
      //토큰이상해
      if ("401" === r.data.status) {
        //토큰 재요청
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
            localStorage.setItem("accessToken", r.data.accessToken);
            accessToken = r.data.accessToken;
            //원래 axios 실행
            axios({
              method: "get",
              url: `https://i8e201.p.ssafy.io/api/admin/user`,
              headers: {
                accessToken: accessToken,
              },
            }).then((r) => {
              console.log(r.data.data);
              dispatch(changeUserList(r.data.data));
            });
          }
        });
      }
      //토큰 정상이야
      else {
        //실행 결과값 그대로 실행
        dispatch(changeUserList(r.data.data));
      }
    });
  }, []);
  const navigate = useNavigate();
  return (
    <div className="align-baseline text-white h-screen w-screen grid grid-cols-5 gap-5">
      <div>
        <div></div>
      </div>
      <div className="col-span-3 grid grid-rows-5 gap-5">
        <div className="text-8xl">AdminPage</div>
        <div className="w-full row-span-3 border-2 border-white grid grid-cols-2">
          {userList ? <UserSelect /> : null}
          {isSelect === true ? <UserDetail /> : null}
        </div>
        <div className="grid grid-cols-4">
          <div
            className=""
            onClick={() => {
              navigate("/adminmain");
            }}
          >
            admin main으로
          </div>
          <div className="row-span-3"></div>
        </div>
      </div>
      <div>
        <div></div>
      </div>
    </div>
  );
}

export default UserList;
