import http from "http";
// import WebSocket from "ws";
// import { Server } from "socket.io";
// import { instrument } from "@socket.io/admin-ui";
import SocketIO from "socket.io";
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use("/public", express.static(__dirname + "/public"));
app.use(
  cors({
    origin: "*",
  })
);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "PUT", "POST", "HEAD", "PATCH", "DELETE"],
  },
});

const handleListen = () =>
  console.log("Listening on https://pocha.online:4000");
httpServer.listen(4000, handleListen);

let waitRoom = {};
let waitToRoom = {};
let waitUsers = {};

let users = {};
let socketToRoom = {};

const maximum = 6;

wsServer.on("connection", (socket) => {
  socket.on("join_room", ({ roomName, username, nickname, introduce }) => {
    if (users[roomName]) {
      const length = users[roomName].length;
      if (length == maximum) {
        socket.emit("room_full");
        return;
      }
      socket.emit("users_of_room", users[roomName]);
      users[roomName].push({
        id: socket.id,
        username: username,
        nickname: nickname,
      });
    } else {
      users[roomName] = [
        { id: socket.id, username: username, nickname: nickname },
      ];
    }
    socketToRoom[socket.id] = roomName;

    socket.join(roomName);

    socket
      .to(roomName)
      .emit("welcome", socket.id, { username, nickname, introduce });
  });
  socket.on("offer", (offer, socketId, roomName, userInfo) => {
    socket.to(socketId).emit("offer", offer, socket.id, userInfo);
  });
  socket.on("answer", (answer, socketId, roomName) => {
    socket.to(socketId).emit("answer", answer, socket.id);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice, socket.id);
  });

  // 포차 나가기를 socket 서버에서 실행.
  socket.on("disconnect", async () => {
    let roomID;
    let username;
    if (waitToRoom[socket.id] == null || waitToRoom[socket.id] == undefined) {
      roomID = socketToRoom[socket.id];
      delete socketToRoom[socket.id];
      let room = users[roomID];
      socket.leave(roomID);
      if (room) {
        username = room.filter((user) => user.id == socket.id)[0].username;
        await axios({
          url: `https://i8e201.p.ssafy.io/api/pocha/exit`,
          method: "put",
          data: {
            isHost: true,
            pochaId: Number(roomID),
            username: username,
            waiting: true,
          },
        }).then(() => {
          room = room.filter((user) => user.id !== socket.id);
          users[roomID] = room;
          if (room.length === 0) {
            delete users[roomID];
            return;
          }
          socket.to(roomID).emit("user_exit", { id: socket.id });
        });
      }
    } else {
      roomID = waitToRoom[socket.id];
      delete waitToRoom[socket.id];
      let room = waitUsers[roomID];
      if (room) {
        username = room.filter((user) => user.id == socket.id)[0].username;
        await axios({
          url: `https://i8e201.p.ssafy.io/api/pocha/exit`,
          method: "put",
          data: {
            isHost: true,
            pochaId: Number(roomID),
            username: username,
            waiting: true,
          },
        }).then(() => {
          room = room.filter((user) => user.id !== socket.id);
          waitUsers[roomID] = room;
          if (room.length === 0) {
            delete waitUsers[roomID];
            return;
          }
          room.forEach((element) => {
            wsServer.to(element.id).emit("wait_update");
          });
        });
      }
    }
  });

  /////////////////////////////////////////////////
  // 포차 기능!!

  // 썰 변경
  socket.on("ssul_change", (roomName, ssul) => {
    wsServer.to(roomName).emit("ssul_change", ssul);
  });

  // 포차 설정 변경
  socket.on("pocha_change", (roomName, flag) => {
    // 설정만 변경하는 건지, 포차를 변경하는 건지
    if(flag){
      delete users[roomName];
    }
    wsServer.to(roomName).emit("pocha_change");
  });

  // 포차 시간 연장
  socket.on("pocha_extension", (roomName) => {
    wsServer.to(roomName).emit("pocha_extension");
  });

  // 포차 짠 기능.
  socket.on("pocha_cheers", (roomName) => {
    wsServer.to(roomName).emit("pocha_cheers");
  });

  // 포차 대기
  socket.on("wait", async (info) => {
    if (
      waitRoom[info.roomName] == null ||
      waitRoom[info.roomName] == undefined
    ) {
      waitRoom[info.roomName] = info.limit;
    }

    const roomName = info.roomName;

    if (waitUsers[roomName]) {
      const length = waitUsers[roomName].length;
      if (length == waitRoom[roomName]) {
        socket.emit("room_full");
        return;
      }
      waitUsers[roomName].push({
        id: socket.id,
        username: info.username,
        nickname: info.nickname,
      });
    } else {
      waitUsers[roomName] = [
        { id: socket.id, username: info.username, nickname: info.nickname },
      ];
    }
    waitToRoom[socket.id] = roomName;
    console.log("wait 확인용");
    console.log(waitUsers[roomName]);
    // 대기 인원이 가득 찼는지 확인.
    if (waitUsers[roomName].length == waitRoom[roomName]) {
      // await axios : 미팅 포차 시작.
      await axios({
        url: `https://i8e201.p.ssafy.io/api/pocha/meeting/start/${roomName}`,
        method: "put",
      }).then((result) => {
        if (result.data.message === "success") {
          const now = new Date();

          waitUsers[roomName].forEach((element) => {
            wsServer.to(element.id).emit("wait_end", now);
            delete waitToRoom[element.id];
          });
          delete waitUsers[roomName];
          delete waitRoom[roomName];
        }
      });
    } else {
      waitUsers[roomName].forEach((element) => {
        wsServer.to(element.id).emit("wait_update");
      });
    }
  });

  // 포차 강퇴 기능.
  socket.on("ban", (roomName, username) => {
    wsServer.to(roomName).emit("ban", username);
  });

  // 포차 하트 시그널 기능.
  socket.on("add_heart", (info) => {
    wsServer.to(info.roomName).emit("add_heart", info.targetUser);
  });

  // 미팅 포차 알림 제거
  socket.on("close_notice", (roomName) => {
    wsServer.to(roomName).emit("close_notice");
  })

  /////////////////////////////////////////////////

  // 게임 기능!!
  // 게임선택버튼 호버
  socket.on("game_btn_hover", (roomName, elementId) => {
    wsServer.to(roomName).emit("game_btn_hover", elementId);
  });
  // 게임 선택
  socket.on("game_select", (roomName, gameId) => {
    wsServer.to(roomName).emit("game_select", gameId);
  });
  // 게임 선택창으로 돌아가기
  socket.on("game_back_select", (roomName) => {
    wsServer.to(roomName).emit("game_back_select");
  });

  // 룰렛
  socket.on("game_roulette", (roomName, random) => {
    wsServer.to(roomName).emit("game_roulette", random);
  });

  // 밸런스게임
  socket.on("game_balance", (roomName) => {
    wsServer.to(roomName).emit("game_balance");
  });

  // 손병호 게임
  // 손병호게임 여러 시그널
  socket.on("game_son_signal", (roomName, signalData, data) => {
    wsServer.to(roomName).emit("game_son_signal", signalData, data);
  });
  // 게임 시작 신호
  socket.on("game_son", (roomName) => {
    wsServer.to(roomName).emit("game_son");
  });
  // 손가락 접기
  socket.on("game_son_fold", (roomName, socketId) => {
    wsServer.to(roomName).emit("game_son_fold", socketId);
  });
  // 다음 턴
  socket.on("game_son_turn", (roomName, turn) => {
    wsServer.to(roomName).emit("game_son_turn", turn);
  });

  // 라이어 게임
  // 라이어게임 여러 시그널
  socket.on("game_liar_signal", (roomName, signalData, data) => {
    console.log('data는 뭐야??', data);
    wsServer.to(roomName).emit("game_liar_signal", signalData, data);
  });

  // 라이어 넘버 보내주기
  socket.on("game_liar_number", (roomName, data) => {
    console.log('라이어 번호 소켓으로 전달', data);
    wsServer.to(roomName).emit("game_liar_number", data);
  });

  // 라이어 주제 보내주기
  socket.on("game_liar_nowtitle", (roomName, data) => {
    console.log('라이어 주제 소켓으로 전달', data);
    wsServer.to(roomName).emit("game_liar_nowtitle", data);
  });


  // 스무고개 게임
  // 스무고개 intro 시그널
  socket.on("game_twenty_signal", (roomName, signalData, data) => {
    wsServer.to(roomName).emit("game_twenty_signal", signalData, data);
  });

  // 스무고개 submit 시그널
  socket.on("game_twenty_submit", (roomName, signalData, data, data2) => {
    wsServer.to(roomName).emit("game_twenty_submit", signalData, data, data2);
  });

  // 스무고개 play 시그널
  socket.on("game_twenty_play", (roomName, signalData, data, number) => {
    wsServer.to(roomName).emit("game_twenty_play", signalData, data, number);
  });

  // 밸런스 게임 Play
  socket.on("game_balance_Intro", (roomName, isBalance) => {
    wsServer.to(roomName).emit("game_balance_Intro", isBalance);
  });

  // 밸런스 게임 romantic,normal 클릭
  socket.on("game_balance_typeChange", (roomName, choiceType) => {
    console.log("choiceType?", choiceType);
    wsServer.to(roomName).emit("game_balance_typeChange", choiceType);
  });
  
  // 밸런스 게임 테마에 따른 내용 변경
  socket.on("game_balance_subjectChange", (roomName, themeDataList) => {
    console.log("choiceType?", themeDataList);
    wsServer.to(roomName).emit("game_balance_subjectChange", themeDataList);
  });

  //정한 라이어 보내기
    socket.on("game_liar_number", (roomName, data) => {
    wsServer.to(roomName).emit("game_liar_number", data);
  });
  
  //정한 라이어 투표하기
  socket.on("game_liar_vote", (roomName, myNum, num) => {
    wsServer.to(roomName).emit("game_liar_vote", myNum, num);
  });

  // 양세찬 게임
  // 양세찬 게임 여러 시그널
  socket.on("game_call_signal", (roomName, signalData, data) => {
    wsServer.to(roomName).emit("game_call_signal", signalData, data);
  });
  //주제들 뿌려줌
  socket.on("game_call_submit", (roomName, signalData, data) => {
    wsServer.to(roomName).emit("game_call_submit", signalData, data);
  });
  // 통과
  socket.on("game_call_pass", (roomName, data) => {
    wsServer.to(roomName).emit("game_call_pass", data);
  });
  // 결과
  socket.on("game_call_result", (roomName, signalData, data) => {
    wsServer.to(roomName).emit("game_call_result", signalData, data);
  });

});