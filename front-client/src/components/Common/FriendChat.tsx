import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import styles from '../Common/Common.module.css'

import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function FriendChat():JSX.Element {
  const navigate = useNavigate()
  const friendChat = useRef<any>(null);
  //  메뉴 -> 친구 클릭 -> 챗팅
  const menuFriendChatClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendChatClickCheck
  })
  const userName = localStorage.getItem("Username");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  // 채팅구역
  const chatArea = useRef<any>(null) 
  const client = useRef<any>({});

  useEffect(()=> {
    if (menuFriendChatClickCheck) {
      friendChat.current.classList.remove("hidden");
    } else {
      friendChat.current.classList.add("hidden");
    }
  },[menuFriendChatClickCheck])


  const [message, setMessage] = useState<any>();
  const [inputChat, setInputChat] = useState<any>()
  // const [sendCheck, setsendCheck] = useState<any>(0)

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);
  
  useEffect(()=> {
    const chat_id = localStorage.getItem('chat_id')
    axios({
      method:'get',
      url:`https://i8e201.p.ssafy.io/api/user/friend/chat/${chat_id}`,
      headers: {
        accessToken: `${accessToken}`,
      },
    }).then((r)=> {
      // 토큰 갱신 필요
      if (r.data.status === '401') {
        axios({
          method: 'get',
          url:`https://i8e201.p.ssafy.io/api/user/auth/refresh/${userName}`,
          headers: {
            refreshToken: `${refreshToken}`,
          }
        }).then((r)=> {
          // 돌려보내기
          if (r.data.status === '401') {
            localStorage.clear();
            toast.error('인증되지 않은 유저입니다')
            navigate('/')
          } else {
            // 엑세스 토큰 추가
            localStorage.setItem("accessToken", r.data.accessToken);
            // 재요청  
            axios({
              method:'get',
              url:`https://i8e201.p.ssafy.io/api/user/friend/chat/${chat_id}`,
              headers: {
                accessToken: `${r.data.accessToken}`,
              },
            }).then((r)=> {
              setMessage(r.data.data)
              setTimeout(() => {
                scrollToBottom()
              }, 100);
            })
          }
        })
      } else {
        // 토큰에 문제 없을 때
        setMessage(r.data.data)
        setTimeout(() => {
          scrollToBottom()
        }, 100);
      }
    })
  },[])


  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: 'ws://i8e201.p.ssafy.io/api/ws/chat', // 왜 websocket을 붙여줘야하는거지..?
      webSocketFactory: () => new SockJS("https://i8e201.p.ssafy.io/api/ws/chat"),
      debug: function (str) {
          console.log(str);
      },
      onConnect:() => { 
        console.log("onConnect");
        const chat_id = localStorage.getItem('chat_id')
        client.current.subscribe("/sub/chat/"+ chat_id, function(newMessage:any) {
          const msg = JSON.parse(newMessage.body)
          setMessage((_chat_list:any)=> [..._chat_list, msg])
          setTimeout(() => {
            scrollToBottom()
          }, 100);
        });
      },
    });
      client.current.activate();
      
    }

  const disconnect = () => {
    client.current.deactivate();
  };

  
  const publish = (inputChat:any) => {
    const chat_id = localStorage.getItem('chat_id')
    const userId = localStorage.getItem('userId')
    if (!client.current.connected) {
      return;
    }

    client.current.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify({chat_id:chat_id, user_id:userId, content:inputChat}),
    });

    setInputChat("");
  };

  const handleChange = (event:any) => { // 채팅 입력 시 state에 값 설정
    setInputChat(event.target.value);
  };


  function MyChat({content}:any):JSX.Element {
    return (
      // <div className="flex justify-end items-center my-[0.25rem] ">
        <div className="grid w-full " style={{gridTemplateColumns: '3fr 2fr'}}>
          <div className="inline-flex justify-start items-center whitespace-normal ">
            <span className="text-white rounded-lg h-[100%] py-1 bg-gray-500/70  font-medium text-[1.2rem]">&nbsp;&nbsp;{content}&nbsp;&nbsp;</span>
          </div>
          <div className=""></div>
        </div>
      // </div>
    )
  }

  function OtherChat({content}:any):JSX.Element {
    return (
      // <div className="flex justify-end items-center my-[0.25rem] ">
        <div className="grid w-full " style={{gridTemplateColumns: '2fr 3fr'}}>
          <div className=""></div>
          <div className="inline-flex justify-end items-center whitespace-normal ">
            <span className="text-white rounded-lg h-[100%] py-1 bg-green-400/80 font-medium text-[1.2rem]">&nbsp;&nbsp;{content}&nbsp;&nbsp;</span>
          </div>
        </div>
      // </div>
    )
  }

  const scrollToBottom = () => {
    if (chatArea.current) {
      chatArea.current.scrollTop = chatArea.current.scrollHeight
    }
  };

  

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      publish(inputChat)

      setTimeout(() => {
        scrollToBottom()
      }, 100);
      
      setInputChat("");
    }
  };

  const f_nickname = localStorage.getItem('f_nickname') 

  return (
    <div ref={friendChat} className="absolute  w-[33rem] h-[35rem] max-h-[35rem] top-[11.6rem] right-[19rem] hidden">
        <div className="relative grid w-full h-full rounded-[24px] bg-black text-white" style={{gridTemplateRows: '0.5fr 0.5fr 7fr 1fr', border:'solid 2px white'}}>
            <div className="flex justify-center items-center h-[1.8rem] max-h-[1.8rem] w-full  text-white rounded-[100px] ">채팅</div>
            <div className={`flex justify-center items-center h-[2.6rem] max-h-[2.6rem] w-full  rounded-[15px] text-lg tracking-wide ${styles.nickNameNeon}`}>{f_nickname}</div>
            {/* 채팅 공간 */}
            <div ref={chatArea} className={`grid w-full bg-black h-full text-white overflow-scroll ${styles.hideScroll}`} style={{gridAutoRows: 'auto'}}>
              { 
                message&&message.map((chat:any)=>{
                  // console.log(chat)
                  return ( 
                    <div className="w-full h-full my-[0.35rem]">
                      {
                        chat.user_nickname === f_nickname? <MyChat content={chat.content}/>: <OtherChat content={chat.content}/>
                      }
                    </div>
                  )
                })
              }
            </div>

            <div className="grid h-full w-full" style={{gridTemplateColumns: '1fr 0.12fr'}}>
              <input className="my-auto mx-auto h-[55%] w-[90%] max-w-[90%] rounded-[24px] pl-4 text-black" style={{border: 'groove 2px rgba(225,225,225,0.4)'}} placeholder='Search for anything...'  type="text" value={inputChat} 
              onChange={handleChange} 
              onKeyDown={handleKeyPress}
              />
              <div className="my-auto mr-[10%] h-[55%] w-[90%] mx-auto">
                <img className="cursor-pointer" src={require('../../assets/friendChatIcon/dm.png')} alt="" onClick={()=>{
                  publish(inputChat)
                  setTimeout(() => {
                    scrollToBottom()
                  }, 100);
                  // setsendCheck(sendCheck+1)
                }}/>
              </div>
            </div>
      </div>
    </div>
  )
}
export default FriendChat
