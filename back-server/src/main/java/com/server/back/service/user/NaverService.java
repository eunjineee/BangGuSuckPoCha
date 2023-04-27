package com.server.back.service.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.back.config.oauth.Provider.NaverProfile;
import com.server.back.config.oauth.Provider.TokenDto;
import com.server.back.domain.user.Region;
import com.server.back.domain.user.RegionRepository;
import com.server.back.domain.user.User;
import com.server.back.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NaverService {

    private final UserRepository userRepository;
    private final RegionRepository regionRepository;

    private final String client_id = "";
    private final String client_secret = "";
    private final String redirect_uri = "https://i8e201.p.ssafy.io/api/login/oauth2/code/naver";
    private final String accessTokenUri = "https://nid.naver.com/oauth2.0/token";
    private final String UserInfoUri = "https://openapi.naver.com/v1/nid/me";
    /**
     * 네이버로 부터 엑세스 토큰을 받는 함수
     */
    public TokenDto getAccessToken(String code) {

        //요청 param (body)
        MultiValueMap<String , String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id",client_id );
        params.add("redirect_uri",redirect_uri);
        params.add("code", code);
        params.add("client_secret", client_secret);
        params.add("state", "test");


        //request
        WebClient wc = WebClient.create(accessTokenUri);
        String response = wc.post()
                .uri(accessTokenUri)
                .body(BodyInserters.fromFormData(params))
                .header("Content-type","application/x-www-form-urlencoded;charset=utf-8" ) //요청 헤더
                .retrieve()
                .bodyToMono(String.class)
                .block();
//        System.out.println("-----------------네이버서비스다------------"+response);
        //json형태로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        TokenDto tokenDto =null;

        try {
            tokenDto = objectMapper.readValue(response, TokenDto.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return tokenDto;
    }

    /**
     * 사용자 정보 가져오기
     */
    public NaverProfile findProfile(String token) {

        //Http 요청
        WebClient wc = WebClient.create(UserInfoUri);
        String response = wc.get()
                .uri(UserInfoUri)
                .header("Authorization", "Bearer " + token)
                .header("Content-type", "application/xml;charset=utf-8")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        ObjectMapper objectMapper = new ObjectMapper();
        NaverProfile naverProfile = null;

        try {
            naverProfile = objectMapper.readValue(response, NaverProfile.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        System.out.println("===========NaverProfile=================");
        System.out.println(naverProfile);
        return naverProfile;
    }

    /**
     * 네이버 로그인 사용자 강제 회원가입
     */
    @Transactional
    public User saveUser(String access_token) {
        NaverProfile profile = findProfile(access_token); //사용자 정보 받아오기
        User user = userRepository.findByUsername(profile.response.getId());

        //처음이용자 강제 회원가입
        if(user == null) {
            Region region = regionRepository.findAll().get(0);
            user = User.builder()
                    .username(profile.response.id)
                    .password("0")
                    .nickname(profile.response.id)
                    .profile("/profile/icon_0002.png")
                    .comment(null)
                    .gender(profile.response.gender)
                    .birth(profile.response.birthyear+"."+profile.response.birthday.replace("-","."))
                    .manner(36.5)
                    .point(1000)
                    .is_ban(false)
                    .report_point(0)
                    .role("NEWBIE")
                    .time(LocalDateTime.now())
                    .region(region)
                    .build();

            userRepository.save(user);
        }else {
            if (user.getTime().toLocalDate().isBefore(LocalDate.now())){
                user.setRole("TODAY");
            }
            user.setTime(LocalDateTime.now());
        }
        // 문자열
        String dateStr = Integer.toString(Integer.parseInt(profile.response.birthyear)+19)+"-"+profile.response.birthday;
        // 포맷터
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        // 문자열 -> Date
        LocalDate date = LocalDate.parse(dateStr, formatter);
        // 오늘 날짜
        LocalDate today = LocalDate.now();
        if (date.isAfter(today)){
            user.setRole("TEENAGER");
        }
        return user;
    }
}

