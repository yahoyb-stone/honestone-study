# 배포 안내 (Vercel)

이 사이트를 처음 올리거나, 도메인을 붙이거나, 신청이 안 될 때 보는 문서입니다.

## 환경변수

코드가 읽는 값은 이게 전부입니다. 이름은 `bniwest` 와 같게 두었으므로 그쪽
설정에서 그대로 복사하면 됩니다.

| 변수 | 필수 | 쓰이는 곳 | 없으면 |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | **필수** | `src/lib/supabase.ts` | 신청 버튼에서 오류 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **필수** | `src/lib/supabase.ts` | 신청 버튼에서 오류 |
| `NEXT_PUBLIC_SITE_URL` | 권장 | `src/config/study.ts` | Vercel 배포 주소를 자동으로 씀 |
| `SMTP_USER` `SMTP_PASS` `NOTIFY_TO` | 선택 | `src/lib/notify.ts` | 알림 메일만 안 감, 접수는 정상 |

값을 가져올 곳은 둘 중 편한 쪽입니다.

- Vercel → `bniwest` 프로젝트 → Settings → Environment Variables
- Supabase 대시보드 → Project Settings → API (`Project URL`, `anon public`)

`SMTP_PASS` 는 계정 비밀번호가 아니라 **앱 비밀번호 16자**입니다.
`NOTIFY_TO` 를 비우면 `src/config/study.ts` 의 연락처 이메일로 갑니다.

## ⚠️ 환경변수를 나중에 넣으면 반영되지 않습니다

`NEXT_PUBLIC_` 으로 시작하는 값은 **빌드할 때 코드 안에 박힙니다.** Next.js
문서가 못박아 둔 동작입니다 — *"빌드된 뒤에는 이 환경변수의 변경에 더 이상
반응하지 않는다."*

그래서 **이미 배포한 뒤에 환경변수를 추가했다면 반드시 다시 빌드해야
합니다.**

> Deployments → 맨 위 배포의 `⋯` → **Redeploy** →
> **"Use existing Build Cache" 체크 해제** → Redeploy

신청이 안 될 때 열에 아홉은 이것입니다.

## 처음 올릴 때

1. https://vercel.com/new — 로그인된 계정이 맞는지 먼저 확인
2. **Import Git Repository** → `yahoyb-stone/honestone-study`
   - 목록에 없으면 *Adjust GitHub App Permissions* 에서 이 레포를 체크
3. 빌드 설정은 **전부 기본값**으로 둔다 (Framework: Next.js 자동 인식,
   Root Directory `./`, Build/Install Command 손대지 않음)
4. **Deploy 를 누르기 전에** 위 환경변수를 넣는다.
   환경 체크박스는 **Production · Preview · Development 셋 다** 켠다 —
   하나라도 빠지면 그 환경에서만 조용히 실패한다
5. Deploy

## 배포하고 나서 확인할 것

1. 사이트가 열리는가
2. **신청 폼에 본인 번호로 한 건 넣어 본다**
3. 기존 관리자 명단(`bniwest.kr/admin`)에 **"인증 전문가 스터디 1기"** 로
   뜨는가 — 신청은 같은 Supabase 로 들어간다
4. 확인했으면 그 테스트 건은 관리자에서 지운다

### 안 될 때 — Runtime Logs 를 본다

Vercel → Deployments → 해당 배포 → **Runtime Logs** 에서 `[apply]` 로
시작하는 줄을 찾는다. 원인이 드러나게 남겨 두었다.

| 로그 | 원인 | 조치 |
| --- | --- | --- |
| `[apply] Supabase env missing` | 환경변수가 없거나 빌드 전에 안 넣음 | 넣고 **캐시 없이 Redeploy** |
| `[apply] insert error 401` / `403` | 키가 틀렸거나 RLS 거부 | anon 키를 다시 복사 |
| `too many submissions` | 같은 번호로 반복 접수 (정상 동작) | 다른 번호로 테스트 |

**사이트 대신 로그인 화면이 뜬다면** Settings → **Deployment Protection**
에서 *Vercel Authentication* 이 켜져 있는 것이다. 외부에 공개하려면 끈다.

## 도메인 붙이기

1. Settings → Domains → Add → 도메인 입력
2. Vercel 이 알려주는 DNS 레코드를 등록기관에 넣는다
   (보통 A `76.76.21.21` 또는 CNAME `cname.vercel-dns.com`)
3. 연결되면 `NEXT_PUBLIC_SITE_URL` 을 새 도메인으로 바꾸고
   **다시 Redeploy** — 위의 그 함정이 여기서도 똑같이 걸린다
4. `bniwest` 저장소의 `src/config/site.ts` 에 있는 `study.url` 도 새 주소로
   바꾼다. 메인·푸터의 스터디 링크가 이 값을 쓴다

## 그 뒤로는

GitHub 연결 방식이라 `main` 에 푸시되면 프로덕션이 자동으로 다시 배포되고,
PR 을 열면 미리보기 주소가 생긴다. 일정·회비가 정해져 `src/config/study.ts`
를 고쳐 푸시하면 화면과 공유 이미지가 함께 따라온다.

## 두 저장소가 맞춰야 하는 값

`src/config/study.ts` 의 `studyAssignLabel` 과 `bniwest` 의
`study.assignLabel` 은 **글자 하나까지 같아야** 관리자 명단이 갈린다.
2기를 열어 라벨을 바꿀 때는 양쪽을 함께 고치고, 기존 행의 `chapter` 값도
update 해야 명단에서 사라지지 않는다.
