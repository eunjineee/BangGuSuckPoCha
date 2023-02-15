import axios from "axios";
import React from "react";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  changeNavAlarmReviewEmojiUserData,
  isRtcLoading,
  showPublicModal,
  showRoomUserProfile,
} from "../../store/store";
import Loading from "../Common/Loading";
import RoomUserProfile from "../Common/RoomUserProfile";

// webRTC관련
const socket = io("https://pocha.online");

const WebRTC = ({
  pochaId,
  propSocket,
  propIsHost,
  getPochaInfo,
}: {
  pochaId: string;
  propSocket: Function;
  propIsHost: Function;
  getPochaInfo: Function;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let accessToken = localStorage.getItem("accessToken");
  const myUserName = localStorage.getItem("Username");
  // 나의 비디오 ref
  const myFace = useRef<HTMLVideoElement>(null);
  // 음소거 버튼
  const muteBtn = useRef<HTMLButtonElement>(null);
  // 카메라 온오프 버튼
  const cameraBtn = useRef<HTMLButtonElement>(null);
  // 카메라 선택 버튼
  const cameraSelect = useRef<HTMLSelectElement>(null);
  // 옵션 태그 리스트
  const [optionList, setOptionList] = useState<any[]>([]);
  // 짠 카운트
  const [count, setCount] = useState<string>("");
  // 정보 변경 업데이트용 변수
  // const [updateCheck, setUpdateCheck] = useState<boolean>(false);
  // const currentUsers = useRef<any>([1]);
  // useRef 배열
  const div1 = useRef<HTMLDivElement>(null);
  const div2 = useRef<HTMLDivElement>(null);
  const div3 = useRef<HTMLDivElement>(null);
  const div4 = useRef<HTMLDivElement>(null);
  const div5 = useRef<HTMLDivElement>(null);
  const div6 = useRef<HTMLDivElement>(null);
  // const peerFace = useRef<any>([]);
  const peerFace1 = useRef<HTMLVideoElement>(null);
  const peerFace2 = useRef<HTMLVideoElement>(null);
  const peerFace3 = useRef<HTMLVideoElement>(null);
  const peerFace4 = useRef<HTMLVideoElement>(null);
  const peerFace5 = useRef<HTMLVideoElement>(null);

  const myStream = useRef<any>(null);
  // let myStream: any;
  const roomName: any = pochaId;
  const myPeerConnections = useRef<any>({});
  // let myPeerConnections: any = {};
  // const [userCount, setUserCount] = useState<number>(1);
  const userCount = useRef<number>(1);

  // 방장 체크
  const [isHost, setIsHost] = useState<boolean>(false);
  // useEffect(() => {
  //   console.log("방ㅈㅈㅈㅈㅈㅈㅈ장 맞습니까?", isHost);
  // }, [isHost])

  // webRTC Loading 상태 가져옴
  const isLoading = useAppSelector((state) => {
    return state.webRtcLoading;
  });

  // 유저들 프로파일 모달 상태 가져옴
  const isRoomUserProfile = useAppSelector((state) => {
    return state.RoomUserProfileClickCheck;
  });

  // 요청한 유저프로필 데이터
  const [userProfileData, setUserProfileData] = useState(null);

  // 요청한 포차참여 유저들 데이터
  // const [pochaUsers, setPochaUsers] = useState<any>(null);

  // 포차 참여유저 데이터 axios 요청
  async function getUsersProfile() {
    // // console.log(pochaId);
    // try {
    //   const {
    //     data: { data },
    //   } = await axios({
    //     url: `https://i8e201.p.ssafy.io/api/pocha/participant/${pochaId}`,
    //     headers: {
    //       accessToken: `${accessToken}`,
    //     },
    //   });
    //   const lastIndex = data.length - 1;
    //   console.log("참여 유저들 데이터?", data);

    //   // 방장 여부 체크
    //   data.forEach((user: any) => {
    //     if (user.username === myUserName) {
    //       setIsHost(user.isHost);
    //       propIsHost(user.isHost);
    //     }
    //   });
    //   dispatch(isRtcLoading(false));
    //   handleWelcomeSubmit(data[lastIndex]);
    // } catch (error) {
    //   console.log("포차 참여유저 데이터 axios error", error);
    // }

    axios({
      url: `https://i8e201.p.ssafy.io/api/pocha/participant/${pochaId}`,
      headers: {
        accessToken: `${accessToken}`,
      },
    }).then((r) => {
      //토큰이상해
      if ("401" === r.data.status) {
        //토큰 재요청
        console.log("토큰 이상함");
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
            console.log("재발급 성공", r.data.accessToken);
            localStorage.setItem("accessToken", r.data.accessToken);
            accessToken = r.data.accessToken;
            //원래 axios 실행
            axios({
              url: `https://i8e201.p.ssafy.io/api/pocha/participant/${pochaId}`,
              headers: {
                accessToken: `${accessToken}`,
              },
            }).then((r) => {
              const lastIndex = r.data.data.length - 1;
              console.log("참여 유저들 데이터?", r.data.data);

              // 방장 여부 체크
              r.data.data.forEach((user: any) => {
                if (user.username === myUserName) {
                  setIsHost(user.isHost);
                  propIsHost(user.isHost);
                }
              });
              dispatch(isRtcLoading(false));
              handleWelcomeSubmit(r.data.data[lastIndex]);
            });
          }
        });
      }
      //토큰 정상이야
      else {
        //실행 결과값 그대로 실행
        const lastIndex = r.data.data.length - 1;
        console.log("참여 유저들 데이터?", r.data.data);
        // 방장 여부 체크
        r.data.data.forEach((user: any) => {
          if (user.username === myUserName) {
            setIsHost(user.isHost);
            propIsHost(user.isHost);
          }
        });
        dispatch(isRtcLoading(false));
        handleWelcomeSubmit(r.data.data[lastIndex]);
      }
    });
  }

  // 포차 참여유저 데이터 axios 요청
  async function getUsersProfileAgain() {
    // console.log(pochaId);
    try {
      const {
        data: { data },
      } = await axios({
        url: `https://i8e201.p.ssafy.io/api/pocha/participant/${pochaId}`,
      });
      console.log("재 요청한 참여 유저들 데이터?", data);

      // 방장 여부 체크
      data.forEach((user: any) => {
        if (user.username === myUserName) {
          setIsHost(user.isHost);
          propIsHost(user.isHost);
        }
      });
      dispatch(isRtcLoading(false));
    } catch (error) {
      console.log("포차 재요청한 참여유저 데이터 axios error", error);
    }
  }

  // 카메라 뮤트
  const [muted, setMuted] = useState<boolean>(false);
  // 카메라 오프
  const [cameraOff, setCameraOff] = useState<boolean>(false);
  // let muted = useRef<boolean>(false);
  // let muted = false;
  // 카메라 오프
  // let cameraOff = useRef<boolean>(false);
  // let cameraOff = false;
  // let userCount = 1;

  // 최초실행
  useEffect(() => {
    propSocket(socket);
    getUsersProfile();
    // userCount.current = 1
    return () => {
      userCount.current = 1;
    };
  }, []);

  // 카메라들 가져오는 함수
  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");
      // const currentCamera = myStream.getVideoTracks()[0];
      cameras.forEach((camera, index) => {
        // const option = React.createElement("option", 	{
        //   value = camera.deviceId,
        // },);
        // console.log('라벨',camera.label)
        const option: JSX.Element = (
          <option key={index} value={camera.deviceId}>
            {camera.label}
          </option>
        );
        // option.value = camera.deviceId;
        // option.innerText = camera.label;
        // if (currentCamera.id === camera.deviceId) {
        //   option.selected = true;
        // }
        // cameraSelect.current?.appendChild(option);
        setOptionList((prev) => [...prev, option]);
      });
    } catch (e) {
      console.log("0", e);
    }
  };

  async function getMedia(deviceId?: string) {
    let myStreamData;
    const initialConstraing = {
      audio: true,
      video: { facingMode: "user" },
    };
    const cameraConstraing: any = {
      audio: true,
      video: { deviceid: { exact: deviceId } },
    };
    try {
      if (deviceId) {
        myStreamData = await navigator.mediaDevices.getUserMedia(
          cameraConstraing
        );
        myStream.current = myStreamData;
        // setMyStream(myStreamData);
        // myStream = await navigator.mediaDevices.getUserMedia(cameraConstraing);
      } else {
        myStreamData = await navigator.mediaDevices.getUserMedia(
          initialConstraing
        );
        myStream.current = myStreamData;
        // setMyStream(myStreamData);
        // myStream = await navigator.mediaDevices.getUserMedia(initialConstraing);
      }
      console.log("마이스트림 오냐?", myStream.current);
      myFace.current!.srcObject = myStream.current;
      myFace.current!.volume = 0;
      if (!deviceId) {
        await getCameras();
      }
    } catch (e) {
      console.log("마이스트림 에러", e);
    }
  }

  // 소리 끄는 함수
  function handleMuteClick() {
    console.log("버튼클릭>?", muted);
    myStream.current
      .getAudioTracks()
      .forEach((track: any) => (track.enabled = !track.enabled));
    // if (!muted) {
    //   muteBtn.current!.innerText = "🔈";
    // } else {
    //   muteBtn.current!.innerText = "🔊";
    // }
    setMuted((prev) => !prev);
  }

  // 카메라 끄는 함수
  function handleCameraClick() {
    // console.log("꺼지냐", myStream)
    myStream.current
      .getVideoTracks()
      .forEach((track: any) => (track.enabled = !track.enabled));
    // if (!cameraOff) {
    //   cameraBtn.current!.innerText = "Camera On";
    // } else {
    //   cameraBtn.current!.innerText = "Camera Off";
    // }
    setCameraOff((prev) => !prev);
  }

  // 카메라 바꿀때 옵션 변경했으니 getMedia 다시실행해준다(이제는 특정카메라id도 담아서 실행)
  async function handleCameraChange() {
    await getMedia(cameraSelect.current!.value);
    // 카메라 옵션 변경시 업데이트 코드
    myPeerConnections.current.forEach((myPeerConnection: any) => {
      if (myPeerConnection) {
        const videoTrack = myStream.current.getVideoTracks()[0];
        const videoSender = myPeerConnection
          .getSenders()
          .find((sender: any) => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);
      }
    });
  }

  // ---Welcome Form (join a room)---
  async function handleWelcomeSubmit(userData: any) {
    // event : React.FormEvent<HTMLFormElement>
    // event.preventDefault();
    await getMedia();
    // console.log("@@@@@@@@@@@@@@@@", userData);
    socket.emit("join_room", {
      roomName,
      username: userData.username,
      nickname: userData.nickname,
    });
    // roomName = welcomeInput.current?.value;
    // welcomeInput.current!.value = "";
  }

  // ------ Socket Code ------
  // Socket Code
  useEffect(() => {
    socket.on("users_of_room", async (users) => {
      // console.log("--------------------");
      await users.forEach((user: any) => {
        console.log(user);
        myPeerConnections.current[user.id] = {
          username: user.username,
          nickname: user.nickname,
        };
        // console.log(
        //   "방 입장--------------",
        //   myPeerConnections.current[user.id]
        // );
      });
    });

    socket.on("welcome", async (socketId, user) => {
      let myPeer = makeConnection();

      myPeerConnections.current[socketId] = {
        peer: myPeer,
        username: user.username,
        nickname: user.nickname,
      };
      console.log(
        "환영!!!!----------------------------",
        myPeerConnections.current[socketId]
      );

      const offer = await myPeerConnections.current[socketId][
        "peer"
      ].createOffer();
      myPeerConnections.current[socketId]["peer"].setLocalDescription(offer);

      const receivers =
        myPeerConnections.current[socketId]["peer"].getReceivers();
      const peerStream = new MediaStream([
        receivers[0].track,
        receivers[1].track,
      ]);
      handleAddStream(
        peerStream,
        myPeerConnections.current[socketId].username,
        myPeerConnections.current[socketId].nickname
      );
      console.log("sent the offer");

      socket.emit("offer", offer, socketId, roomName, {
        username: user.username,
        nickname: user.nickname,
      });
    });

    socket.on("offer", async (offer, socketId, userInfo) => {
      console.log("received the offer");
      myPeerConnections.current[socketId]["peer"] = makeConnection();
      myPeerConnections.current[socketId]["peer"].setRemoteDescription(offer);
      const answer = await myPeerConnections.current[socketId][
        "peer"
      ].createAnswer();

      myPeerConnections.current[socketId]["peer"].setLocalDescription(answer);
      const receivers =
        myPeerConnections.current[socketId]["peer"].getReceivers();
      const peerStream = new MediaStream([
        receivers[0].track,
        receivers[1].track,
      ]);
      handleAddStream(
        peerStream,
        myPeerConnections.current[socketId].username,
        myPeerConnections.current[socketId].nickname
      );

      socket.emit("answer", answer, socketId, roomName);
      console.log("sent the answer");
    });

    socket.on("answer", (answer, socketId) => {
      console.log("received the answer");
      myPeerConnections.current[socketId]["peer"].setRemoteDescription(answer);
    });

    socket.on("ice", (ice, socketId) => {
      console.log("received the candidate");
      if (
        myPeerConnections.current[socketId]["peer"] === null ||
        myPeerConnections.current[socketId]["peer"] === undefined
      ) {
        return;
      }
      myPeerConnections.current[socketId]["peer"].addIceCandidate(ice);
    });

    socket.on("user_exit", ({ id }) => {
      delete myPeerConnections.current[id];
      // 사람수 - 2 해야 마지막인덱스값
      // const lastIndex = userCount.current - 2;
      // const lastIndex = userCount - 2
      // peerFace.current[lastIndex].classList.toggle("hidden");

      // 정보 다시 한번 받아옴
      getUsersProfileAgain();
      console.log("==============>방 탈출!!!");
      console.log(id);

      // userCount = 1;
      // setUserCount(1);
      userCount.current = 1;
      // setUserCount(1);

      const keys = Object.keys(myPeerConnections.current);
      for (let socketID of keys) {
        console.log("---------");
        console.log(myPeerConnections.current[socketID]);
        // console.log(myPeerConnections.current[socketID].getReceivers());
        console.log("---------");
        const receivers =
          myPeerConnections.current[socketID]["peer"].getReceivers();
        const peerStream = new MediaStream([
          receivers[0].track,
          receivers[1].track,
        ]);
        handleAddStream(
          peerStream,
          myPeerConnections.current[socketID].username,
          myPeerConnections.current[socketID].nickname
        );
      }

      let temp = userCount.current;
      // let temp = userCount;
      if (temp < 6) {
        while (temp < 6) {
          // peerFace.current[temp - 1].srcObject = null;
          // if (temp === 1) {
          //   peerFace.current[0].srcObject = null;
          // } else if (temp === 2) {
          //   peerFace.current[1].srcObject = null;
          // } else if (temp === 3) {
          //   peerFace.current[2].srcObject = null;
          // }
          if (temp === 1) {
            peerFace1.current!.srcObject = null;
          } else if (temp === 2) {
            peerFace2.current!.srcObject = null;
          } else if (temp === 3) {
            peerFace3.current!.srcObject = null;
          } else if (temp === 4) {
            peerFace4.current!.srcObject = null;
          } else if (temp === 5) {
            peerFace5.current!.srcObject = null;
          }
          temp += 1;
        }
      }
    });

    socket.on("room_full", () => {
      toast.info("인원이 가득찬 포차입니다");
      navigate(`/main`);
    });

    return () => {
      socket.off("welcome");
      socket.off("users_of_room");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice");
      socket.off("user_exit");
      socket.off("room_full");
    };
  }, []);

  // ------------ 포차 기능 code --------------
  const ssulTitle = useRef<HTMLDivElement>(null);
  const [ssul, setSsul] = useState<string>("");
  const [jjanImg, setJjanImg] = useState<any>(
    require("src/assets/theme/jjan1.png")
  );

  // //  axios
  // const api = axios.create({
  //   baseURL: "https://i8e201.p.ssafy.io/api",
  //   headers: {
  //     "Content-Type": "application/json;charset=utf-8",
  //   },
  // });

  //  포차 짠 함수
  const jjan = () => {
    let time: number = 3;
    setCount(String(time));
    setJjanImg(require("src/assets/theme/jjan1.png"));
    const interval = setInterval(() => {
      time -= 1;
      setCount(String(time));
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setJjanImg(require("src/assets/theme/jjan2.png"));
      setCount("짠!!!!");
    }, 3000);
    setTimeout(() => {
      setCount("");
      dispatch(showPublicModal(false));
    }, 4000);
  };

  useEffect(() => {
    // 썰 변경! : 방 설정 다시 불러오기.
    socket.on("ssul_change", async (ssul) => {
      console.log("썰 변경!----------------------");
      setSsul(ssul);
      // 방 설정 다시 불러오기!!! 테스트
      // await pocha_config_update("3");
    });

    // 포차 설정 변경! : 방 설정 다시 불러오기.
    socket.on("pocha_change", async () => {
      console.log("포차 설정 변경!----------------------");
      // setUpdateCheck((prev) => !prev);
      getPochaInfo();
      toast.success("포차 설정이 변경되었습니다");
      // 방 설정 다시 불러오기!!! 테스트
      // await pocha_config_update("3");
    });

    // 포차 시간 연장! : 방 설정 다시 불러오기.
    socket.on("pocha_extension", async () => {
      console.log("포차 시간 연장!----------------------");
      // 방 설정 다시 불러오기!!! 테스트
      // await pocha_config_update("3");
    });

    // 포차 짠! 기능 : 방 설정 다시 불러오기.
    socket.on("pocha_cheers", async () => {
      console.log("포차 짠!!!!!------------ㅇ----------");
      jjan();
    });

    // 포차 강퇴 기능 : 이름찾아서 내보내기
    socket.on("ban", (username) => {
      console.log(username, "강퇴!!!!-------");
      if (myUserName === username) {
        localStorage.setItem("reloadBan", "true");
        navigate(`/main`);
        window.location.reload();
      }
    });
    return () => {
      socket.off("pocha_change");
      socket.off("pocha_extension");
      socket.off("pocha_cheers");
      socket.off("ban");
    };
  }, []);

  // ------------- RTC Code --------------
  function makeConnection() {
    let myPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ],
    });
    myPeerConnection.addEventListener("icecandidate", handleIce);
    //myPeerConnection.addEventListener("addstream", handleAddStream);
    myStream.current.getTracks().forEach((track: any) => {
      myPeerConnection.addTrack(track, myStream.current);
    });
    return myPeerConnection;
  }

  // icecandidate 이벤트시 실행 함수
  function handleIce(data: any) {
    console.log("sent candidate");
    // icecandidate를 만들면 이걸 또 서버로 보내줌
    socket.emit("ice", data.candidate, roomName);
  }

  // addStream 이벤트시 실행 함수
  async function handleAddStream(
    stream: any,
    username: string,
    nickname: string
  ) {
    console.log("handleAddStream---------------------", username);

    // filter로 username의 정보 가져옴
    // let peerInfo = null;
    // try {
    //   const {
    //     data: { data },
    //   } = await axios({
    //     url: `https://i8e201.p.ssafy.io/api/pocha/participant/${pochaId}`,
    //   });

    //   peerInfo = data.filter((user:any) => user.username === username)[0];
    // } catch (error) {
    //   console.log("포차 참여유저 데이터 axios error", error);
    // }
    console.log(userCount.current, "사람수 몇명이냐@@@@@@???");
    if (userCount.current === 1) {
      div3.current!.classList.add("hidden");
      peerFace2.current!.classList.add("hidden");
      peerFace1.current!.srcObject = stream;
      peerFace1.current!.id = username;
      // if(peerInfo.isHost){
      //   peerFace1.current!.classList.add("border-8")
      // }
    } else if (userCount.current === 2) {
      div3.current!.classList.remove("hidden");
      peerFace2.current!.classList.remove("hidden");
      div4.current!.classList.add("hidden");
      peerFace3.current!.classList.add("hidden");
      peerFace2.current!.srcObject = stream;
      peerFace2.current!.id = username;
      // if(peerInfo.isHost){
      //   peerFace2.current!.classList.add("border-8")
      // }
    } else if (userCount.current === 3) {
      div4.current!.classList.remove("hidden");
      peerFace3.current!.classList.remove("hidden");
      div5.current!.classList.add("hidden");
      peerFace4.current!.classList.add("hidden");
      peerFace3.current!.srcObject = stream;
      peerFace3.current!.id = username;
      // if(peerInfo.isHost){
      //   peerFace3.current!.classList.add("border-8")
      // }
    } else if (userCount.current === 4) {
      div5.current!.classList.remove("hidden");
      peerFace4.current!.classList.remove("hidden");
      div6.current!.classList.add("hidden");
      peerFace5.current!.classList.add("hidden");
      peerFace4.current!.srcObject = stream;
      peerFace4.current!.id = username;
      // if(peerInfo.isHost){
      //   peerFace4.current!.classList.add("border-8")
      // }
    } else if (userCount.current === 5) {
      div6.current!.classList.remove("hidden");
      peerFace5.current!.classList.remove("hidden");
      peerFace5.current!.srcObject = stream;
      peerFace5.current!.id = username;
      // if(peerInfo.isHost){
      //   peerFace5.current!.classList.add("border-8")
      // }
    }
    userCount.current += 1;
  }

  // 유저들 프로파일 모달 띄우기
  const ShowUserProfile = async (event: React.MouseEvent<any>) => {
    if (userCount.current >= 2) {
      const username = event.currentTarget.id;
      console.log("여긴 이벤트: ", event);

      // // console.log("모달용 데이터 닉?", username);
      // const { data } = await axios({
      //   url: `https://i8e201.p.ssafy.io/api/user/info/${username}`,
      //   headers: {
      //     accessToken: `${accessToken}`,
      //   },
      // });
      // console.log("모달용 데이터?", data);
      // dispatch(changeNavAlarmReviewEmojiUserData(data));
      // dispatch(showRoomUserProfile());
      // // setUserProfileData(data);
      // // dispatch(isRtcLoading(false));

      axios({
        url: `https://i8e201.p.ssafy.io/api/user/info/${username}`,
        headers: {
          accessToken: `${accessToken}`,
        },
      }).then((r) => {
        //토큰이상해
        if ("401" === r.data.status) {
          //토큰 재요청
          console.log("토큰 이상함");
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
              console.log("재발급 성공", r.data.accessToken);
              localStorage.setItem("accessToken", r.data.accessToken);
              accessToken = r.data.accessToken;
              //원래 axios 실행
              axios({
                url: `https://i8e201.p.ssafy.io/api/user/info/${username}`,
                headers: {
                  accessToken: `${accessToken}`,
                },
              }).then((r) => {
                console.log("모달용 데이터?", r.data);
                dispatch(changeNavAlarmReviewEmojiUserData(r.data));
                dispatch(showRoomUserProfile());
              });
            }
          });
        }
        //토큰 정상이야
        else {
          //실행 결과값 그대로 실행
          console.log("모달용 데이터?", r.data);
          dispatch(changeNavAlarmReviewEmojiUserData(r.data));
          dispatch(showRoomUserProfile());
        }
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isRoomUserProfile && userProfileData && (
            <RoomUserProfile
              userData={userProfileData}
              pochaId={pochaId}
              isHost={isHost}
              socket={socket}
            />
          )}
          {/* 여기가 짠 나타나는곳 */}
          {count ? (
            <div className=" bg-black bg-opacity-70 flex flex-col justify-center z-20 items-center fixed top-0 right-0 bottom-0 left-0">
              <img src={jjanImg} alt="jjan" />
              <div className="text-7xl font-bold text-white fixed top-28 z-30">
                {count}
              </div>
            </div>
          ) : null}

          <div className="text-white w-full min-h-[85vh]">
            {ssul && (
              <span className="font-bold text-3xl fixed left-10 bottom-10">{`💬${ssul}`}</span>
            )}
            <div className="flex flex-col justify-evenly items-center min-h-[85vh]">
              <div className="flex w-full justify-evenly items-center ">
                {/* 내 비디오 공간 */}
                <div
                  ref={div1}
                  className="rounded-[1rem] overflow-hidden border-2 w-[28rem] my-3"
                >
                  <video
                    className="object-fill"
                    ref={myFace}
                    playsInline
                    autoPlay
                  ></video>
                </div>
                {/* 다른 사람들 비디오 공간 */}
                <div
                  ref={div2}
                  className={
                    userCount.current >= 2
                      ? "rounded-[1rem] overflow-hidden border-2 w-[28rem] my-3"
                      : "rounded-[1rem] overflow-hidden w-[28rem] h-[21rem] border-2 my-3"
                  }
                >
                  <video
                    onClick={ShowUserProfile}
                    className="object-fill cursor-pointer"
                    ref={peerFace1}
                    playsInline
                    autoPlay
                  ></video>
                </div>
                <div
                  ref={div3}
                  className="rounded-[1rem] overflow-hidden w-[28rem] border-2 hidden my-3"
                >
                  <video
                    onClick={ShowUserProfile}
                    className="object-fill cursor-pointer hidden"
                    ref={peerFace2}
                    playsInline
                    autoPlay
                  ></video>
                </div>
              </div>
              <div className="flex w-full justify-evenly items-center ">
                <div
                  ref={div4}
                  className="rounded-[1rem] overflow-hidden w-[28rem] border-2 hidden my-3"
                >
                  <video
                    onClick={ShowUserProfile}
                    className="object-fill cursor-pointer hidden"
                    ref={peerFace3}
                    playsInline
                    autoPlay
                  ></video>
                </div>
                <div
                  ref={div5}
                  className="rounded-[1rem] overflow-hidden w-[28rem] border-2 hidden my-3"
                >
                  <video
                    onClick={ShowUserProfile}
                    className="object-fill cursor-pointer hidden"
                    ref={peerFace4}
                    playsInline
                    autoPlay
                  ></video>
                </div>
                <div
                  ref={div6}
                  className="rounded-[1rem] overflow-hidden w-[28rem] border-2 hidden my-3"
                >
                  <video
                    onClick={ShowUserProfile}
                    className="object-fill cursor-pointer hidden"
                    ref={peerFace5}
                    playsInline
                    autoPlay
                  ></video>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center ">
              <div className="flex w-fit">
                {/* 뮤트 */}
                <button
                  className="p-3 w-16"
                  onClick={handleMuteClick}
                  ref={muteBtn}
                >
                  {muted ? (
                    <img
                      className=""
                      src={require("src/assets/roomIcon/offmic.png")}
                      alt="offmic"
                    />
                  ) : (
                    <img
                      className=""
                      src={require("src/assets/roomIcon/onmic.png")}
                      alt="mic"
                    />
                  )}
                </button>
                {/* 카메라 */}
                <button
                  className="p-3 w-16"
                  onClick={handleCameraClick}
                  ref={cameraBtn}
                >
                  {cameraOff ? (
                    <img
                      className=""
                      src={require("src/assets/roomIcon/offcamera.png")}
                      alt="offcamera"
                    />
                  ) : (
                    <img
                      className=""
                      src={require("src/assets/roomIcon/oncamera.png")}
                      alt="onmic"
                    />
                  )}
                </button>
                {/* 카메라 옵션 */}
                <div className="h-6 pt-6 mx-5">
                  <select
                    className="text-black"
                    onInput={handleCameraChange}
                    ref={cameraSelect}
                  >
                    {optionList}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WebRTC;
