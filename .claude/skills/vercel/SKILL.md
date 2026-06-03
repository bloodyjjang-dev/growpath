# vercel

현재 프로젝트를 Vercel에 배포한다.
미커밋 변경이 있으면 먼저 `/push` 스킬로 GitHub에 올린 뒤 배포한다.

## 전제 조건

- Node.js 설치 여부: `node -v`
- Vercel CLI 설치 여부: `vercel --version`
  - 없으면 `npm i -g vercel` 실행 후 계속.
- 로그인 여부: `vercel whoami`
  - 미로그인이면 `vercel login` 안내 후 대기.

## 실행 절차

### 1. 변경 사항 동기화

```powershell
git status --short
```

미커밋 변경이 있으면 `/push` 스킬을 먼저 실행한다.
(GitHub 연동 없이 순수 Vercel CLI 배포를 원하면 이 단계를 건너뛴다.)

### 2. 프로젝트 연결 확인

```powershell
Get-Content .vercel\project.json -ErrorAction SilentlyContinue
```

- `.vercel/project.json` 없음 → 신규 연결: `vercel link` 또는 배포 시 자동 생성.
- 있음 → 기존 프로젝트에 연결된 상태.

### 3. 배포 실행

**Preview 배포 (기본)**
```powershell
vercel
```

**Production 배포**
```powershell
vercel --prod
```

사용자가 `--prod` 또는 "프로덕션", "운영"이라고 명시한 경우에만 `--prod` 플래그를 사용한다.

### 4. 완료 보고

배포 성공 시 다음을 출력한다:
- 배포 URL (Preview / Production)
- 프로젝트 대시보드 URL
- 빌드 로그 마지막 10줄 (오류 여부 확인용)

빌드 실패 시: 오류 메시지를 그대로 보여주고 원인을 분석해 수정 방향을 제안한다.

## 호출 예시

```
/vercel              # Preview 배포
/vercel --prod       # Production 배포
```

## 환경 변수 관리

배포 전 환경 변수가 필요한 경우:
```powershell
vercel env add <KEY>          # 대화형으로 값 입력
vercel env ls                 # 현재 등록된 변수 목록
```

`.env` 파일이 있으면 내용을 확인하고 Vercel에 등록되지 않은 키를 사용자에게 알린다.
단, 값은 절대 화면에 출력하지 않는다.

## 주의 사항

- `vercel --prod` 는 운영 트래픽에 즉시 반영된다. 사용자가 명시할 때만 실행한다.
- 빌드 명령·출력 디렉터리는 `vercel.json` 또는 Vercel 대시보드 설정을 우선한다.
- 모노레포 구조라면 `--cwd <서브디렉터리>` 옵션이 필요할 수 있다.
