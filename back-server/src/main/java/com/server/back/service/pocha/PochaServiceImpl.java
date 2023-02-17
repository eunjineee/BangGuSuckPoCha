package com.server.back.service.pocha;

import com.server.back.domain.pocha.*;
import com.server.back.domain.review.Review;
import com.server.back.domain.review.ReviewRepository;
import com.server.back.domain.user.User;
import com.server.back.domain.user.UserRepository;
import com.server.back.dto.pocha.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Transactional
@Service
public class PochaServiceImpl implements PochaService{
    private final InviteRepository inviteRepository;
    private final ParticipantRepository participantRepository;
    private final PochaRepository pochaRepository;
    private final TagRepository tagRepository;
    private final ThemeRepository themeRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public List<PochaResponseDto> allPochaList() {
        return pochaRepository.findByIsEnd(false)
                .stream()
                .map(e -> new PochaResponseDto(e))
                .collect(Collectors.toList());
    }

    @Override
    public List<PochaResponseDto> pochaList(PochaRequestDto requestDto) {
        List<PochaResponseDto> responseDtoList = new ArrayList<>();

        Integer age = requestDto.getAge();
        String region = requestDto.getRegion();
        String theme = null;
        if(requestDto.getThemeId() != null) {
            theme = requestDto.getThemeId().substring(0, 2);
        }
        Set<String> tagSet = new HashSet<>();
        if(requestDto.getTagList() != null){
            tagSet.addAll(requestDto.getTagList());
        }

        int tagSize = tagSet.size();
        // 모든 포차 확인.
        for(Pocha p : pochaRepository.findByAgeAndRegion(age, region)){
            if(p.getIsEnd() || (theme != null && !p.getTheme().getThemeId().startsWith(theme))) continue;

            // 지정한 태그가 모두 포함된 경우만 반환.
            int validTag = 0;
            for(Tag tag : p.getTag()){
                if(tagSet.contains(tag.getTag())) validTag++;
            }
            if(validTag == tagSize) responseDtoList.add(new PochaResponseDto(p));
        }

        return responseDtoList;
    }

    @Override
    public void pochaUpdate(Long pochaId, PochaRequestDto requestDto) {
        Pocha entity = pochaRepository.findByPochaId(pochaId);
        System.out.println(">>>>>>>>>" + requestDto.getThemeId());
        Theme theme = themeRepository.findByThemeId(requestDto.getThemeId());
        System.out.println(theme.getThemeId());

        System.out.println(entity.getPochaId()+"<<<<<<<<<<<<<<");
        // 포차 업데이트.
        entity.update(requestDto, theme);

        // 태그 업데이트.
        tagRepository.deleteByPocha(entity);
        for(String tag : requestDto.getTagList()){
            Tag tEntity = Tag.builder().pocha(entity).tag(tag).build();
            tagRepository.save(tEntity);
        }
    }

    @Override
    public Long pochaInsert(PochaRequestDto requestDto) {
        // 테마 확인
        Theme theme = themeRepository.findByThemeId(requestDto.getThemeId());

        // 새로운 포차 생성
        Pocha pocha = Pocha.builder()
                .theme(theme)
                .age(requestDto.getAge())
                .region(requestDto.getRegion())
                .isPrivate(requestDto.getIsPrivate())
                .limitUser(requestDto.getLimitUser())
                .createAt(LocalDateTime.now())
                .endAt(LocalDateTime.now().plusHours(2))
                .isWaiting(theme.getThemeId().contains("T2") ? true : false)
                .isSsul(false)
                .alcohol(0)
                .isEnd(false)
                .build();

        // 포차 추가.
        Pocha entity = pochaRepository.save(pocha);

        // 태그 추가.
        for(String tag : requestDto.getTagList()){
            tagRepository.save(Tag.builder()
                    .pocha(entity)
                    .tag(tag)
                    .build());
        }
        return entity.getPochaId();
    }

    @Override
    public PochaResponseDto pochaInfo(Long pochaId) {
        Pocha entity = pochaRepository.findByPochaId(pochaId);

        PochaResponseDto  responseDto = new PochaResponseDto(entity);

        return responseDto;
    }

    @Override
    public void pochaEnd(Long pochaId) {
        Pocha entity = pochaRepository.findByPochaId(pochaId);
        entity.updateEnd();
    }

    @Override
    public List<PochaParticipantResponseDto> pochaParticipantList(Long pochaId) {
        Pocha pocha = pochaRepository.findByPochaId(pochaId);

        List<PochaParticipantResponseDto> responseDtoList = pocha.getParticipant().stream()
                        .map(e -> new PochaParticipantResponseDto(e))
                        .collect(Collectors.toList());

        return responseDtoList;
    }

    @Override
    public void pochaExtension(Long pochaId) {
        Pocha entity = pochaRepository.findByPochaId(pochaId);
        entity.updateExtension();
    }

    @Override
    public void pochaEnter(PochaParticipantRequestDto requestDto) {
        Pocha pocha = pochaRepository.findByPochaId(requestDto.getPochaId());

        // 만약, 나가지 않았다면 추가하지 않음.
        User user = userRepository.findByUsername(requestDto.getUsername());
        for(Participant p : pocha.getParticipant()){
            if(p.getUser().getUserId() == user.getUserId() && p.getExitAt() == null){
                return;
            }
        }

        Participant participant = Participant.builder()
                .pocha(pocha)
                .user(user)
                .isHost(requestDto.getIsHost())
                .createAt(LocalDateTime.now())
                .build();
        participantRepository.save(participant);
    }

