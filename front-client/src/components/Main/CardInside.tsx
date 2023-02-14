import { useState, useRef } from "react";
import styles from "./Main.module.css";
import "./CardInside.css";

// 카드 내부
function CardInside({
  TagList,
  themeType,
  themeId,
  femaleCount,
  maleCount,
  ssulTitle,
  isPrivate,
  alcohol,
  totalCount,
  limitUser,
  IsRealSsul,
}: any): JSX.Element {
  const [isOver, setIsOver] = useState(false);

  // 테마에 따른 테마 컬러변경
  let themeTypeColor;
  let themeTypeHoverNeon;
  switch (themeType) {
    case "Talk":
      themeTypeColor = "#E47200";
      themeTypeHoverNeon = "talk";
      break;
    case "Game":
      themeTypeColor = "#003C74";
      themeTypeHoverNeon = "game";
      break;
    case "Meeting":
      themeTypeColor = "#DE145D";
      themeTypeHoverNeon = "meeting";
  }

  // 테마ID에 따른 이미지url
  let imgUrl: any;
  switch (themeId) {
    case "T0B0":
      imgUrl = require("../../assets/theme/izakaya.jpg");
      break;
    case "T0B1":
      imgUrl = require("../../assets/theme/pocha.jpg");
      break;
    case "T0B2":
      imgUrl = require("../../assets/theme/hof.jpg");
      break;
    case "T1B0":
      imgUrl = require("../../assets/theme/game.png");
      break;
    case "T2B0":
      imgUrl = require("../../assets/theme/meeting.png");
      break;
  }

  // 짠해서 마신 술 체크 (14개-> 1병(기능정의서))
  const countSul = Math.floor(alcohol / 14);

  return (
    <div
      className={`h-full min-h-[100%] w-full min-w-[100%]`}
      onMouseEnter={() => {
        setIsOver(true);
      }}
      onMouseLeave={() => {
        setIsOver(false);
      }}
    >
      {isOver ? (
        <div
          className={`flex flex-col justify-start items-center h-full min-h-[100%] w-full min-w-[100%] ${themeTypeHoverNeon} ${styles.neon}`}
          style={{ borderRadius: "16px" }}
        >
          {/* 마우스 호버 O */}
          <div
            className={`h-full  w-full `}
            style={{ borderRadius: "0px 0px 16px 16px" }}
          >
            <img
              src={imgUrl}
              alt=""
              className="h-[15rem] min-h-full w-[25rem] min-w-full object-fill"
              style={{
                borderRadius: "16px 16px 0px 0px ",
                transition: "all 0.5s",
              }}
            />
          </div>
          {/* 내용물 */}
          <div
            className="grid h-full w-full bg-black"
            style={{
              borderRadius: "0px 0px 16px 16px",
              gridTemplateRows: "1fr 1fr 1fr 0.2fr",
            }}
          >
            <div
              className="grid"
              style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
            >
              {/* 테마종류 */}
              <div className="flex justify-center items-center">
                <div
                  className="flex justify-center items-center w-[80%] h-[40%] rounded-full text-base font-medium"
                  style={{ backgroundColor: themeTypeColor }}
                >
                  {themeType}
                </div>
              </div>
              {IsRealSsul ? (
                <div className="flex items-center">
                  <img className="flex justify-center items-center w-[40%] h-[40%] rounded-full" src={require(`../../assets/mainIcon/Ssul.png`)} alt="" />
                </div>
              ) : (
                <div className="flex justify-center items-center"></div>
              )}

              {/* 비밀방 여부 */}
              <div className="flex justify-center items-center">
                {/* <img className="h-[1.5rem] w-[1.5rem]" src={require(`../../assets/mainIcon/${themeType}Lock.png`)} alt="" /> */}
                {isPrivate ? (
                  <img
                    className="h-[1.5rem] w-[1.5rem]"
                    src={require(`../../assets/mainIcon/${themeType}Lock.png`)}
                    alt=""
                  />
                ) : null}
              </div>
            </div>
            {/* 썰 or 기본 문구 */}
            <div className="w-[17rem] max-w-[17rem] flex flex-col justify-between items-start pl-[1rem] overflow-hidden whitespace-nowrap text-ellipsis">
              <div className="flex justify-start items-center w-[16rem] max-w-[176em] overflow-hidden whitespace-nowrap text-ellipsis text-base font-medium">
                {ssulTitle}
              </div>
              <div className="flex justify-start items-center w-[16rem] max-w-[176em] overflow-hidden whitespace-nowrap text-ellipsis text-base font-medium">
                {TagList}
              </div>
            </div>
            {/* 술 체크 및 인원수 체크 */}
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="flex justify-start items-end pl-5">
                <img
                  className="w-[1rem] h-[full]"
                  src={require("../../assets/mainIcon/straightSul.png")}
                  alt=""
                />
                <div>&nbsp; x &nbsp;{countSul}</div>
              </div>
              <div className="flex justify-center items-end">
                <img
                  className="w-[1.7rem] h-[1.7rem]"
                  src={require("../../assets/mainIcon/maleIcon.png")}
                  alt=""
                />
                <div className="pr-2">&nbsp;{maleCount}</div>
                <img
                  className="w-[1.7rem] h-[1.7rem]"
                  src={require("../../assets/mainIcon/femaleIcon.png")}
                  alt=""
                />
                <div>&nbsp;{femaleCount}</div>
              </div>
            </div>
            <div className=""></div>
          </div>
        </div>
      ) : (
        <div
          className={`grid grid-rows-2 h-full min-h-[100%] w-full min-w-[100%] ${styles.neon} `}
          style={{ gridTemplateRows: "7fr 3fr", borderRadius: "16px" }}
        >
          {/* 마우스 호버 X  */}
          {/* 포차 이미지 */}
          <div
            className="h-full min-h-[100%] w-full min-w-[100%]"
            style={{ borderRadius: "0px 0px 16px 16px" }}
          >
            <img
              src={imgUrl}
              alt=""
              className="h-[21rem] min-h-[100%] w-[25rem] min-w-[100%] object-fill"
              style={{ borderRadius: "16px 16px 0px 0px " }}
            />
          </div>
          <div
            className={`grid grid-rows-3 h-full min-h-[100%] w-full min-w-[100%] bg-black text-white`}
            style={{ borderRadius: "0px 0px 16px 16px" }}
          >
            {/* 포차 종류 */}
            <div className="w-full min-w-[100%] max-w-[100%] grid grid-cols-12 items-center overflow-hidden ">
              <div className="col-span-1 "></div>
              <div
                className="w-full h-full col-span-4 rounded-full flex justify-center items-center text-base font-medium"
                style={{
                  backgroundColor: themeTypeColor,
                  height: "60%",
                }}
              >
                {themeType}
              </div>
              <div className="col-span-1  "></div>
              <div className="flex justify-center items-center col-span-1 ">
                <img
                  className="w-[1rem] h-[1rem]"
                  src={require("../../assets/tagIcon/stayPerson.png")}
                  alt=""
                />
                <span className="pl-2">
                  {totalCount}/{limitUser}
                </span>
              </div>
              <div className="col-span-5 "></div>
            </div>
            {/* 문구 한줄 */}
            <div className="w-full min-w-[100%] max-w-[100%] grid grid-rows-1 items-center overflow-hidden">
              <div className="w-[18rem] max-w-[18rem]  h-full overflow-hidden whitespace-nowrap text-ellipsis items-center ">
                <div className="flex justify-start items-center w-[17rem] max-w-[17rem] pl-[1.6rem] overflow-hidden whitespace-nowrap text-ellipsis text-base font-medium">
                  {ssulTitle}
                </div>
              </div>
            </div>
            {/* 선택한 태그 종류 */}
            <div className="w-full min-w-[100%] max-w-[100%] grid grid-rows-1 items-center overflow-hidden">
              <div className="w-[18rem] max-w-[18rem] h-full overflow-hidden whitespace-nowrap text-ellipsis items-center ">
                <div className="flex justify-start items-center w-[17rem] max-w-[17rem] pl-[1.6rem] overflow-hidden whitespace-nowrap text-ellipsis text-base font-medium">
                  {TagList}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardInside;
