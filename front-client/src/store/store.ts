// createSlice: store state 생성 (name: state 변수 이름, initialState: 초기 데이터, reducers: state 변경 함수)
import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import exp from "constants";
import { create } from "domain";

/*
===============================================================================================================================
==========================================================일반데이터===========================================================
===============================================================================================================================
*/
const menuClickCheck = createSlice({
  name: "menuClick",
  initialState: false,
  reducers: {
    changeMenuState(state) {
      return !state;
    },
  },
});

const myInfo = createSlice({
  name: "myInfo",
  initialState: "",
  reducers: {
    changeMyInfo(state, action) {
      return (state = action.payload);
    },
  },
});

// 마이페이지에 있는 유저 프로필설정 클릭 여부
const MyPageProfileClickCheck = createSlice({
  name: "MyPageProfileClickCheck",
  initialState: false,
  reducers: {
    showMyPageProfileSelect(state) {
      return !state;
    },
  },
});

//GameSetting Modal clickcheck
const YanggameSettingModalClickCheck = createSlice({
  name: "YanggameSettingModalClickCheck",
  initialState: false,
  reducers: {
    showYanggameSettingModal(state) {
      return !state;
    },
  },
});

const BalancegameSettingModalClickCheck = createSlice({
  name: "BalancegameSettingModalClickCheck",
  initialState: false,
  reducers: {
    showBalancegameeSettingModal(state) {
      return !state;
    },
  },
});

const LiargameSettingModalClickCheck = createSlice({
  name: "LiargameSettingModalClickCheck",
  initialState: false,
  reducers: {
    showLiargameSettingModal(state) {
      return !state;
    },
  },
});

//GameSetting Modal clickcheck

const SelectProfile = createSlice({
  name: "SelectProfile",
  initialState: "",
  reducers: {
    changeMyPageProfile(state, action) {
      return state = action.payload;
    },
  },
})

//유저이름
const userName = createSlice({
  name: "userName",
  initialState: "",
  reducers: {
    changeUserName(state, action) {
      return (state = action.payload);
    },
  },
});
//모든유저데이터
const UserList = createSlice({
  name: "userList",
  initialState: "",
  reducers: {
    changeUserList(state, action) {
      return (state = action.payload);
    },
  },
});
//선택한유저데이터
const DetailUser = createSlice({
  name: "detailUser",
  initialState: "",
  reducers: {
    changeDetailUser(state, action) {
      return (state = action.payload);
    },
  },
});
//선택한 방 데이터
const DetailRoom = createSlice({
  name: "detailRoom",
  initialState: "",
  reducers: {
    changeDetailRoom(state, action) {
      return (state = action.payload);
    },
  },
});

const SelectDetailUser = createSlice({
  name: "selectDetailUser",
  initialState: false,
  reducers: {
    changeSelectDetailUser(state, action) {
      return (state = action.payload);
    },
  },
});

//myPage 중복확인 삭제예정
const myPageCheck = createSlice({
  name: "myPageCheck",
  initialState: false,
  reducers: {
    changeMyPageCheck(state, action) {
      return (state = action.payload);
    },
  },
});

const alarmClickCheck = createSlice({
  name: "alarmClick",
  initialState: false,
  reducers: {
    changeAlarmState(state) {
      return !state;
    },
  },
});

// 메인에서 방생성 버튼 클릭시 보이는 테마선택 캐러셀
const mainCreateRoomCarouselCheck = createSlice({
  name: "mainCreateRoomCarousel",
  initialState: false,
  reducers: {
    changeCarouselState(state) {
      return !state;
    },
  },
});

// 테마 선택 캐러셀에서 클릭한 테마에 따른 state 변경
// 0: 안보이기, 1:소통, 2:게임, 3:헌팅
const createThemeRoomCheck = createSlice({
  name: "createRoom",
  initialState: 0,
  reducers: {
    changeThemeRoomState(state, action) {
      return (state = action.payload);
    },
  },
});

