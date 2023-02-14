package com.server.back.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.server.back.config.oauth.Provider.TokenDto;
import com.server.back.domain.user.User;
import com.server.back.dto.admin.RegionResponseDto;
import com.server.back.dto.game.YscResponseDto;
import com.server.back.dto.report.ReportRequestDto;
import com.server.back.dto.review.ReviewRequestDto;
import com.server.back.dto.review.ReviewResponseDto;
import com.server.back.jwt.refreshToken.RefreshTokenRepository;
import com.server.back.jwt.service.JwtService;
import com.server.back.service.report.ReportService;
import com.server.back.service.review.ReviewService;
import com.server.back.service.user.NaverService;
import com.server.back.service.user.UserService;
import com.server.back.jwt.TokenRequestDto;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.web.bind.annotation.*;
import com.server.back.dto.user.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;
import java.util.*;

@RequiredArgsConstructor
@RequestMapping("/user")
@RestController
public class UserController {
    private final UserService userService;
    private final NaverService naverService;
    private final ReviewService reviewService;
    private final ReportService reportService;
    private final JwtService jwtService;

    @ApiOperation(value = "로그인", notes = "client_id, redirect_uri, response_type 전달.")
    @GetMapping("/oauth2/token/naver")
    public void NaverLogin(@RequestParam("code") String code,
            HttpServletRequest request
            , HttpServletResponse response) throws IOException {
        TokenDto oauthToken = naverService.getAccessToken(code);
        User saveUser = naverService.saveUser(oauthToken.getAccess_token());
        if (saveUser.getRole().equals("SECESSION") || saveUser.getRole().equals("BAN")){
            String target = "https://i8e201.p.ssafy.io/loginloading?Role="+ saveUser.getRole() + "&Username=" + saveUser.getUsername();
            RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
            redirectStrategy.sendRedirect(request, response, target);
        } else if (saveUser.getRole().equals("TEENAGER")){
            String target = "https://i8e201.p.ssafy.io/loginloading?Role="+ saveUser.getRole() + "&Username=" + saveUser.getUsername();
            RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
            redirectStrategy.sendRedirect(request, response, target);
        } else if (saveUser.getRole().equals("NEWBIE")){
            TokenRequestDto tokenRequestDto = jwtService.joinJwtToken(saveUser.getUsername());
            String target = "https://i8e201.p.ssafy.io/loginloading?Auth=" + tokenRequestDto.getAccessToken() + "&Refresh=" + tokenRequestDto.getRefreshToken() + "&Role=" + saveUser.getRole()+"&Username=" + saveUser.getUsername();
            userService.roleChange(saveUser.getUsername());
            RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
            redirectStrategy.sendRedirect(request, response, target);
        } else if (saveUser.getRole().equals("TODAY")){
            TokenRequestDto tokenRequestDto = jwtService.joinJwtToken(saveUser.getUsername());
            userService.roleChange(saveUser.getUsername());
            String target = "https://i8e201.p.ssafy.io/loginloading?Auth=" + tokenRequestDto.getAccessToken() + "&Refresh=" + tokenRequestDto.getRefreshToken() + "&Role=" + saveUser.getRole()+"&Username=" + saveUser.getUsername();
            PointRequestDto requestDto = new PointRequestDto(500, "출석체크");
            userService.usePoint(saveUser.getUsername(), requestDto);
            RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
            redirectStrategy.sendRedirect(request, response, target);
        } else{
            TokenRequestDto tokenRequestDto = jwtService.joinJwtToken(saveUser.getUsername());
            String target = "https://i8e201.p.ssafy.io/loginloading?Auth=" + tokenRequestDto.getAccessToken() + "&Refresh=" + tokenRequestDto.getRefreshToken() + "&Role=" + saveUser.getRole()+"&Username=" + saveUser.getUsername();
            RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
            redirectStrategy.sendRedirect(request, response, target);
        }
    }

