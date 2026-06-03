# push

현재 브랜치의 커밋되지 않은 변경 사항을 스테이징·커밋·푸시까지 한 번에 처리한다.
이미 커밋된 상태라면 푸시만 수행한다.

## 실행 절차

### 1. 저장소 초기화 여부 확인

```powershell
git rev-parse --is-inside-work-tree
```

실패하면 `git init` 실행 후 계속 진행한다.

### 2. 변경 사항 확인

```powershell
git status --short
git log --oneline -5
```

- **미커밋 변경 없음 + 푸시할 커밋 있음** → 4단계(푸시)로 바로 이동.
- **미커밋 변경 있음** → 3단계(커밋)부터 진행.
- **변경도 없고 푸시할 커밋도 없음** → "푸시할 내용이 없습니다." 보고 후 종료.

### 3. 자동 커밋 (미커밋 변경이 있을 때)

`git diff HEAD` 와 `git status` 를 읽어 변경 내용을 파악한 뒤 커밋 메시지를 자동 작성한다.

커밋 메시지 형식:
```
<타입>: <한 줄 요약>

- 세부 변경 항목
```

타입 선택 기준:

| 타입 | 사용 시점 |
|------|-----------|
| feat | 새 기능 추가 |
| fix | 버그 수정 |
| docs | 문서만 변경 |
| style | 포맷·공백 등 로직 무관 변경 |
| refactor | 리팩터링 |
| chore | 빌드·설정·의존성 변경 |
| init | 최초 커밋 |

```powershell
git add -A
git commit -m "<자동 생성 메시지>"
```

### 4. 원격 저장소 확인

```powershell
git remote -v
```

- origin 없음 → 사용자에게 GitHub 저장소 URL을 묻고 `git remote add origin <URL>` 실행.
- origin 있음 → 그대로 진행.

### 5. 푸시

```powershell
git push -u origin <현재 브랜치명>
```

### 6. 완료 보고

푸시 성공 시 다음을 출력한다:
- 원격 저장소 URL
- 브랜치명
- 최신 커밋 해시 및 메시지

## 호출 예시

```
/push
```

인자 없이 호출하면 전 과정을 자동 처리한다.

## 주의 사항

- force-push(`--force`, `--force-with-lease`)는 사용자가 명시 요청할 때만 사용한다.
- `.env`, 비밀키, 토큰 등 민감 파일이 스테이징 목록에 있으면 커밋 전에 경고하고 확인을 받는다.
- `.gitignore` 가 없으면 일반적인 무시 패턴(`node_modules/`, `*.env`, `dist/` 등)을 제안한다.
