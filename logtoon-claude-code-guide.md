# 로그툰 (Logtoon) — Claude Code 시작 가이드

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 서비스명 | 로그툰 (Logtoon) |
| 목적 | 웹툰 독서 기록 & 관리 |
| 형태 | 웹서비스 + PWA (아이폰 홈화면 추가 가능) |
| 저장 방식 | localStorage (기기 내 저장) + JSON 내보내기/가져오기 |
| 배포 | Vercel 무료 플랜 |
| 저작권 | 썸네일 미사용, 텍스트 카드 UI, 사용자 직접 입력 방식 |

---

## 기술 스택

```
React (Vite)
Tailwind CSS
localStorage
Vercel 배포
PWA (manifest + service worker)
```

---

## 주요 기능 (MVP)

- 작품 추가 / 편집 / 삭제
- 상태 관리: 읽는중 / 완결 / 보류 / 관심
- 읽은 회차 + 진행도 바
- 별점 (1~5)
- 작품별 메모
- 상태별 필터 + 검색 + 정렬
- 통계 요약 (총 편수, 누적 회차)
- JSON 내보내기 / 가져오기
- PWA 설정 (홈화면 아이콘)

---

## Claude Code 시작하기

### 사전 준비

1. **Node.js 18 이상** 설치 확인
   ```bash
   node --version
   ```

2. **Claude Code 설치**
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

3. **Claude Pro 구독** 필요 ($20/월) — 이미 구독 중이면 바로 사용 가능

4. **인증**
   ```bash
   claude
   ```
   터미널에서 `claude` 실행 후 로그인

---

### 프로젝트 생성

```bash
# Vite로 React 프로젝트 생성
npm create vite@latest logtoon -- --template react
cd logtoon
npm install

# Tailwind CSS 설치
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Claude Code 시작
claude
```

---

### CLAUDE.md 작성

프로젝트 루트에 `CLAUDE.md` 파일을 만들어두면 Claude Code가 매 세션마다 프로젝트 맥락을 이해함.

```markdown
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
{
  id: number,
  title: string,
  author: string,
  genre: string,
  status: '읽는중' | '완결' | '보류' | '관심',
  currentEp: number,
  totalEp: number | null,
  rating: number | null,  // 1~5
  memo: string,
  createdAt: string,
  updatedAt: string
}

## 개발 명령어
- npm run dev : 개발 서버
- npm run build : 빌드
- npm run preview : 빌드 미리보기
```

---

### 개발 순서 (Claude Code에 요청할 것들)

#### Step 1 — 기본 구조
```
로그툰 앱의 기본 파일 구조를 만들어줘.
App.jsx, 컴포넌트 폴더, useWebtoons 훅 포함해서.
```

#### Step 2 — localStorage 훅
```
useWebtoons.js 커스텀 훅을 만들어줘.
CRUD 기능과 localStorage 저장/불러오기 포함.
```

#### Step 3 — 메인 UI
```
WebtoonList 컴포넌트를 만들어줘.
CLAUDE.md의 데이터 구조 기반으로,
텍스트 카드 스타일, 상태 태그, 진행도 바, 별점 포함.
```

#### Step 4 — 모달
```
작품 추가/편집 모달 컴포넌트를 만들어줘.
```

#### Step 5 — 필터 & 검색
```
상태별 필터, 제목/작가 검색, 정렬 기능 추가해줘.
```

#### Step 6 — 내보내기/가져오기
```
JSON 내보내기와 가져오기 기능을 추가해줘.
```

#### Step 7 — PWA 설정
```
PWA 설정을 추가해줘.
manifest.json, service worker, 아이콘 포함.
앱 이름은 로그툰.
```

---

### Vercel 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 빌드 후 배포
npm run build
vercel
```

또는 GitHub에 push 후 Vercel 대시보드에서 연동하면 자동 배포.

---

## 아이폰에서 앱처럼 사용하기

1. Safari로 배포된 URL 접속
2. 하단 공유 버튼 탭
3. **홈 화면에 추가** 선택
4. 이후 홈화면 아이콘으로 바로 실행

---

## 향후 기능 (Phase 2~)

- [ ] 커스텀 태그
- [ ] 읽기 히스토리 타임라인
- [ ] 월별 독서 통계
- [ ] 클라우드 동기화 (Supabase 연동)
