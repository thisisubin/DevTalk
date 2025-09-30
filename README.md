# 💬 DevTalk

Node.js 기반의 개발자 커뮤니티 SNS 프로젝트  
(사이드 프로젝트 / 개인 개발)

---

#### 🚀 Features

- 사용자 인증 (로그인 / 회원가입 / 소셜 로그인)
- 게시글 작성 / 조회 / 수정 / 삭제  
- 댓글 기능  
- 해시태그(#) 기능 및 태그별 게시물 조회  
- 팔로우 / 팔로워 기능  
- 피드 기능 (팔로우한 유저의 글 모아서 보기)  
- Swagger 기반 API 문서 제공  

---

#### 🧩 Tech Stack

| 구분 | 기술 |
|------|------|
| Backend | Node.js, Express |
| Database | MySQL |
| ORM | Sequelize |
| 인증 | Passport.js (Local / OAuth) |
| API 문서화 | Swagger |
| 기타 | bcrypt, JWT, CORS 등 |

---

#### 📁 Project Structure
```
/
├── app.js
├── config/
│ └── (환경 설정 파일)
├── controllers/
│ └── (각종 컨트롤러)
├── middlewares/
│ └── (인증, 에러 핸들링 등 미들웨어)
├── models/
│ └── (Sequelize 모델 정의)
├── routes/
│ └── (API 라우터 정의)
├── views/
│ └── (템플릿 or 프론트 연동 뷰 파일)
├── swagger.js
├── package.json
└── README.md
```

---

#### 🛠️ 설치 및 실행 방법

```bash
# 저장소 복제
git clone https://github.com/thisisubin/DevTalk.git

cd DevTalk

# 의존성 설치
npm install

# 환경 변수 설정
# .env 파일 또는 환경 변수로 DB 정보, JWT 시크릿, OAuth 키 등 설정

# 서버 실행 (개발 모드)
npm run dev

# 배포 / 운영 모드
npm start
```

---

#### 📌 API 문서 (Swagger)

- swagger.js 파일을 통해 API 문서화
- 서버 실행 후 /api-docs 또는 /swagger 엔드포인트로 접속하면 API 명세 확인 가능

---

#### 👤 My Role

- Express 서버 설계 및 RESTful API 구현
- Sequelize ORM을 활용한 DB 모델링 (User, Post, Comment, Hashtag, Follow 등)
- 해시태그 파싱 및 태그 연관 게시물 조회 기능 구현
- 인증/인가 로직 구현 (JWT, Passport.js)
- Swagger 기반 API 문서화
- 프론트엔드 연동을 고려한 API 응답 구조 설계

---

#### ✅ 향후 계획 & 개선 포인트

- 좋아요 / 북마크 기능 추가
- 파일 업로드 (이미지 첨부) 기능
- 검색 기능 강화 (키워드 검색, 태그 검색)
- 배포 자동화 / CI-CD 구축
