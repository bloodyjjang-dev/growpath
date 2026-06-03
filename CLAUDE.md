# growpath

TODO: 프로젝트 설명

## 프로젝트 개요

## 폴더 구조

```
docs/
  10.input/      ← 외부에서 받은 원본 자료 (수정하지 않음)
  20.working/    ← 작업 중인 초안·중간 산출물
  30.output/     ← 최종 결과물 (공유·배포용)
  90.reference/  ← 참고 문서·링크·캡처
```

## 작업 규칙 (Claude가 따라야 할 규칙)

### Skill 구성 규칙
- 사용자가 생성한 Skill은 반드시 `.claude/skills/{스킬명}/SKILL.md` 형태로 만든다.
  (스킬명 폴더를 만들고 그 아래에 `SKILL.md`를 둔다 — `.claude/skills/SKILL.md` 처럼 평탄하게 두지 않는다)
- Skill에서 사용하는 스크립트는 `.claude/skills/{스킬명}/scripts/` 아래에 둔다.
- Skill이 참고하는 문서·예시·데이터 파일은 `.claude/skills/{스킬명}/references/` 아래에 둔다.

## 자주 쓰는 명령

이 문서는 Claude가 매 대화 시작 시 자동으로 읽는다.
