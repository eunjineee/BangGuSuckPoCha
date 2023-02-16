import { useState, useRef, useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { changeCreateRoomChoicePeople } from "../../store/store";
import style from "./MainCreateRoom.module.css";

const MainCreateRoomPeople = ({ selectOption, pochaInfo }: { selectOption: string[], pochaInfo?: any }) => {
  const dispatch = useAppDispatch()
  const [selectTitle, ...selectPeople] = selectOption;
  const selectHumans = useRef<any>([]);
  const [people, setPeople] = useState<any>(null);

  useEffect(() => {
    // 포차 정보 있을때
    console.log('포차정보: ', pochaInfo);
    
    if (pochaInfo) {
      const index = Number(pochaInfo.limitUser) - 2;
      console.log("포차 정보", pochaInfo);
      console.log("인덱스", index);
      console.log(selectHumans.current[index]);
      
      selectHumans.current[index]?.classList.toggle("text-black");
      selectHumans.current[index]?.classList.toggle("bg-white");
      setPeople(selectHumans.current[index]);
      dispatch(changeCreateRoomChoicePeople(pochaInfo.limitUser));
      return
    }
    console.log("정보 없을 때 ", selectHumans.current[0]);
    
    // 처음에 제일 첫번째 값 선택세팅
    selectHumans.current[0].classList.toggle("text-black");
    selectHumans.current[0].classList.toggle("bg-white");
    setPeople(selectHumans.current[0]);
    dispatch(changeCreateRoomChoicePeople(2))
  }, [])


  const onSelect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {    
    // 선택한값이 다르면 기존꺼 끄고 새로운거 선택
    if (event.target !== people) {
      people?.classList.toggle("text-black");
      people?.classList.toggle("bg-white");
      (event.target as Element).classList.toggle("text-black");
      (event.target as Element).classList.toggle("bg-white");
      setPeople(event.target);
      const numPeople = event.target as HTMLElement;
      dispatch(changeCreateRoomChoicePeople(numPeople.innerText))
    } 
    
    
  };
  return (
    <div className="flex w-full h-12 mb-10 font-bold items-center">
      <div className="text-left text-xl mr-10">{selectTitle}</div>
      {selectPeople.map((people, index) => (
        <div
          onClick={onSelect}
          key={index}
          ref={(tag) => {
            selectHumans.current[index] = tag;
          }}
          className={`${style.selectHover} mr-4 border-2 rounded-full border-white w-16 h-full text-lg flex justify-center items-center cursor-pointer`}
        >
          {people}
        </div>
      ))}
    </div>
  );
};

export default MainCreateRoomPeople;
