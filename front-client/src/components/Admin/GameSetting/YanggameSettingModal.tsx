import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "src/store/hooks";
import { showYanggameSettingModal } from "src/store/store";
import styles from "./BalancegameSettingModal.module.css";
const YanggameSettingModal = () => {
  const dispatch = useAppDispatch();

  const [Type, setType] = useState<any>();
  const [Word, setWord] = useState<any>();
  const [YscInfo, setYscInfo] = useState<any>();
  //수정
  const [ModifyCheck, setModifyCheck] = useState(false);
  const [ModifyYscId, setModifyYscId] = useState<any>();

  //백그라운드 div
  const bgDiv = useRef<any>();

  // 프로필선택 모달 끄는 함수
  function CloseYangSettingModal(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === bgDiv.current) {
      console.log("양세찬세팅창꺼짐!");
      dispatch(showYanggameSettingModal());
    }
  }

  const ShowModify = (data: any) => {
    console.log(ModifyCheck);

    console.log("수정하자");
    setModifyYscId(data.yscid);
    setType(data.type);
    setWord(data.word);
    setModifyCheck(true);
  };

  const CloseModify = () => {
    setModifyYscId(``);
    setType(``);
    setWord(``);
    setModifyCheck(false);
  };

  const ChangeType = (event: any) => {
    console.log(event.target.value);
    setType(event.target.value);
  };
  const ChangeWord = (event: any) => {
    console.log(event.target.value);
    setWord(event.target.value);
  };

  const ChangeTypeInput = (event: any) => {
    console.log("왼쪽값변경", event.target.value);
    setType(event.target.value);
  };

  const ChangeWordInput = (event: any) => {
    console.log("오른쪽값변경", event.target.value);
    setWord(event.target.value);
  };

  const Save = () => {
    axios({
      method: "post",
      url: "https://i8e201.p.ssafy.io/api/admin/game/ysc",
      data: {
        type: Type,
        word: Word,
      },
    }).then((r) => {
      const result = r.data.message;
      if (result === "success") {
        toast.success("추가되었습니다!");
        axios({
          method: "get",
          url: `https://i8e201.p.ssafy.io/api/pocha/game/ysc`,
        }).then((r) => {
          setYscInfo(r.data.data);
        });
      } else {
        toast.warning("⛔ 추가 실패 ⛔ ");
      }
    });
  };
  useEffect(() => {
    axios({
      method: "get",
      url: "https://i8e201.p.ssafy.io/api/pocha/game/ysc",
    }).then((r) => {
      console.log(r.data.data);

      setYscInfo(r.data.data);
    });
  }, []);

  return (
    <>
      <div
        ref={bgDiv}
        onMouseDown={CloseYangSettingModal}
        className={`z-10 bg-slate-800 bg-opacity-75 fixed top-0 right-0 bottom-0 left-0 flex flex-col justify-center items-center text-white`}
      >
        <>
          <div className="w-[50rem] h-[50rem] border-2 flex flex-row border-white rounded-[6rem] flex flex-col items-center ">
            <div className="h-[11%] w-[78%] text-3xl">YSC Game</div>
            <div className="h-[10%] w-[78%] flex flex-row justify-start p-">
              <div className="h-[100%] w-[30%] p-5">
                <div
                  className="border-2 h-[100%] w-[100%] rounded-md  cursor-pointer"
                  onClick={() => {
                    axios({
                      method: "get",
                      url: "https://i8e201.p.ssafy.io/api/pocha/game/ysc",
                    }).then((r) => {
                      console.log("양세찬 게임 데이터", r.data.data);
                    });
                  }}
                >
                  양세찬게임 데이터
                </div>
              </div>
              <div className="h-[100%] w-[30%] p-5 "></div>
            </div>

            <div
              className={`h-[60%] w-[90%] border-2  ${styles.hideScroll}`}
              style={{ overflow: "auto" }}
            >
              {/* <div className={`h-[60%] w-[90%] border-2  overflow-y-auto`}> */}
              <table className="table-auto h-[100%] w-[100%]">
                <thead>
                  <tr className="border-2">
                    <th className="w-[40%]">주제</th>
                    <th className="w-[50%]">단어</th>
                    <th className="w-[5%]">수정</th>
                    <th className="w-[5%]">삭제</th>
                  </tr>
                </thead>
                <tbody className="max-h-[10rem]">
                  {YscInfo
                    ? YscInfo.map((it: any) => {
                        return (
                          <tr className="h-10 border-b-[1px] border-dashed">
                            <td>{it.type}</td>
                            <td>{it.word}</td>
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
                                  url: `https://i8e201.p.ssafy.io/api/admin/game/ysc/${it.yscId}`,
                                }).then((r) => {
                                  axios({
                                    method: "get",
                                    url: `https://i8e201.p.ssafy.io/api/pocha/game/ysc`,
                                  }).then((r) => {
                                    setYscInfo(r.data.data);
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
                      placeholder="타입 ⚪ "
                      onChange={ChangeTypeInput}
                      value={Type}
                    />
                    <div className="w-[10%] text-center flex justify-center items-center">
                      <div> -</div>
                    </div>
                    <input
                      className="w-[45%] bg-transparent text-center border-2"
                      type={"text"}
                      placeholder="단어 ⚫ "
                      onChange={ChangeWordInput}
                      value={Word}
                    />
                  </div>
                ) : (
                  // 양세찬 게임 수정
                  <div className="h-[10%] w-[90%] flex flex-row p-3">
                    <input
                      className="w-[45%] bg-transparent text-center border-2"
                      type={"text"}
                      placeholder="타입 ⚪ "
                      onChange={ChangeTypeInput}
                      value={Type}
                    />
                    <div className="w-[10%] text-center flex justify-center items-center">
                      <div> 수정</div>
                    </div>
                    <input
                      className="w-[45%] bg-transparent text-center border-2"
                      type={"text"}
                      placeholder="단어 ⚫ "
                      onChange={ChangeWordInput}
                      value={Word}
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

                        dispatch(showYanggameSettingModal());
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
                            url: `https://i8e201.p.ssafy.io/api/admin/game/balance/${ModifyYscId}`,
                            data: {
                              type: Type,
                              word: Word,
                            },
                          }).then((r) => {
                            toast.success("수정완료");
                            axios({
                              method: "get",
                              url: `https://i8e201.p.ssafy.io/api/pocha/game/ysc`,
                            }).then((r) => {
                              setYscInfo(r.data.data);
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
        </>
      </div>
    </>
  );
};

export default YanggameSettingModal;