//admin페이지 Reprot 데이터
const adminreport = createSlice({
  name: "adminreport",
  initialState: "",
  reducers: {
    changeAdminReport(state, action) {
      return (state = action.payload);
    },
  },
});

//admin페이지 UserList 데이터

// Nav의 menu에 있는 friend 클릭 여부
const menuFriendClickCheck = createSlice({
  name: "menuFriendClick",
  initialState: false,
  reducers: {
    changeMenuFriendState(state) {
      return !state;
    },
  },
});

// Nav의 menu에 있는 friend의 친구 클릭 여부
const menuFriendChatClickCheck = createSlice({
  name: "menuFriendChatClick",
  initialState: false,
  reducers: {
    // 채팅 목록 열고 닫기 함수
    changeMenuFriendChatState(state, action) {
      return (state = action.payload);
    },
  },
});

const menuFriendClickUserData = createSlice({
  name: "menuFriendClickUserData",
  initialState: [],
  reducers: {
    // 클릭한 유저와의 데이터 변경 함수
    changemenuFriendClickUserData(state, action) {
      return (state = action.payload);
    },
  },
});

// 룸에있는 유저 프로필 클릭 여부
const RoomUserProfileClickCheck = createSlice({
  name: "RoomUserProfileCheck",
  initialState: false,
  reducers: {
    showRoomUserProfile(state) {
      return !state;
    },
  },
});

// Room에 있는 유저 친구 클릭 여부
const roomAddFriendModalCheck = createSlice({
  name: "roomAddFriendModalState",
  initialState: false,
  reducers: {
    roomAddFriendModalState(state) {
      return !state;
    },
  },
});

// 친구 삭제 클릭 여부
const roomDeleteFriendModalCheck = createSlice({
  name: "roomDeleteFriendModalCheck",
  initialState: false,
  reducers: {
    changeRoomDeleteFriendModalCheck(state) {
      return !state;
    },
  },
});

// Room에 있는 유저 강퇴 클릭 여부
const RoomUserBanClickCheck = createSlice({
  name: "RoomUserBanCheck",
  initialState: false,
  reducers: {
    showRoomUserBanModal(state) {
      return !state;
    },
  },
});

// 탈퇴하기 클릭 여부
const SecessionClickCheck = createSlice({
  name: "SecessionClickCheck",
  initialState: false,
  reducers: {
    showSecessionModal(state) {
      return !state;
    },
  },
});

// Room에 있는 유저 신고 클릭 여부
const RoomUserReportClickCheck = createSlice({
  name: "RoomUserReportCheck",
  initialState: false,
  reducers: {
    showRoomUserReportModal(state) {
      return !state;
    },
  },
});

// Nav의 alarm에 있는 요청, 초대, 리뷰 클릭 상태
// 요청:0(default), 초대:1, 리뷰:2
const alarmClickState = createSlice({
  name: "alarmClickState",
  initialState: 0,
  reducers: {
    changeAlarmClickState(state, action) {
      return (state = action.payload);
    },
  },
});

// Nav의 alarm을 클릭 후 요청, 초대, 리뷰에 따른 api 데이터 변경
const alarmApiData = createSlice({
  name: "alarmApiData",
  initialState: [],
  reducers: {
    changeAlarmApiDataState(state, action) {
      return (state = action.payload);
    },
  },
});

// Nav의 menu 클릭 후 friend list 요청 api 데이터
const menuFriendListApiData = createSlice({
  name: "enuFriendListApiData",
  initialState: [],
  reducers: {
    changeMenuFriendListApiDataState(state, action) {
      return (state = action.payload);
    },
  },
});

// 방 만들때 인원 체크
const createRoomChoicePeople = createSlice({
  name: "createRoomChoicePeople",
  initialState: 2,
  reducers: {
    changeCreateRoomChoicePeople(state, action) {
      return (state = action.payload);
    },
  },
});