    @Override
    public void pochaExit(PochaParticipantRequestDto requestDto) {
        Pocha pocha = pochaRepository.findByPochaId(requestDto.getPochaId());
        User user = userRepository.findByUsername(requestDto.getUsername());

        List<Participant> entityList = participantRepository.findByPochaAndUser(pocha, user);
        Participant entity = entityList.get(entityList.size() - 1);
        entity.updateExit();

        // 유저 평가 추가!!!
        if(!pocha.getIsWaiting()) {
            LocalDateTime start = entity.getCreateAt();
            LocalDateTime exit = LocalDateTime.now();
            for (Participant participant : pocha.getParticipant()) {
                if (participant.getExitAt() == null && participant.getUser().getUserId() != entity.getUser().getUserId()) {
                    LocalDateTime dt = null;
                    if (start.isAfter(participant.getCreateAt())) dt = start;
                    else dt = participant.getCreateAt();

                    Duration diff = Duration.between(dt, exit);
                    if (diff.getSeconds() > 30) {
                        reviewRepository.save(Review.builder()
                                .pocha(pocha)
                                .fromId(participant.getUser())
                                .toId(entity.getUser())
                                .reviewScore(3)
                                .create_at(LocalDateTime.now())
                                .build());
                        reviewRepository.save(Review.builder()
                                .pocha(pocha)
                                .fromId(entity.getUser())
                                .toId(participant.getUser())
                                .reviewScore(3)
                                .create_at(LocalDateTime.now())
                                .build());
                    }
                }
            }
        }

        // 호스트 변경.
        if(entity.getIsHost()){
            System.out.println("============> 호스트 변경!");
            boolean isPochaEnd = true;
            for(int idx = pocha.getParticipant().size() - 1; idx >= 0; idx--){
                Participant participant = pocha.getParticipant().get(idx);
                if(participant.getExitAt() == null && participant.getUser().getUserId() != entity.getUser().getUserId()){
                    System.out.println("============> 호스트 변경!");
                    isPochaEnd = false;
                    participant.updateHost();
                    break;
                }
            }

            // 모든 인원이 나갔다면 포차 종료.
            if(isPochaEnd){
                pocha.updateEnd();
            }
        }
    }

    @Override
    public boolean pochaMeetingStart(Long pochaId) {
        Pocha entity = pochaRepository.findByPochaId(pochaId);

        // 포차가 대기중인 경우에만 시작 요청 활성화.
        if(entity.getIsWaiting()){
            entity.startHuntingPocha();
            for(Participant p : entity.getParticipant()){
                if(p.getExitAt() != null) continue;
                System.out.println("미팅 포차 시작 확인");
                p.updateCreate();
            }
            return true;
        }
        return false;
    }

    @Override
    public void pochaAlcohol(Long pochaId) {
        Pocha entity = pochaRepository.findByPochaId(pochaId);

        int count = 0;
        for(Participant p : entity.getParticipant()){
            if(p.getExitAt() == null){
                count += 1;
            }
        }

        entity.updateAlcohol(count);
    }

    @Override
    public void pochaSsul(Long pochaId, SsulReqeustDto reqeustDto) {
        Pocha pocha = pochaRepository.findByPochaId(pochaId);
        pocha.updateSsul(reqeustDto);
    }

    @Override
    public List<InviteResponseDto> pochaInviteList(String username) {
        User user = userRepository.findByUsername(username);
        List<InviteResponseDto> responseDtoList = new ArrayList<>();
        // 유효한 포차인지 확인하여 추가.
        inviteRepository.findByToUserOrderByCreateAtDesc(user).forEach(invite -> {
            if(!invite.getPocha().getIsEnd()){
                responseDtoList.add(new InviteResponseDto(invite));
            }
        });

        return responseDtoList;
    }

    @Override
    public boolean pochaInvite(InviteRequestDto requestDto) {
        User fromUser = userRepository.findByUsername(requestDto.getFromUsername());
        User toUser = userRepository.findByUserId(requestDto.getYouId());
        Pocha pocha = pochaRepository.findByPochaId(requestDto.getPochaId());

        // 이미 보낸 초대가 없을 경우에만 보냄.
        if(inviteRepository.findByToUserAndPocha(toUser, pocha) == null) {
            Invite invite = Invite.builder()
                    .fromUser(fromUser)
                    .toUser(toUser)
                    .pocha(pocha)
                    .build();

            // 초대 추가.
            Invite entity = inviteRepository.save(invite);
            return true;
        }else{
            return false;
        }
    }

    @Override
    public void pochaInviteRefuse(Long inviteId) {
        inviteRepository.deleteById(inviteId);
        Invite invite = inviteRepository.findById(inviteId).orElse(null);
    }

    @Override
    public Map<String, Object> pochaInviteAccept(Long inviteId, Long pochaId) {
        Invite invite = inviteRepository.findById(inviteId).orElse(null);

        inviteRepository.deleteById(invite.getInviteId());
        Map<String, Object> response = new HashMap<>();
        if(invite != null) {
            User user = invite.getToUser();
            Pocha pocha = invite.getPocha();

            // 포차가 닫히 경우 제거.
            if(pocha.getIsEnd()){
                response.put("message", "fail");
                return response;
            }

            // 참여 인원 수 계산
            int participantTotal = 0;
            for(Participant p : pocha.getParticipant()){
                if(p.getExitAt() == null) participantTotal++;
            }
            // 참여가 가능하다면 참여.
            if(pocha.getLimitUser() > participantTotal) {
                pochaEnter(PochaParticipantRequestDto.builder().pochaId(pocha.getPochaId()).username(user.getUsername()).isHost(false).build());
                response.put("data", new PochaResponseDto(pocha));
                response.put("message", "success");
                return response;
            }
        }

        // 불가능하다면 불참.
        response.put("message", "fail");
        return response;
    }
}
