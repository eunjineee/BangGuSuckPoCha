import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  showBalancegameeSettingModal,
  showLiargameSettingModal,
  showYanggameSettingModal,
} from "src/store/store";
import YanggameSettingModal from "./GameSetting/YanggameSettingModal";
import BalancegameSettingModal from "./GameSetting/BalancegameSettingModal";
import LiargameSettingModal from "./GameSetting/LiargameSettingModal";

const AdminGameSetting = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isBalanceClick = useAppSelector((state) => {
    return state.BalancegameSettingModalClickCheck;
  });
  const isYangClick = useAppSelector((state) => {
    return state.YanggameSettingModalClickCheck;
  });
  const isLiarClick = useAppSelector((state) => {
    return state.LiargameSettingModalClickCheck;
  });

  //클릭 함수
  const clickYang = () => {
    console.log("양세찬세팅창켜짐!");
    dispatch(showYanggameSettingModal());
  };
  const clickBalance = () => {
    console.log("밸런스세팅창켜짐!");
    dispatch(showBalancegameeSettingModal());
  };
  const clickLiar = () => {
    console.log("라이어세팅창켜짐!");
    dispatch(showLiargameSettingModal());
  };

  return (
    <>
      {isYangClick ? <YanggameSettingModal /> : null}
      {isBalanceClick ? <BalancegameSettingModal /> : null}
      {isLiarClick ? <LiargameSettingModal /> : null}
      <div className="h-screen w-screen text-white">
        <div className="flex flex-col h-full w-full">
          <div className="h-[20%] flex flex-row">
            <div className="w-[20%]"></div>
            <div className="w-[60%] text-6xl">게임관리</div>
            <div className="w-[20%]"></div>
          </div>
          <div className="h-[70%] flex flex-row  ">
            <div className="w-[20%]"></div>
            <div className="w-[60%] flex flex-col justify-center items-center ">
              <div className="h-[20%] w-[60%]  flex justify-center items-center ">
                <div
                  className="h-[50%] w-[60%] border-2 border-white rounded-lg cursor-pointer  "
                  onClick={() => {
                    clickYang();
                  }}
                >
                  양세찬 게임 설정하기
                </div>
              </div>
              <div className="h-[20%] w-[60%] flex justify-center items-center ">
                <div
                  className="h-[50%] w-[60%] border-2 border-white rounded-lg cursor-pointer"
                  onClick={() => {
                    clickBalance();
                  }}
                >
                  밸런스 게임 설정하기
                </div>
              </div>
              <div className="h-[20%] w-[60%] flex justify-center items-center ">
                <div
                  className="h-[50%] w-[60%] border-2 border-white rounded-lg cursor-pointer"
                  onClick={() => {
                    clickLiar();
                  }}
                >
                  라이어 게임 설정하기
                </div>
              </div>
            </div>
            <div className="w-[20%]"></div>
          </div>
          <div className="h-[10%] flex flex-row items-center justify-center">
            <div className="w-[60%] flex flex-row justify-center">
              <div
                className=" w-[30%] h-[40%] border-2 border-white rounded-lg cursor-pointer"
                onClick={() => {
                  navigate("/adminmain");
                }}
              >
                AdminMain으로
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminGameSetting;
