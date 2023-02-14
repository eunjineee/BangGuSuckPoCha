import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { changeAdminReport } from "src/store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
function UserReport(): React.ReactElement {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const report: any = useAppSelector((state: any) => {
    console.log("store에서 들고오는 값", state.adminreport);
    return state.adminreport;
  });
  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken");

    axios({
      method: "get",
      url: "https://i8e201.p.ssafy.io/api/admin/report",
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
              url: "https://i8e201.p.ssafy.io/api/admin/report",
              headers: {
                accessToken: accessToken,
              },
            }).then((r) => {
              dispatch(changeAdminReport(r.data.data));
            });
          }
        });
      }
      //토큰 정상이야
      else {
        //실행 결과값 그대로 실행
        dispatch(changeAdminReport(r.data.data));
      }
    });
  }, []);
  return (
    <div className="inline-block align-baseline text-white h-screen w-screen grid grid-cols-9 gap-5">
      <div>
        <div></div>
      </div>
      <form className="col-span-7 grid grid-rows-5 gap-5">
        <div className="text-8xl">AdminPage</div>
        <div className="w-full row-span-3 border-2 border-white">
          {/* <div className="text-2xl h-20">신고관리</div> */}
          <table className="border-collapse border border-slate-400 w-full overflow-auto">
            <thead className="border border-slate-300">
              <tr className="h-20">
                <td className="w-[7%]">피신고자</td>
                <td className="w-[12%]">신고자</td>
                <td className="w-[43%]">사유</td>
                <td className="w-[12%]">신고타입</td>
                <td className="w-[12%]">신고날짜</td>
                <td className="w-[14%]">처리결과</td>
              </tr>
            </thead>
            <tbody>
              {report
                ? report.map((it: any) => {
                    return it.reportResult === true ? (
                      <tr className="border border-slate-300">
                        <td className="w-[7%]">{it.attackerName}</td>
                        <td className="w-[12%]">{it.repoterName}</td>
                        <td className="w-[43%] overflow-auto">
                          {it.reportReason}
                        </td>
                        <td className="w-[12%]">{it.reportType}</td>
                        <td className="w-[12%]">{it.report_at}</td>
                        {it.demerit === 0 ? (
                          <td className="w-[14%]">거절</td>
                        ) : (
                          <td className="w-[14%]">승인</td>
                        )}
                      </tr>
                    ) : null;
                  })
                : null}
            </tbody>
          </table>
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
          <div
            onClick={() => {
              navigate("/userreport/wait");
            }}
          >
            대기목록
          </div>
        </div>
      </form>
      <div>
        <div></div>
      </div>
    </div>
  );
}

export default UserReport;