// 방 만들때 나이 체크
const createRoomChoiceAge = createSlice({
  name: "createRoomChoiceAge",
  initialState: 0,
  reducers: {
    changeCreateRoomChoiceAge(state, action) {
      return (state = action.payload);
    },
  },
});

// 방 만들때 지역 체크
const createRoomChoiceRegion = createSlice({
  name: "createRoomChoiceAge",
  initialState: "전국",
  reducers: {
    changeCreateRoomChoiceRegion(state, action) {
      return (state = action.payload);
    },
  },
});

// 방 만들때 태그 체크
const createRoomChoiceTag = createSlice({
  name: "createRoomChoiceTag",
  initialState: [],
  reducers: {
    // 클릭 후 추가하는 함수
    changeCreateRoomChoiceAddTag(state: any, action: any): any {
      state.push(action.payload);
    },
    changeCreateRoomChoiceRemoveTag(state: any, action: any): any {
      const newState = state.filter((e: any) => {
        return e !== action.payload;
      });
      return (state = newState);
    },
    // 태그 초기화하는 함수
    changeCreateRoomChoiceTagReset(state: any): any {
      return (state = []);
    },
  },
});

// 방 만들때 테마Id 체크
const createRoomThemeCheck = createSlice({
  name: "createRoomThemeCheck",
  initialState: "T0B0",
  reducers: {
    changeCreateRoomThemeCheck(state, action) {
      return (state = action.payload);
    },
  },
});

// 만들어진 방 리스트 (관리자 controller Api)
const mainCreateRoomList = createSlice({
  name: "mainCreateRoomList",
  initialState: [],
  reducers: {
    changeMainCreateRoomList(state, action) {
      return (state = action.payload);
    },
  },
});

// PublicModal 끄고 켜는 함수
const PublicModal = createSlice({
  name: "PublicModal",
  initialState: false,
  reducers: {
    showPublicModal(state, action) {
      return (state = action.payload);
    },
  },
});

// nav -> alarm -> review에 있는 리뷰 목록에 있는 클릭한 유저 데이터
const navAlarmReviewEmojiUserData = createSlice({
  name: "navAlarmReviewEmojiUserData",
  initialState: 0,
  reducers: {
    changeNavAlarmReviewEmojiUserData(state, action) {
      return (state = action.payload);
    },
  },
});

// webRTC로딩 켜고 끄는 함수
const webRtcLoading = createSlice({
  name: "webRtcLoading",
  initialState: true,
  reducers: {
    isRtcLoading(state, action) {
      return (state = action.payload);
    },
  },
});

// UpdateRoomModal 켜고 끄는 함수
const updateRoomInfo = createSlice({
  name: "updateRoomInfo",
  initialState: false,
  reducers: {
    showUpdateRoom(state, action) {
      return (state = action.payload);
    },
  },
});

// 포차변경 켜고 끄는 함수
const changeUpdatePocha = createSlice({
  name: "changeUpdatePocha",
  initialState: false,
  reducers: {
    showUpdatePocha(state, action) {
      return (state = action.payload);
    },
  },
});

// 친구 초대창 켜고 끄는 함수
const inviteFriendModal = createSlice({
  name: "inviteFriendModal",
  initialState: false,
  reducers: {
    inviteMyFriend(state, action) {
      return (state = action.payload);
    },
  },
});

// 친구 요청 검색 모달 켜고 끄는 함수
const friendSearchState = createSlice({
  name: "friendSearchState",
  initialState: false,
  reducers: {
    changeFriendSearchState(state, action) {
      return state = action.payload
    },
  },
});

// Roulette 결과 모달 켜고 끄는 함수
const rouletteResultModal = createSlice({
  name: "rouletteResultModal",
  initialState: false,
  reducers: {
    showRouletteResultModal(state, action) {
      return (state = action.payload);
    },
  },
});

// 게임 선택창 켜고 끄는 함수
const gameSelectModal = createSlice({
  name: "gameSelectModal",
  initialState: true,
  reducers: {
    showGameSelectModal(state, action) {
      return (state = action.payload);
    },
  },
});

