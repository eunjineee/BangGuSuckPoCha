import axios from "axios";
import { log } from "console";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  changeDetailRoom,
  changeDetailUser,
  changeMainCreateRoomList,
  changeSelectDetailUser,
} from "src/store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function RoomDetail() {
  const detailRoom: any = useAppSelector((state: any) => {
    console.log("선택", state.DetailRoom);
    return state.DetailRoom;
  });
  return (
    <div className="row-span-6 w-full overflow-x-auto  max-h-[39.5rem] grid grid-rows-13">
      <div className="grid grid-cols-2 ">
        <div className="w-[6rem]">pochaId : </div>
        <div className="max-w-[10rem]">{detailRoom.pochaId}</div>
        {/* <div className="max-w-[10rem]">detailRoom.profile</div> */}
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[6rem]">tagList : </div>
        <div className="max-w-[10rem]">
          {detailRoom.tagList.map((it: any) => {
            return `${it} `;
          })}
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[6rem]">themeId : </div>
        <div className="w-[14rem] max-w-[10rem]">{detailRoom.themeId}</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[6rem]">isPrivate :</div>
        {detailRoom.isPrivate === true ? (
          <div className="max-w-[14rem]">O</div>
        ) : (
          <div className="max-w-[14rem]">X</div>
        )}
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[6rem]">isSsul :</div>
        {detailRoom.isSsul === true ? (
          <div className="max-w-[14rem]">O</div>
        ) : (
          <div className="max-w-[14rem]">X</div>
        )}
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[6rem]">ssulTitle : </div>
        {detailRoom.isSsul === true ? (
          <div className="max-w-[14rem]">{detailRoom.ssulTitle}</div>
        ) : (
          <div className="max-w-[14rem]">썰없음</div>
        )}
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[6rem]">region : </div>
        <div className="w-[14rem] max-w-[14rem]">{detailRoom.region}</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[6rem]">totalCount : </div>
        <div className="max-w-[20rem]">
          총 : {detailRoom.totalCount}명 || 남 : {detailRoom.maleCount}명,여 :
          {detailRoom.femaleCount}명
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[6rem]">createAt : </div>
        <div className="max-w-[10rem]">{detailRoom.createAt}</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="w-[6rem]">endAt : </div>
        {detailRoom.isEnd === false ? (
          <div className="max-w-[10rem]">진행중</div>
        ) : (
          <div className="max-w-[10rem]">닫힌방</div>
        )}
      </div>
    </div>
  );
}

function RoomSelect() {
  const dispatch = useAppDispatch();
  const isSelect: any = useAppSelector((state: any) => {
    console.log(state.SelectDetailUser);
    return state.SelectDetailUser;
  });

  const room: any = useAppSelector((state: any) => {
    // console.log("만들어진방", state.mainCreateRoomList);
    return state.mainCreateRoomList;
  });
  return (
    <div className="w-full overflow-x-auto max-h-[34rem]">
      <table className="border-collapse border border-slate-400 w-full ">
        <thead className="border border-slate-300">
          <tr>
            <td className="w-[9%]">포차번호</td>
            <td className="w-[7%]">테마</td>
            <td className="w-[6%]">잠금</td>
            <td className="w-[6%]">썰포차</td>
            <td className="w-[42%]">썰 타이틀</td>
            <td className="w-[20%]">만든시간</td>
            <td className="w-[10%]">자세히보기</td>
          </tr>
        </thead>
        <tbody>
          {room.map(function (a: any, i: number) {
            return (
              <tr>
                <td className="w-[7%]">{room[i].pochaId}</td>
                <td className="w-[7%]">{room[i].themeId}</td>

                {room[i].isPrivate === true ? (
                  <td className="w-[7%]">O</td>
                ) : (
                  <td className="w-[7%]">X</td>
                )}
                {room[i].isSsul === true ? (
                  <>
                    <td className="w-[7%]">O</td>
                    <td className="w-[42%]">{room[i].title} test</td>
                  </>
                ) : (
                  <>
                    <td className="w-[7%]">X</td>
                    <td className="w-[42%]">썰없슈</td>
                  </>
                )}
                <td className="w-[20%]">{room[i].createAt}</td>
                <td
                  className="w-[10%] cursor-pointer"
                  onClick={() => {
                    // console.log("몇번째야?", room[i]);
                    dispatch(changeDetailRoom(room[i]));
                    dispatch(changeSelectDetailUser(true));
                    // console.log("선택한방", Selectroom);
                    // console.log(isSelect);
                  }}
                >
                  {"==>"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RoomList(): React.ReactElement {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSelect: any = useAppSelector((state: any) => {
    return state.SelectDetailUser;
  });
  const room: any = useAppSelector((state: any) => {
    // console.log("만들어진방", state.mainCreateRoomList);
    return state.mainCreateRoomList;
  });
  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken");
    axios({
      method: "get",
      url: "https://i8e201.p.ssafy.io/api/admin/pocha",
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
              url: "https://i8e201.p.ssafy.io/api/admin/pocha",
              headers: {
                accessToken: accessToken,
              },
            }).then((r) => {
              dispatch(changeMainCreateRoomList(r.data.data));
            });
          }
        });
      }
      //토큰 정상이야
      else {
        //실행 결과값 그대로 실행
        dispatch(changeMainCreateRoomList(r.data.data));
      }
    });
  }, []);

  return (
    <div className="inline-block align-baseline text-white h-screen w-full grid grid-cols-9 gap-5">
      <div>
        <div></div>
      </div>
      <form className="col-span-7 grid grid-rows-5 gap-5">
        <div className="text-8xl">AdminPage</div>
        <div className="w-full row-span-3 border-2 border-white grid grid-cols-2">
          {room ? <RoomSelect /> : null}
          {isSelect === true ? <RoomDetail /> : null}
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

          <div className="col-span-2"></div>
          <div></div>
        </div>
      </form>
      <div>
        <div></div>
      </div>
    </div>
  );
}

export default RoomList;
