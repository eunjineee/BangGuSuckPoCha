import "./App.css";
import { Routes, Route } from "react-router-dom";
import Main from "./components/Main/Main";
import SignUp from "./components/SignUp/Signup";
import Login from "./components/Login/Login";
import Loading from "./components/Common/Loading";
import GameRoom from "./components/GameRoom/GameRoom";
import StoryRoom from "./components/StoryRoom/StoryRoom";
import MeetingRoom from "./components/MeetingRoom/MeetingRoom";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminMain from "./components/Admin/AdminMain";
import UserList from "./components/Admin/UserList";
import UserReport from "./components/Admin/UserReport";
import UserReportWait from "./components/Admin/UserReportWait";
import RoomList from "./components/Admin/RoomList";
import LoginLoading from "./components/Login/LoginLoading";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReviewPage from "./components/ReviewPage/ReviewPage";
import AdminAdd from "./components/Admin/AdminAdd";
import AdminGameSetting from "./components/Admin/AdminGameSetting";
import NewMyPage from "./components/MyPage/NewMypage";
import PointHistory from "./components/MyPage/PointHistory";

function App() {
  return (
    <div className="App bg-black">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick={true}
        draggable
        pauseOnHover
        theme="dark"
        icon={({ type }) => {
          switch (type) {
            case "success":
              return "💚";
            case "error":
              return "❗";
            case "info":
              return "🗨";
          }
        }}
        progressStyle={{
          height: "0.1rem",
        }}
        style={{
          fontSize: "1rem",
          minWidth: "fit-content",
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/gameroom/:PochaId" element={<GameRoom />} />
        <Route path="/storyroom/:PochaId" element={<StoryRoom />} />
        <Route path="/meetingroom/:PochaId" element={<MeetingRoom />} />
        <Route path="/newmypage" element={<NewMyPage />} />
        <Route path="/pointhistory" element={<PointHistory />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminmain" element={<AdminMain />} />
        <Route path="/adminadd" element={<AdminAdd />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/userreport" element={<UserReport />} />
        <Route path="/userreport/wait" element={<UserReportWait />} />
        <Route path="/roomlist" element={<RoomList />} />
        <Route path="/loginloading" element={<LoginLoading />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/admingamesetting" element={<AdminGameSetting />} />
      </Routes>
    </div>
  );
}

export default App;
