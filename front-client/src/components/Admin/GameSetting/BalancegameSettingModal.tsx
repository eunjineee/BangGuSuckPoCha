import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "src/store/hooks";
import { showBalancegameeSettingModal } from "src/store/store";
import styles from "./BalancegameSettingModal.module.css";

const BalancegameSettingModal = () => {
  const dispatch = useAppDispatch();

  //useState
  const [Select, setSelect] = useState("0");
  const [Balance, setBalance] = useState<any>();
  const [LeftInput, setLeftInput] = useState<any>();
  const [RightInput, setRightInput] = useState<any>();
  //수정
  const [ModifyCheck, setModifyCheck] = useState(false);
  const [ModifybalanceId, setModifybalanceId] = useState<any>();

  //백그라운드 div
  const bgDiv = useRef<any>();

  // 프로필선택 모달 끄는 함수
  function CloseBalanceSettingModal(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === bgDiv.current) {
      console.log("밸런스세팅창꺼짐!");
      dispatch(showBalancegameeSettingModal());
    }
  }

  const ChangeLeftInput = (event: any) => {
    console.log("왼쪽값변경", event.target.value);
    setLeftInput(event.target.value);
  };

  const ChangeRightInput = (event: any) => {
    console.log("오른쪽값변경", event.target.value);
    setRightInput(event.target.value);
  };

  const ShowModify = (data: any) => {
    console.log(ModifyCheck);

    console.log("수정하자");
    setModifybalanceId(data.balanceId);
    setLeftInput(data.question1);
    setRightInput(data.question2);
    setModifyCheck(true);
  };

  const CloseModify = () => {
    setModifybalanceId(``);
    setLeftInput(``);
    setRightInput(``);
    setModifyCheck(false);
  };

  const Save = () => {
    axios({
      method: "post",
      url: "https://i8e201.p.ssafy.io/api/admin/game/balance",
      data: {
        question1: LeftInput,
        question2: RightInput,
        type: Select,
      },
    }).then((r) => {
      const result = r.data.message;
      if (result === "success") {
        toast.success("추가되었습니다!");
        axios({
          method: "get",
          url: `https://i8e201.p.ssafy.io/api/pocha/game/balance/${Select}`,
        }).then((r) => {
          // console.log("밸런스 게임 데이터 0", r.data.data);
          setBalance(r.data.data);
        });
      } else {
        toast.warning("⛔ 추가 실패 ⛔ ");
      }
    });
  };

  useEffect(() => {
    axios({
      method: "get",
      url: "https://i8e201.p.ssafy.io/api/pocha/game/balance/0",
    }).then((r) => {
      // console.log("밸런스 게임 데이터 0", r.data.data);
      setBalance(r.data.data);
    });

    return () => {};
  }, []);

  return (
    <>
      <div
        ref={bgDiv}
        onMouseDown={CloseBalanceSettingModal}
        className={`z-10 bg-slate-900 bg-opacity-90 fixed top-0 right-0 bottom-0 left-0 flex flex-col justify-center items-center text-white`}
      >
        <div className="w-[80rem] h-[50rem] border-2 border-white rounded-[6rem] flex flex-col justify-center items-center">
          <div className="h-[11%] w-[78%]">BalanceGame</div>
          <div className="h-[10%] w-[78%] flex flex-row justify-start p-">
            <div className="h-[100%] w-[30%] p-5">
              <div
                className="border-2 h-[100%] w-[100%] rounded-md  cursor-pointer"
                onClick={() => {
                  axios({
                    method: "get",
                    url: "https://i8e201.p.ssafy.io/api/pocha/game/balance/0",
                  }).then((r) => {
                    console.log("밸런스 게임 데이터 0", r.data.data);
                    setSelect("0");
                    setBalance(r.data.data);
                  });
                }}
              >
                게임포차 데이터
              </div>
            </div>
            <div className="h-[100%] w-[30%] p-5 ">
              <div
                className="border-2 h-[100%] w-[100%] rounded-md cursor-pointer"
                onClick={() => {
                  axios({
                    method: "get",
                    url: "https://i8e201.p.ssafy.io/api/pocha/game/balance/1",
                  }).then((r) => {
                    console.log("밸런스 게임 데이터 1", r.data.data);
                    setSelect("1");
                    setBalance(r.data.data);
                  });
                }}
              >
                미팅포차 데이터
              </div>
            </div>
          </div>

          <div
            className={`h-[60%] w-[90%] border-2  ${styles.hideScroll}`}
            style={{ overflow: "auto" }}
          >
            {/* <div className={`h-[60%] w-[90%] border-2  overflow-y-auto`}> */}
            <table className="table-auto h-[100%] w-[100%]">
              <thead>
                <tr className="border-2">
                  <th className="w-[45%]">선택1</th>
                  <th className="w-[45%]">선택2</th>
                  <th className="w-[5%]">수정</th>
                  <th className="w-[5%]">삭제</th>
                </tr>
              </thead>
              <tbody className="max-h-[10rem]">
                {Balance
                  ? Balance.map((it: any) => {
                      return (
                        <tr className="h-10 border-b-[1px] border-dashed">
                          <td>{it.question1}</td>
                          <td>{it.question2}</td>
                          <td
                            className="p-2 cursor-pointer hover:scale-125"
                            onClick={() => {
                              ShowModify(it);
                            }}
                          >
                            ⚙
                          </td>
                          <td
                            className=" p-2 cursor-pointer hover:scale-125"
                            onClick={() => {
                              console.log("나 클릭");
                              axios({
                                method: "delete",
                                url: `https://i8e201.p.ssafy.io/api/admin/game/balance/${it.balanceId}`,
                              }).then((r) => {
                                axios({
                                  method: "get",
                                  url: `https://i8e201.p.ssafy.io/api/pocha/game/balance/${Select}`,
                                }).then((r) => {
                                  setBalance(r.data.data);
                                });
                                toast.success("삭제완료");
                              });
                            }}
                          >
                            ❌
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
          <>
            <>
              {ModifyCheck === false ? (
                // 양세찬 게임 입력
                <div className="h-[10%] w-[90%] flex flex-row p-3">
                  <input
                    className="w-[45%] bg-transparent text-center border-2"
                    type={"text"}
                    placeholder="선택 ⚪ "
                    onChange={ChangeLeftInput}
                    value={LeftInput}
                  />
                  <div className="w-[10%] text-center flex justify-center items-center">
                    <div> VS</div>
                  </div>
                  <input
                    className="w-[45%] bg-transparent text-center border-2"
                    type={"text"}
                    placeholder="선택 ⚫ "
                    onChange={ChangeRightInput}
                    value={RightInput}
                  />
                </div>
              ) : (
                // 양세찬 게임 수정
                <div className="h-[10%] w-[90%] flex flex-row p-3">
                  <input
                    className="w-[45%] bg-transparent text-center border-2"
                    type={"text"}
                    placeholder="선택 ⚪ "
                    onChange={ChangeLeftInput}
                    value={LeftInput}
                  />
                  <div className="w-[10%] text-center flex justify-center items-center">
                    <div> 수정</div>
                  </div>
                  <input
                    className="w-[45%] bg-transparent text-center border-2"
                    type={"text"}
                    placeholder="선택 ⚫ "
                    onChange={ChangeRightInput}
                    value={RightInput}
                  />
                </div>
              )}
            </>
            <>
              {ModifyCheck === false ? (
                <div className="h-[10%] w-[78%] flex flex-row justify-center items-center">
                  <div
                    className="w-[30%] p-2 border-2 rounded-full cursor-pointer"
                    onClick={() => {
                      Save();
                    }}
                  >
                    {" "}
                    저장하기
                  </div>
                  <div className="w-[40%]"> </div>
                  <div
                    className="w-[30%] p-2 border-2 rounded-full cursor-pointer"
                    onClick={() => {
                      console.log("모달창 off");

                      dispatch(showBalancegameeSettingModal());
                    }}
                  >
                    {" "}
                    나가기
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-[10%] w-[78%] flex flex-row justify-center items-center">
                    <div
                      className="w-[30%] p-2 border-2 rounded-full cursor-pointer"
                      onClick={() => {
                        axios({
                          method: "put",
                          url: `https://i8e201.p.ssafy.io/api/admin/game/balance/${ModifybalanceId}`,
                          data: {
                            question1: LeftInput,
                            question2: RightInput,
                            type: Select,
                          },
                        }).then((r) => {
                          toast.success("수정완료");
                          axios({
                            method: "get",
                            url: `https://i8e201.p.ssafy.io/api/pocha/game/balance/${Select}`,
                          }).then((r) => {
                            setBalance(r.data.data);
                          });
                        });
                      }}
                    >
                      수정하기
                    </div>
                    <div className="w-[40%]"> </div>
                    <div
                      className="w-[30%] p-2 border-2 rounded-full cursor-pointer"
                      onClick={() => {
                        CloseModify();
                        console.log("수정취소");
                      }}
                    >
                      입력하러가기
                    </div>
                  </div>
                </>
              )}
            </>
          </>
        </div>
      </div>
    </>
  );
};

export default BalancegameSettingModal;
