import { useEffect } from "react";
import { useAppDispatch } from "src/store/hooks";
import { LadderChange } from "src/store/store";
import styles from "./Ladder.module.css";

function Ladder({
  socket,
  pochaId,
  pochaUsers,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
}): React.ReactElement {
  const dispatch = useAppDispatch();
  const roomName = pochaId;

  // ==========상수===================
  const MAX_HORIZONTAL_BAR = 8; //최대 가로줄 갯수

  var HORIZONTAL_BAR = 0; //가로줄
  var VERTICAL_BAR = 1; //세로줄

  var DIRECTION_RIGHT = 0; //오른쪽
  var DIRECTION_LEFT = 1; //왼쪽
  // ==========상수===================

  // ==========전역변수===================
  var tableRowSize = 0; //사다리 테이블 가로 크기
  var tableColSize = 0; //사다리 테이블 세로 크기

  var peopleCount: any = 2; //참가자 수
  var randomNum = 1; //랜덤 넘버

  var debugFlag = true; //디버깅 플래그

  var oLadderDiv: any = null; //사다리 TABLE DIV
  var oDebugDiv = null; //디버그용 DIV

  var oLadderTable = null; //사다리 테이블

  var ladderArray: any = null; //사다리 정보 이차 배열

  // const usersLength = pochaUsers.length;
  console.log("포차유저", pochaUsers);

  const onClickClose = () => {
    socket.emit("game_back_select", roomName);
  };

  // =============함수=========

  function makeLadder() {
    initData();

    //입력한 참가자 값
    var nameArray = new Array();
    // var oNames = document.getElementsByName("peopleName");
    var oNames = document.getElementsByName("peopleName");

    for (var i = 0; i < oNames.length; i++) {
      // nameArray[i] = oNames[i].value;
    }

    //입력한 결과 값
    var resultArray = new Array();
    var oResults = document.getElementsByName("result");

    for (var i = 0; i < oResults.length; i++) {
      // resultArray[i] = oResults[i].value;
    }

    //사다리 테이블 DIV 내용 삭제
    oLadderDiv.innerHTML = "";

    //시작 버튼
    for (var i = 0; i < peopleCount; i++) {
      var oInput = document.createElement("IMG");
      // oInput.type = "image";
      // oInput.src = "./asset_ladder/Rectangle " + (i + 1) + ".png";
      // oInput.name = "startImg";
      oInput.className = "startImg";
      oInput.id = "startImg";

      var oSpan = document.createElement("span");
      oSpan.className = "txtSpan";
      oSpan.appendChild(oInput);

      oLadderDiv.appendChild(oSpan);
    }

    //한 줄 띄우기
    var oDiv = document.createElement("div");
    oDiv.style.height = "10px";
    oLadderDiv.appendChild(oDiv);

    //테이블 생성
    var oTable = document.createElement("table");
    // oTable.border = 0;
    // oTable.cellPadding = 0;
    // oTable.cellSpacing = 0;
    oTable.id = "ladderTable";

    //행
    for (var i = 0; i < tableRowSize; i++) {
      var oTR = document.createElement("tr");

      //열
      for (var j = 0; j < tableColSize; j++) {
        var oTD = document.createElement("td");

        //class 설정
        if (j % 2 == 0) {
          if (i % 2 == 0) {
            oTD.className = "vTD";
          } else {
            oTD.className = "dotTD";
          }
        } else {
          if (i % 2 == 1 && i < tableRowSize - 1) {
            if (ladderArray[i][j]) {
              oTD.className = "hTD";
            }
          }
        }
        oTR.appendChild(oTD);
      }
      oTable.appendChild(oTR);
    }

    //테이블을 오른쪽으로 밀기 위한 DIV
    var oTableDiv = document.createElement("div");
    oTableDiv.className = "tableDiv";
    oTableDiv.appendChild(oTable);
    oLadderDiv.appendChild(oTableDiv);

    //결과
    for (var i = 0; i < peopleCount; i++) {
      var oInput = document.createElement("IMG");
      // oInput.type = "image";
      // oInput.className = "result";
      // oInput.name = "result";
      oInput.id = "result";
      if (i == randomNum) {
        oInput.setAttribute("src", "./asset_ladder/Drink.png");
      } else {
        oInput.setAttribute("src", "./asset_ladder/PASS.png");
      }

      oInput.style.display = "none";
      var oSpan = document.createElement("span");
      oSpan.className = "txtSpan2";
      oSpan.appendChild(oInput);
      oLadderDiv.appendChild(oSpan);
    }

    //결과 물음표
    for (var i = 0; i < peopleCount; i++) {
      // var oInput = document.createElement("IMG");
      // oInput.type = "image";
      // oInput.className = "questionmark";
      // oInput.id = "questionmark";
      // oInput.setAttribute("src", "./asset_ladder/물음표" + (i + 1) + ".png");
      // oInput.style.display = "inline";

      var oSpan = document.createElement("span");
      oSpan.className = "txtSpan2";
      // oSpan.appendChild(oInput);
      oLadderDiv.appendChild(oSpan);
    }

    //DIV에 테이블을 appendChild하면
    //테이블이 보여야 하는데 보이지 않아 이렇게 처리

    //Internet Explorer 7 에러?
    oLadderDiv.innerHTML = oLadderDiv.innerHTML;
    oLadderTable = document.getElementById("ladderTable");

    //시작 버튼에 이벤트 붙이기
    //시작 버튼 생성 시에 이벤트를 붙이면 실행되지 않음
    //이건 IE, FF 모두에서 발생!
    var oButtons = document.getElementsByName("startImg");

    for (var i = 0; i < peopleCount; i++) {
      // addEvent(oButtons[i], "click", startGame, false);
    }
  }



  //데이터 초기화
  function initData() {
    tableRowSize = MAX_HORIZONTAL_BAR * 2 + 1;
    tableColSize = peopleCount * 2 - 1;

    //테이블과 사다리 가로줄 배열의 크기는 같다.
    ladderArray = new Array();
    for (var i = 0; i < tableRowSize; i++) {
      ladderArray[i] = new Array();
      for (var j = 0; j < tableColSize; j++) {
        ladderArray[i][j] = false;
      }
    }
    //맨 첫번째와 마지막 가로줄, 세로줄을 제외한 나머지에 가로줄을 설정
    for (var i = 1; i < tableColSize; i += 2) {
      var hBarCount = 0; //한 열의 가로줄 갯수
      for (var j = 1; j < tableRowSize; j += 2) {
        //1/2 확률로 가로줄 세팅
        var rate = Math.floor(Math.random() * 2);
        if (rate == 0) {
          if (checkAdjasentBar(j, i)) {
            ladderArray[j][i] = true;
            hBarCount++;
          }
        }
        //가로줄 최대 3개
        if (hBarCount >= 3) {
          j = tableRowSize;
        }
      }
      //하나도 없을 경우 재시작
      if (hBarCount == 0) {
        i -= 2; //i를 감소시키면 자동 증가해서 값이 변하지 않아 재시작
      }
    }
  }
  //왼쪽 열에 가로줄이 있는지 체크
  function checkAdjasentBar(i: any, j: any) {
    //좌: i, j-2
    if (j - 2 >= 0 && ladderArray[i][j - 2]) return false;
    return true;
  }

  //랜덤
  function randomInt(min: any, max: any) {
    var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum;
  }

  //참가자 결정
  function People() {
    peopleCount = window.prompt("사람수 입력");
    randomNum = randomInt(0, peopleCount - 1);
    console.log(randomNum);
    makeLadder();
  }

  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.titlespan}`}>사다리타기</div>
      <div className={`${styles.ladderForm} ${styles.layout}`}>
        <div className={`${styles.box} ${styles.layout2}`}>
          {/* 사다리 테이블 */}
          {/* <div className="flex flex-row w-full h-full border-2">안녕</div> */}
          <div
            id="ladderDiv"
            className={`${styles.ladderDiv} flex flex-col w-full h-full  `}
          >
            <div className="h-[30%] border-2">위쪽 헤더</div>
            <div className="h-[40%] border-2">중앙 선</div>
            <div className="h-[30%] border-2">아래쪽 결과</div>
          </div>
        </div>
        <div className={`${styles.layout3}`}>
          <input
            type="button"
            className={`${styles.retry}`}
            onClick={() => {
              console.log("ladder재시작한다");
              dispatch(LadderChange());
            }}
            value="RETRY"
          />
          <input
            type="button"
            className={`${styles.retry}`}
            onClick={() => {
              console.log("ladder끈다");
              onClickClose();
            }}
            value="EXIT"
          />
        </div>
      </div>
    </div>
  );
}

export default Ladder;
