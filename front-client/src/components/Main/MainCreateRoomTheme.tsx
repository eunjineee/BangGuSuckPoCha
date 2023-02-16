import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { changeCreateRoomThemeCheck } from "../../store/store";
// import style from "./MainCreateRoom.module.css";

const MainCreateRoomTheme = ({ selectOption, pochaInfo }: { selectOption: string[], pochaInfo?: any }) => {
  const dispatch = useAppDispatch()
  // 첫 제목과 포차테마 이름들
  const [selectTitle, ...selectPocha] = selectOption;
  const themeIdList = ['T0B0', 'T0B1', 'T0B2']
  const selectTheme = useRef<any>([]);

  // 테마 이미지
  const themeImg = [
    require("../../assets/theme/izakaya.jpg"),
    require("../../assets/theme/pocha.jpg"),
    require("../../assets/theme/hof.jpg"),
  ];
  // 선택된 테마
  const [theme, setTheme] = useState<any>(null);

  useEffect(() => {
    // 포차 정보 있을때
    if (pochaInfo) {
      console.log('룸 테마: ',pochaInfo );
      console.log('룸 테마: ',pochaInfo.data );
      console.log('룸 테마: ',pochaInfo.data.themeId );
      
      switch (pochaInfo.data.themeId) {
        case "T0B0":
          selectTheme.current[0].classList.toggle("grayscale");
          selectTheme.current[0].classList.toggle("scale-125");
          setTheme(selectTheme.current[0]);
          dispatch(changeCreateRoomThemeCheck("T0B0"))
          break
        case "T0B1":
          selectTheme.current[1].classList.toggle("grayscale");
          selectTheme.current[1].classList.toggle("scale-125");
          setTheme(selectTheme.current[1]);
          dispatch(changeCreateRoomThemeCheck("T0B1"))
          break
        case "T0B2":
          selectTheme.current[2].classList.toggle("grayscale");
          selectTheme.current[2].classList.toggle("scale-125");
          setTheme(selectTheme.current[2]);
          dispatch(changeCreateRoomThemeCheck("T0B2"))
          break
      }
      return
    }
    // 전달받는 값 없으면 처음에 제일 첫번째 값 선택세팅
    selectTheme.current[0].classList.toggle("grayscale");
    selectTheme.current[0].classList.toggle("scale-125");
    setTheme(selectTheme.current[0]);
    dispatch(changeCreateRoomThemeCheck("T0B0"));
  }, []);

  const onSelect = (event: React.MouseEvent<HTMLDivElement>) => {
    // 선택한값이 다르면 기존꺼 끄고 새로운거 선택
    if (event.target !== theme) {
      theme?.classList.toggle("grayscale");
      theme?.classList.toggle("scale-125");
      (event.target as Element).classList.toggle("grayscale");
      (event.target as Element).classList.toggle("scale-125");
      setTheme(event.target);
    }
    const data = event.currentTarget;
    // 클릭한 alt 값에 따른 테마 체크 값 변경 함수
    dispatch(changeCreateRoomThemeCheck(data.getAttribute('alt')))
  };
  return (
    <div className="flex w-full h-12 my-10 font-bold items-center">
      <div className="text-left text-xl mr-10">{selectTitle}</div>
      <div className="flex justify-between items-center w-[80%]">
        {selectPocha.map((themeName, index) => (
          // <img src={require(`${themeImg[index]}`)} key={index} alt={`${selectPocha[index+1]}`}/>
          <div key={index} className={`flex-col justify-center items-center`}>
            <img
              ref={(tag) => {
                selectTheme.current[index] = tag;
              }}
              className={`grayscale w-32 h-24 cursor-pointer rounded-lg`}
              src={themeImg[index]}
              onClick={onSelect}
              alt={`${themeIdList[index]}`}
            />
            <div
              className={`my-3 mr-4 rounded-fu w-full h-full text-lg flex justify-center items-center`}
            >
              {themeName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainCreateRoomTheme;
