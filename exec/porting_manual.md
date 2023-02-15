# 📚포팅 메뉴얼

## 📑목차

### - [기술 스택 & 버전 정보](#🛠기술-스택--버전-정보)

### - [빌드 방법](#⚙빌드-방법)

### - [Docker & Jenkins](#docker--jenkins-1)

---

## 🛠기술 스택 & 버전 정보

### 1. 이슈관리

<img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=Jira&logoColor=white">

</br>

### 2. 형상관리

<img src="https://img.shields.io/badge/Gitlab-FC6D26?style=for-the-badge&logo=Gitlab&logoColor=white">

</br>

### 3. 커뮤니케이션

<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white"> <img src="https://img.shields.io/badge/Mattermost-0058CC?style=for-the-badge&logo=Mattermost&logoColor=white">

</br>

### 4. 개발 환경

#### **IDE**

<img src="https://img.shields.io/badge/Intellij 2022.3.1-000000?style=for-the-badge&logo=IntelliJ IDEA&logoColor=white">
<img src="https://img.shields.io/badge/Visual Studio Code 1.74-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white">

#### **DB**

<img src="https://img.shields.io/badge/MySQL 8.0.31-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">

#### **UI/UX**

<img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=Figma&logoColor=white">

#### **Server**

<img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=Amazon AWS&logoColor=white">
<img src="https://img.shields.io/badge/NGINX_stable_alpine-009639?style=for-the-badge&logo=NGINX&logoColor=white">

</br>

### 5. 상세

#### **Backend**

<img src="https://img.shields.io/badge/Java_1.8-FF0000?style=for-the-badge&logo=&logoColor=white">
<img src="https://img.shields.io/badge/Spring_Boot_2.7.8-6DB33F?style=for-the-badge&logo=Spring Boot&logoColor=white">
<img src="https://img.shields.io/badge/Spring Security_5.7.6-6DB33F?style=for-the-badge&logo=Spring Security&logoColor=white">
<img src="https://img.shields.io/badge/Gradle 7.6-02303A?style=for-the-badge&logo=Gradle&logoColor=white">
<img src="https://img.shields.io/badge/JPA-009639?style=for-the-badge&logo=&logoColor=white">
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON Web Tokens&logoColor=white">

#### **Frontend**

<img src="https://img.shields.io/badge/React_18.2.0-61DAFB?style=for-the-badge&logo=React&logoColor=white">
<img src="https://img.shields.io/badge/Node.js_18.12.1-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
<img src="https://img.shields.io/badge/JavaScript_Es2022-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white">
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white">
<img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=Tailwind CSS&logoColor=white">
<img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=white">
<img src="https://img.shields.io/badge/React Router
-CA4245?style=for-the-badge&logo=React Router
&logoColor=white">
<img src="https://img.shields.io/badge/React_Query_3.39.2-FF4154?style=for-the-badge&logo=React Query&logoColor=white">

#### **WebRTC**

<img src="https://img.shields.io/badge/Socket.io_4.5.4-010101?style=for-the-badge&logo=Socket.io&logoColor=white">
<img src="https://img.shields.io/badge/express_4.18.20-000000?style=for-the-badge&logo=Express&logoColor=white">

#### **CI/CD**

<img src="https://img.shields.io/badge/Docker_20.10.23-2496ED?style=for-the-badge&logo=Docker&logoColor=white">
<img src="https://img.shields.io/badge/Jenkins_lts-D24939?style=for-the-badge&logo=Jenkins&logoColor=white">

---
## ⚙빌드 방법

### ◼BE

1. **`back-server`** 프로젝트 열기
2. JDK 1.8 버전 확인
3. src/main/PochaApplication class 실행

### ◻FE

1. **`front-client`** 로 이동
2. npm install
3. npm start

### ◼RTC(Socket)

1. **`rtc-server`** 로 이동
2. npm install
3. npm run dev

---

## 🌞Docker & Jenkins

<img src = "./img/server.png" />

### 1. 서버 접속
```bash
# Window Terminal 사용
## - ssafy 제공 서버 : Frontend, Backend 서버
## - 개인 프리티어 서버 : WebRTC용 socekt 서버
ssh -i [키명.pem] ubuntu@[탄련적IP/도메인 주소]
```

### 2. 기본 설정
```bash
$ sudo apt install upgrade
$ sudo apt install update

# 방화벽 설정
$ sudo ufw allow 22 # ssh
$ sudo ufw allow 80 # http 
$ sudo ufw allow 443 # ssl
$ sudo ufw enable
# 상태 확인
$ sudo ufw status
```
### 3. Docker 설치
```bash
# 사전 패키지 설치
sudo apt update
sudo apt-get install -y ca-certificates \
    curl \
    software-properties-common \
    apt-transport-https \
    gnupg \
    lsb-release

# gpg 키 다운로드 : 프로그램 패키지가 유효한지 확인하기 위해 gpg키를 통해 검증
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 설치
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose
```

### 4. 젠킨스 설치
#### 젠킨스 설치
- docker-copmpose.yml 생성 : vim 이용
```
version: '3'

services:
    jenkins:
        image: jenkins/jenkins:lts
        container_name: jenkins
        volumes:
            - /usr/bin/docker:/usr/bin/docker
            - /var/run/docker.sock:/var/run/docker.sock
            - /jenkins:/var/jenkins_home
            - /home/ubuntu/certbot:/var/certbot
        ports:
                - "9090:8080"
        privileged: true
        user: root
```
```bash
# 컨테이너 생성
$ sudo docker-compose up -d

# 컨테이너 확인
$ sudo docker ps
```
#### 젠킨스 설정
```bash
# 젠킨스 Administrator password 확인
$ sudo docker logs jenkins
```
1. 서버 공인 IP:9090 => 젠킨스 접속
2. 관리자 접속(위의 패스워드 사용)
3. 기본 플러그인 자동 설치
4. 젠킨스 계정 생성
5. Jenkins 관리 -> 플러그인 관리 -> 설치 가능
6. `gitlab 플러그인 설치` : GitLab, Generic Webhook Trigger, Gitlab API, GitLab Authentication
7. `docker 플러그인 설치` : Docker, Docker Commons, Docker Pipeline, Docker API
8. `SSH 플러그인 설치` : Publish OPver SSH