// 선택한 게임ID 구분
const selectGameId = createSlice({
  name: "selectGameId",
  initialState: "",
  reducers: {
    selectGame(state, action) {
      return (state = action.payload);
    },
  },
});

// const [isLadder, setIsLadder] = useState<boolean>(false);
const isLadder = createSlice({
  name: "isLadder",
  initialState: false,
  reducers: {
    LadderChange(state) {
      return !state;
    }
  }
})

//
export const store = configureStore({
  // store에서 만든 state를 전역에서 사용할 수 있도록 등록하기
  reducer: {
    menuClickCheck: menuClickCheck.reducer,
    SecessionClickCheck: SecessionClickCheck.reducer,
    alarmClickCheck: alarmClickCheck.reducer,
    mainCreateRoomCarouselCheck: mainCreateRoomCarouselCheck.reducer,
    createThemeRoomCheck: createThemeRoomCheck.reducer,
    adminreport: adminreport.reducer,
    menuFriendClickCheck: menuFriendClickCheck.reducer,
    menuFriendChatClickCheck: menuFriendChatClickCheck.reducer,
    alarmClickState: alarmClickState.reducer,
    alarmApiData: alarmApiData.reducer,
    menuFriendListApiData: menuFriendListApiData.reducer,
    RoomUserProfileClickCheck: RoomUserProfileClickCheck.reducer,
    createRoomChoicePeople: createRoomChoicePeople.reducer,
    createRoomChoiceAge: createRoomChoiceAge.reducer,
    createRoomChoiceRegion: createRoomChoiceRegion.reducer,
    createRoomChoiceTag: createRoomChoiceTag.reducer,
    createRoomThemeCheck: createRoomThemeCheck.reducer,
    roomAddFriendModalCheck: roomAddFriendModalCheck.reducer,
    RoomUserBanClickCheck: RoomUserBanClickCheck.reducer,
    RoomUserReportClickCheck: RoomUserReportClickCheck.reducer,
    menuFriendClickUserData: menuFriendClickUserData.reducer,
    PublicModal: PublicModal.reducer,
    // 관리자
    mainCreateRoomList: mainCreateRoomList.reducer,
    myInfo: myInfo.reducer,
    // username
    userName: userName.reducer,
    // userList
    UserList: UserList.reducer,
    // DetailUser
    DetailUser: DetailUser.reducer,
    SelectDetailUser: SelectDetailUser.reducer,
    DetailRoom: DetailRoom.reducer,
    MyPageProfileClickCheck: MyPageProfileClickCheck.reducer,
    SelectProfile: SelectProfile.reducer,

    //GameSettingModal
    YanggameSettingModalClickCheck: YanggameSettingModalClickCheck.reducer,
    BalancegameSettingModalClickCheck: BalancegameSettingModalClickCheck.reducer,
    LiargameSettingModalClickCheck: LiargameSettingModalClickCheck.reducer,


    // EmojiClickUserData
    navAlarmReviewEmojiUserData: navAlarmReviewEmojiUserData.reducer,

    myPageCheck: myPageCheck.reducer,
    // webRTC
    webRtcLoading: webRtcLoading.reducer,
    // room관련
    updateRoomInfo: updateRoomInfo.reducer,
    changeUpdatePocha: changeUpdatePocha.reducer,
    inviteFriendModal: inviteFriendModal.reducer,
    // 친구 요청 검색 모달
    friendSearchState: friendSearchState.reducer,
    // 친구 삭제 모달 클릭 여부
    roomDeleteFriendModalCheck: roomDeleteFriendModalCheck.reducer,
    // Game관련
    rouletteResultModal: rouletteResultModal.reducer,
    gameSelectModal: gameSelectModal.reducer,
    selectGameId: selectGameId.reducer,
    isLadder: isLadder.reducer,
  },
});
//주석추가

