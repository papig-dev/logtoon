# 로그툰 (Logtoon)

웹툰 독서 기록 & 관리 웹앱. React + Vite + Tailwind CSS.

## 핵심 원칙
- 텍스트 기반 미니멀 UI (Notion/Linear 느낌)
- 썸네일 이미지 사용 안 함 — 저작권 이슈
- 데이터는 localStorage에 저장
- PWA 지원 (아이폰 홈화면 추가)

## 컴포넌트 구조
- App.jsx — 전체 레이아웃, 상태 관리
- components/WebtoonList.jsx — 목록 테이블
- components/WebtoonModal.jsx — 추가/편집 모달
- components/Stats.jsx — 상단 통계
- hooks/useWebtoons.js — localStorage 연동 커스텀 훅

## 데이터 구조
```json
{
  "id": "number",
  "title": "string",
  "author": "string",
  "genre": "string",
  "status": "읽는중 | 완결 | 보류 | 관심",
  "currentEp": "number",
  "totalEp": "number | null",
  "rating": "number | null",
  "memo": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

## 개발 명령어
- `npm run dev` — 개발 서버
- `npm run build` — 빌드
- `npm run preview` — 빌드 미리보기

## 기술 스택
- React (Vite)
- Tailwind CSS
- localStorage
- Vercel 배포
- PWA (manifest + service worker)

## 주요 기능
- 작품 추가 / 편집 / 삭제
- 상태 관리: 읽는중 / 완결 / 보류 / 관심
- 읽은 회차 + 진행도 바
- 별점 (1~5)
- 작품별 메모
- 상태별 필터 + 검색 + 정렬
- 통계 요약 (총 편수, 누적 회차)
- JSON 내보내기 / 가져오기
- PWA 설정 (홈화면 아이콘)
