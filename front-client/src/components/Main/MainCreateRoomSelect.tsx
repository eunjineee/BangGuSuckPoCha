import { useRef, useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import {
  changeCreateRoomChoiceAge,
  changeCreateRoomChoiceRegion,
} from "../../store/store";
import style from "./MainCreateRoom.module.css";

const MainCreateRoomSelect = ({
  selectOption,
  pochaInfo,
}: {
  selectOption: string[];
  pochaInfo?: any;
}) => {
  const dispatch = useAppDispatch();
  const [selectTitle, selectFirst, selectSecond] = selectOption;

  const selectChoiceAge = useRef<any>(null);
  const selectRegionCity = useRef<any>(null);

  // 처음에 실행
  useEffect(() => {
    // 포차 정보 있을때
    if (pochaInfo) {
      console.log('룸 선택: ', pochaInfo);
      console.log('룸 선택: ', pochaInfo.data);
      console.log('룸 선택: ', pochaInfo.data.age);
      console.log('룸 선택: ', pochaInfo.age);
      
      if ( pochaInfo.data.age !== 0 && selectTitle === "나이") {
        selectChoiceAge.current.classList.remove("text-black");
        selectChoiceAge.current.classList.remove("bg-white");
        selectRegionCity.current.classList.add("text-black");
        selectRegionCity.current.classList.add("bg-white");
      }
      if (pochaInfo.region !== "전국" && selectTitle === "지역") {
        selectChoiceAge.current.classList.remove("text-black");
        selectChoiceAge.current.classList.remove("bg-white");
        selectRegionCity.current.classList.add("text-black");
        selectRegionCity.current.classList.add("bg-white");
      }
      // 우선 받아온 포차정보대로 값세팅 그래야 선택된것처럼 보이는값 들어가니
      dispatch(changeCreateRoomChoiceAge( pochaInfo.data.age));
      dispatch(changeCreateRoomChoiceRegion(pochaInfo.data.region));
    }
  }, []);

  // 선택한 나이에 따른 state 변경
  const onSelectAge = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    selectChoiceAge.current.classList.add("text-black");
    selectChoiceAge.current.classList.add("bg-white");
    selectRegionCity.current.classList.remove("text-black");
    selectRegionCity.current.classList.remove("bg-white");
    switch (selectTitle) {
      case "나이":
        dispatch(changeCreateRoomChoiceAge(0));
        break;
      case "지역":
        dispatch(changeCreateRoomChoiceRegion("전국"));
    }
  };

  // 선택한 지역에 따른 state 변경
  const onSelectRegion = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    selectChoiceAge.current.classList.remove("text-black");
    selectChoiceAge.current.classList.remove("bg-white");
    selectRegionCity.current.classList.add("text-black");
    selectRegionCity.current.classList.add("bg-white");
    const clickData = event.currentTarget;
    switch (selectTitle) {
      case "나이":
        const sendData: number = Number(clickData.innerText.substring(0, 2));
        dispatch(changeCreateRoomChoiceAge(sendData));
        break;
      case "지역":
        dispatch(changeCreateRoomChoiceRegion(clickData.innerText));
        break;
    }
  };

  return (
    <div className="flex w-full h-12 mb-10 font-bold items-center">
      <div className="text-left text-xl mr-10">{selectTitle}</div>
      <div
        onClick={onSelectAge}
        ref={selectChoiceAge}
        className={`${style.selectHover} border border-white bg-white w-[6.5rem] h-full text-black text-lg flex justify-center items-center cursor-pointer`}
      >
        {selectFirst}
      </div>
      <div
        onClick={onSelectRegion}
        ref={selectRegionCity}
        className={`${style.selectHover} border border-white w-[6.5rem] h-full text-lg flex justify-center items-center cursor-pointer`}
      >
        {selectSecond}
      </div>
    </div>
  );
};

export default MainCreateRoomSelect;
