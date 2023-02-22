# <img src = "./README.assets/pocha.gif" width = "3%"/>방구석 포차
## 목차

- [기획배경](#기획배경)
- [설계](#설계)
  - [디자인 컨셉](#디자인-컨셉)
  - [와이어프레임](#와이어프레임)
  - [UI 디자인](#ui-디자인)
  - [ERD](#erd)
- [주요기능](#주요기능)
- [기술스택, 개발환경, 서비스구조](#기술스택-개발환경-서비스구조)
- [팀 소개](#팀-소개)

---

## 🍺기획배경

프로젝트명

- **방구석 포차**

주제

- **MZ세대를 겨냥한 온라인 화상 술자리 서비스**

서비스 특징

- **태그정보를 이용한 간편하고 빠른 맞춤형 술자리 제공**
- 멀리 떨어져 있는 지인, 동료와 재미있는 술자리
- 매칭 서비스를 통해 새로운 인연과의 만남
- 지나친 음주와 귀가에 대한 걱정 방지

###### 문제 정의

💬 코로나 19로 인해 달라진 음주 문화(홈술)에 맞춰 MZ세대가 선호하지 않는 술자리 문화와 거리의 제약을 해결하기 위함

![image-20230221140908757](./README.assets/image-20230221140908757.png)

`한국농수산식품유통공사 : 식품산업통계보고서 - 2021년`

- 음주 문화, 주류소비 트랜드(홈술)의 변화
- 선호하지 않는 술자리 문화 해결
  - 신경쓰이는 귀가 시간과 거리
  - 입맛에 맞지 않거나 비싼 외식 비용
  - 분위기에 따른 조절 하기 힘든 주량
- 거리에 대한 제약 없이 지인 및 새로운 사람들과 만남 가능

## 🍺설계

### 디자인 컨셉

---

`Logo`

![logo](./README.assets/logo.gif)

### 와이어프레임

---

<img src="./README.assets/7a5ebfb0-0508-48ab-be9a-31b36ba53f97-cover.png" alt="7a5ebfb0-0508-48ab-be9a-31b36ba53f97-cover" width="5%" />[Figma](https://www.figma.com/file/j4Ip9hMmVco26mJ67COuSK/%EB%94%94%EC%9E%90%EC%9D%B8-%EB%AA%A9%EC%97%85?node-id=313%3A6109&t=D4PNG15Al40oJ0Uu-0)

<img src="./README.assets/image-20230221093759632.png" alt="image-20230221093759632" style="zoom:80%;" />

### UI 디자인

---

[🍻방구석포차](https://i8e201.p.ssafy.io/)

`Login Page`<img src="./README.assets/image-20230221120144320.png" alt="image-20230221120144320"  />

`Main Page`

![image-20230221094618492](./README.assets/image-20230221094618492-1676956383679-10.png)

`My Page`

![image-20230221094928719](./README.assets/image-20230221094928719-1676956443379-12.png)

`Choice Pocha Theme Modal`

![image-20230221095154869](./README.assets/image-20230221095154869.png)

`Create Pocha Modal`

![image-20230221095117175](./README.assets/image-20230221095117175.png)

`Story Pocha`

![image-20230221095351806](./README.assets/image-20230221095351806.png)

`Game Pocha`

![image-20230221095635434](./README.assets/image-20230221095635434.png)

`Meeting Pocha Loding Page`

![image-20230221095813813](./README.assets/image-20230221095813813.png)

`Meeting Pocha`

![image-20230221095946515](./README.assets/image-20230221095946515.png)

`Review Page`

![image-20230221100115602](./README.assets/image-20230221100115602.png)

`Chat`

![image-20230221100144833](./README.assets/image-20230221100144833.png)

### ERD

---

<img src="./README.assets/erd-2684250-2227990.webp" alt="erd-2684250-2227990" width="5%" />[ERD](https://www.erdcloud.com/d/C25xaNwzPPz9vNbGZ)

![image-20230221100512582](./README.assets/image-20230221100512582.png)

## 🍺주요기능

##### ✔ WebRTC기능을 활용한 비대면 화상 포차
##### ✔ 태그를 이용한 맞춤형 술자리 빠른 랜덤 매칭
##### ✔ 컨셉( 소통, 게임, 헌팅 )에 따른 술자리 분류
- 소통포차 : 이야기를 즐길 수 있는 포차
- 게임포차 : 다양한 게임을 즐길 수 있는 포차
- 헌팅포차 : 새로운 사람을 소개받을 수 있는 포차
##### ✔ 각 술자리 컨셉에 따른 다양한 술 게임 제공
- 소켓 통신을 활용한 실시간 게임 가능
##### ✔ 친구와의 1:1 채팅 기능 제공
- 소켓 통신을 활용한 실시간 채팅 가능
##### ✔ 매너 온도를 통해 악성 사용자 판별

## 🍺기술스택, 개발환경, 서비스구조

<img src="./README.assets/notion_logo.png" alt="다운로드" width="3%" /> [노션으로 이동](https://www.notion.so/3b33e8ea242d475199a0533fac9d8aa9)

## 🍺팀 소개

#### SSAFY 8기 부울경 1반 E201팀

#### 팀명

말랑말랑1조

##### 팀원

- <a href="https://www.notion.so/fbfe6b2ff9f54b3f9dbf7f8d3a00f6e3?v=c2e98f5d57aa41758b19f97ba4fca850">회고록</a>

<table >
  <thead>
    <th>FE</th>
    <th>BE</th>
  </thead>
  <tbody>
  <tr>
    <td style="display: flex; justify-content: center; align-items:center;">
      <div>
          <img src="https://avatars.githubusercontent.com/u/109326297?v=4" width="15%"/>
          <div style="display: flex; justify-content: center; align-items:center;"><b>김홍민(Front-end & 팀장)</b></div>
          <div style="display: flex; justify-content: center; align-items:center;"><a href="https://github.com/KHminor">https://github.com/KHminor</a></div>
      </div>
    </td>
    <td style="display: flex; justify-content: center; align-items:center;">
        <div>
          <img src="https://avatars.githubusercontent.com/u/90487843?v=4" width="15%"/>
          <div style="display: flex; justify-content: center; align-items:center;"><b>김남규(Back-end)</b></div>
          <div style="display: flex; justify-content: center; align-items:center;"><a href="https://github.com/isanghada">https://github.com/isanghada</a></div>
      </div>
    </td>
  </tr>
  <tr>
    <td style="display: flex; justify-content: center; align-items:center;">
      <div>
        <img src="https://avatars.githubusercontent.com/u/73467750?v=4" width="15%"/>
        <div style="display: flex; justify-content: center; align-items:center;"><b>김찬희(Front-end)</b></div>
        <div style="display: flex; justify-content: center; align-items:center;"><a href="https://github.com/wndjf11">https://github.com/wndjf11</a></div>
      </div>
    </td>
    <td style="display: flex; justify-content: center; align-items:center;">
      <div>
          <img src="https://avatars.githubusercontent.com/u/55730504?v=4" width="15%"/>
          <div style="display: flex; justify-content: center; align-items:center;"><b>김애림(Back-end)></b></div>
          <div style="display: flex; justify-content: center; align-items:center;"><a href="https://github.com/aemong22">https://github.com/aemong22</a></div>      
      </div>
    </td>
  </tr>
  <tr>
    <td style="display: flex; justify-content: center; align-items:center;">
      <div>
        <img src="https://avatars.githubusercontent.com/u/109326433?v=4" width="15%"/>
        <div style="display: flex; justify-content: center; align-items:center;"><b>한상현(Front-end)</b></div>
        <div style="display: flex; justify-content: center; align-items:center;"><a href="https://github.com/mintcoo">https://github.com/mintcoo</a></div>
      </div>
    </td>
    <td style="display: flex; justify-content: center; align-items:center;">
      <div>
        <img src="https://avatars.githubusercontent.com/u/108562895?v=4" width="15%"/>
        <div style="display: flex; justify-content: center; align-items:center;"><b>양은진(Back-end)</b></div>
        <div style="display: flex; justify-content: center; align-items:center;"><a href="https://github.com/eunjineee">https://github.com/eunjineee</a></div>
      </div>
    </td>
  </tr>
  </tbody>
</table>
