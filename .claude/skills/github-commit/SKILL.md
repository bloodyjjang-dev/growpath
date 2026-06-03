# github-commit

현재 작업 디렉터리의 변경 사항을 GitHub에 커밋·푸시한다.

## 실행 절차

아래 단계를 순서대로 수행한다. 각 단계에서 오류가 나면 즉시 사용자에게 보고하고 멈춘다.

### 1. 상태 확인

```powershell
git status
git diff --stat
```

변경 파일 목록을 사용자에게 보여준다.

### 2. 원격 저장소 확인

```powershell
git remote -v
```

- 원격(origin)이 없으면: 사용자에게 GitHub URL을 물어보고 `git remote add origin <URL>` 실행.
- 이미 있으면: 그대로 진행.

### 3. 브랜치 확인

```powershell
git branch
```

- 브랜치가 없으면(커밋 이력 없음): `main` 브랜치로 시작.
- 이미 브랜치가 있으면: 현재 브랜치 이름을 기억해 둔다.

### 4. 커밋 메시지 생성

사용자가 메시지를 인자로 전달한 경우 그대로 사용한다.  
전달하지 않은 경우: `git diff --cached` 와 `git status` 를 바탕으로 변경 내용을 요약해 한국어 커밋 메시지를 자동 작성한다.

커밋 메시지 형식:
```
<타입>: <한 줄 요약>

- 변경 항목 1
- 변경 항목 2
```

타입 기준:
| 타입 | 사용 시점 |
|------|-----------|
| feat | 새 기능 추가 |
| fix | 버그 수정 |
| docs | 문서만 변경 |
| style | 포맷·공백 등 로직 무관 변경 |
| refactor | 리팩터링 |
| chore | 빌드·설정·의존성 변경 |
| init | 최초 커밋 |

### 5. 스테이징 & 커밋

```powershell
git add -A
git commit -m "<생성된 메시지>"
```

### 6. 푸시

```powershell
git push -u origin <브랜치명>
```

푸시 성공 시 원격 URL과 커밋 해시를 사용자에게 보고한다.

## 호출 예시

```
/github-commit
/github-commit feat: 랜딩 페이지 초안 추가
```

## 주의 사항

- `git init` 이 안 되어 있으면 먼저 실행한다.
- force-push(`--force`) 는 사용자가 명시적으로 요청할 때만 사용한다.
- 민감 정보(API 키, 비밀번호)가 스테이징되면 커밋 전에 경고하고 확인을 받는다.