// createSlice의 reducers 에서 만든 state 변경 함수를 export 하기
export const { changeMenuState } = menuClickCheck.actions;
export const { changeAlarmState } = alarmClickCheck.actions;
export const { changeCarouselState } = mainCreateRoomCarouselCheck.actions;
export const { changeThemeRoomState } = createThemeRoomCheck.actions;
export const { changeMenuFriendState } = menuFriendClickCheck.actions;
export const { changeMenuFriendChatState } = menuFriendChatClickCheck.actions;
export const { changeAlarmApiDataState } = alarmApiData.actions;
export const { changeAlarmClickState } = alarmClickState.actions;
export const { changeMenuFriendListApiDataState } =
  menuFriendListApiData.actions;
export const { showRoomUserProfile } = RoomUserProfileClickCheck.actions;
export const { changeCreateRoomChoicePeople } = createRoomChoicePeople.actions;
export const { changeCreateRoomChoiceAge } = createRoomChoiceAge.actions;
export const { changeCreateRoomChoiceRegion } = createRoomChoiceRegion.actions;
export const {
  changeCreateRoomChoiceAddTag,
  changeCreateRoomChoiceRemoveTag,
  changeCreateRoomChoiceTagReset,
} = createRoomChoiceTag.actions;
export const { changeCreateRoomThemeCheck } = createRoomThemeCheck.actions;
export const { roomAddFriendModalState } = roomAddFriendModalCheck.actions;
export const { showRoomUserBanModal } = RoomUserBanClickCheck.actions;
export const { showSecessionModal } = SecessionClickCheck.actions;
export const { showRoomUserReportModal } = RoomUserReportClickCheck.actions;
export const { changemenuFriendClickUserData } =
  menuFriendClickUserData.actions;
export const { showPublicModal } = PublicModal.actions;
// 관리자
export const { changeMainCreateRoomList } = mainCreateRoomList.actions;
export const { changeMyInfo } = myInfo.actions;
export const { showMyPageProfileSelect } = MyPageProfileClickCheck.actions;
export const { changeMyPageProfile } = SelectProfile.actions

//adminGameSetting
export const { showBalancegameeSettingModal } = BalancegameSettingModalClickCheck.actions;
export const { showLiargameSettingModal } = LiargameSettingModalClickCheck.actions;
export const { showYanggameSettingModal } = YanggameSettingModalClickCheck.actions;


// username
export const { changeUserName } = userName.actions;
// userList
export const { changeUserList } = UserList.actions;
// DetailUser
export const { changeDetailUser } = DetailUser.actions;
export const { changeSelectDetailUser } = SelectDetailUser.actions;
export const { changeDetailRoom } = DetailRoom.actions;
export const { changeAdminReport } = adminreport.actions;
// EmojiClickUserData
export const { changeNavAlarmReviewEmojiUserData } =
  navAlarmReviewEmojiUserData.actions;
export const { changeMyPageCheck } = myPageCheck.actions;
// webRTC
export const { isRtcLoading } = webRtcLoading.actions;
// room
export const { showUpdateRoom } = updateRoomInfo.actions;
export const { showUpdatePocha } = changeUpdatePocha.actions;
export const { inviteMyFriend } = inviteFriendModal.actions;
// 친구 요청 검색 모달
export const { changeFriendSearchState } = friendSearchState.actions;
// 친구 삭제 모달 클릭 여부
export const { changeRoomDeleteFriendModalCheck } = roomDeleteFriendModalCheck.actions;
// Game관련
export const { showRouletteResultModal } = rouletteResultModal.actions;
export const { showGameSelectModal } = gameSelectModal.actions;
export const { selectGame } = selectGameId.actions;
export const { LadderChange } = isLadder.actions;

// store의 타입 미리 export 해둔 것.
export type RootState = ReturnType<typeof store.getState>;
// dispatch 타입을 store에서 가져와서 export해주기
export type AppDispatch = typeof store.dispatch;