    @GetMapping("/check")
    public Map<String, String> checkcheck(){
        Map<String, String> map = new LinkedHashMap<>();
        map.put("status", "200");
        map.put("message", "accessToken, refreshToken이 생성되었습니다.");
        return map;
    }
    @ApiOperation(value = "토큰 갱신", notes = "accessToken, refreshToken을 갱신하여 전달.")
    @GetMapping("/auth/refresh/{username}")
    public Map<String,String> refreshToken(@PathVariable("username") String username, @RequestHeader("refreshToken") String refreshToken,
                                           HttpServletResponse response) throws JsonProcessingException {
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        TokenRequestDto tokenRequestDto = jwtService.validRefreshToken(username, refreshToken);
        Map<String, String> jsonResponse = jwtService.recreateTokenResponse(tokenRequestDto);
        return jsonResponse;
    }
    @ApiOperation(value = "닉네임 중복 체크", notes="닉네임 사용 가능하면 true")
    @PostMapping ("/auth/check/nickname")
    public ResponseEntity<Map<String, Object>> userNicknameCheck(@RequestBody NicknameRequestDto requestDto){
        Map<String, Object> response = new HashMap<>();
        Boolean nicknamecheck = userService.userNicknameCheck(requestDto);
        response.put("data", nicknamecheck);
        response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @ApiOperation(value = "로그아웃")
    @PutMapping("/logout/{username}")
    public ResponseEntity<Map<String, Object>> uesrLogout(@PathVariable(value = "username") String username) {
        Map<String, Object> response = new HashMap<>();
        userService.uesrLogout(username);
        response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @ApiOperation(value = "정보 수정")
    @PutMapping("/{username}")
    public ResponseEntity<Map<String, Object>> userUpdate(@PathVariable(value = "username") String username , @RequestBody UserRequestDto requestDto){
        Map<String, Object> response = new HashMap<>();
        userService.userUpdate(username, requestDto);
        response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @ApiOperation(value = "회원 탈퇴")
    @DeleteMapping("/{username}")
    public ResponseEntity<Map<String, Object>> userDelete(@PathVariable(value = "username") String username){
        Map<String, Object> response = new HashMap<>();
        userService.userDelete(username);
        response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @ApiOperation(value = "내 정보 조회.")
    @GetMapping("/myinfo/{username}")
    public ResponseEntity<Map<String, Object>> userMyInfo(@PathVariable(value = "username") String username){
        Map<String, Object> response = new HashMap<>();
        UserResponseDto responseDto = userService.userInfo(username);
        response.put("data", responseDto);
        response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @ApiOperation(value = "회원 정보 조회.")
    @GetMapping("/info/{username}")
    public ResponseEntity<Map<String, Object>> userInfo(@PathVariable(value = "username") String username){
        Map<String, Object> response = new HashMap<>();
        UserResponseDto responseDto = userService.userInfo(username);
        response.put("data", responseDto);
        response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @ApiOperation(value = "포인트 사용 목록")
    @GetMapping("/point/{username}")
    public ResponseEntity<Map<String, Object>> userPointList(@PathVariable(value = "username") String username){
        Map<String, Object> response = new HashMap<>();
        List<PointResponseDto> responseDtoList = userService.userPointList(username);
        response.put("data", responseDtoList);
        response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @ApiOperation(value = "포인트 획득, 사용")
    @PutMapping("/point/{username}")
    public ResponseEntity<Map<String,Object>> userUsePoint(@PathVariable(value = "username") String username, @RequestBody PointRequestDto requestDto){
        Map<String, Object> response = new HashMap<>();
        userService.usePoint(username, requestDto);
        response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @ApiOperation(value = "평가 목록 요청")
    @GetMapping("/review/{username}")
    public ResponseEntity<Map<String, Object>> userReviewList(@PathVariable(value = "username") String username){
        Map<String, Object> response = new HashMap<>();
        List<ReviewResponseDto> responseDtoList = reviewService.userReviewList(username);
        response.put("data", responseDtoList);
        response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @ApiOperation(value = "유저 평가")
    @PutMapping("/review")
    public ResponseEntity<Map<String, Object>> userReview(@RequestBody ReviewRequestDto requestDto){
        Map<String, Object> response = new HashMap<>();
        reviewService.userReview(requestDto);
        response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @ApiOperation(value = "보유 아이템 목록")
    @GetMapping("/item/{username}")
    // ItemResponseDto 추가 후 [Map -> ReviewResponseDto]로 변경
    public ResponseEntity<List<Map<String, Object>>> userItemList(@PathVariable(value = "username") String username){
        List<Map<String, Object>> itemResponseDto = new ArrayList<>();
        itemResponseDto.add(new HashMap<>());
        itemResponseDto.get(0).put("user_id", 700);
        itemResponseDto.get(0).put("item_id", 700);
        itemResponseDto.get(0).put("item_name", "아이템명");
        itemResponseDto.get(0).put("item_detail", "아이템 설명");
        itemResponseDto.get(0).put("item_type", 4);

        return new ResponseEntity<>(itemResponseDto, HttpStatus.OK);
    }
    @ApiOperation(value = "유저 신고")
    @PostMapping("/report")
    public ResponseEntity<Map<String, Object>> userReport(@RequestBody ReportRequestDto requestDto){
        Map<String, Object> response = new HashMap<>();
        reportService.userReport(requestDto);
        response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

