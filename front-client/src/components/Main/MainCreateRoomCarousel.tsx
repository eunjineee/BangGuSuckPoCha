import styles from "./Main.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation, EffectCoverflow  } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/controller";
import { useAppDispatch } from "../../store/hooks";
import { changeCarouselState, changeThemeRoomState } from "../../store/store";
import { useRef } from "react";



function MainCreateRoomCarousel() {
  let dispatch = useAppDispatch();
  const bgDiv = useRef<any>();

  // 캐러셀 모달 끄는거
  function CloseCarouselModal(event : any ) {
    if(event.target === bgDiv.current) {
      console.log("cliiick")
      dispatch(changeCarouselState())
      // onClickHiddenBtn();
    } else {
      console.log("여기아님");
    }
    
  }

  return (
    <div
      ref={bgDiv}
      onMouseDown={CloseCarouselModal}
      className="bg-zinc-900 bg-opacity-90 absolute h-screen w-screen grid z-10"
      style={{ gridTemplateRows: "1fr 5fr 1fr" }}
    >
      <div
        className={`bg-zinc-900 bg-opacity-90  text-white flex justify-center items-end  font-nanum font-bold text-[2rem] pb-0 `}
      >
        포차를 선택해주세요
      </div>
      <Swiper
        effect={"slide"}
        grabCursor={true}
        speed={800}
        modules={[EffectCards, Navigation, EffectCoverflow ]}
        className="mySwiper"
        style={{
          backgroundColor: "rgab(0,0,0,0)",
          position: "relative",
          width: "44%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minWidth: "40rem",
        }}
        navigation={true}
      >
        <SwiperSlide
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "5rem 0px 5rem 0px",
          }}
        >
          <img
            className={`transition-all duration-300 ${styles.carouselImg}`}
            style={{ objectFit: "contain", height: "100%" }}
            src={require("src/assets/img/Talk2.png")}
            alt=""
            onClick={() => {
              dispatch(changeCarouselState());
              dispatch(changeThemeRoomState(1));
            }}
          />
        </SwiperSlide>
        <SwiperSlide
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "5rem 0px 5rem 0px",
          }}
        >
          <img
            className={`transition-all duration-300 ${styles.carouselImg}`}
            style={{ objectFit: "contain", height: "100%" }}
            src={require("src/assets/img/Game2.png")}
            alt=""
            onClick={() => {
              dispatch(changeCarouselState());
              dispatch(changeThemeRoomState(2));
            }}
          />
        </SwiperSlide>
        <SwiperSlide
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "5rem 0px 5rem 0px",
          }}
        >
          <img
            className={`transition-all duration-300 ${styles.carouselImg}`}
            style={{ objectFit: "contain", height: "100%" }}
            src={require("src/assets/img/Meeting2.png")}
            alt=""
            onClick={() => {
              dispatch(changeCarouselState());
              dispatch(changeThemeRoomState(3));
            }}
          />
        </SwiperSlide>
      </Swiper>
      <div className="">2</div>
    </div>
  );
}

export default MainCreateRoomCarousel;
