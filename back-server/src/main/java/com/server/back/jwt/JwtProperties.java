package com.server.back.jwt;

public interface JwtProperties {

    String SECRET = "방구석 어쩌구"; //우리 서버만 알고 있는 비밀값
    int AccessToken_TIME =  1000*60*2; // (1/1000초)
    int RefreshToken_TIME = 1000 * 60 * 60 * 24 * 7 ;// 1 week
    String HEADER_STRING = "accessToken";
}
