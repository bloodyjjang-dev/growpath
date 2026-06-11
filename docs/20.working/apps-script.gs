/*════════════════════════════════════════════════════════════════
  블크업 13기 — 상담 신청 수신용 Google Apps Script
  ──────────────────────────────────────────────────────────────
  ▶ 하는 일
    1) 랜딩 신청폼에서 보낸 데이터를 구글시트에 한 줄씩 자동 기록
    2) 새 신청이 들어올 때마다 지정한 네이버 메일로 알림 발송

  ▶ 설치 방법 (10분)
    ── A. 구글시트 만들기 ──────────────────────────
    1. https://sheets.google.com 에서 새 시트 생성
       (시트 이름 예: "블크업 13기 상담신청")
    2. 첫 번째 탭 이름을 "상담신청" 으로 변경 (선택사항, 아래 SHEET_NAME과 일치시키면 됨)

    ── B. Apps Script 붙여넣기 ─────────────────────
    3. 시트 상단 메뉴: 확장 프로그램 → Apps Script
    4. 기본 코드(Code.gs)를 모두 지우고, 이 파일 내용을 전부 붙여넣기
    5. 아래 CONFIG의 NOTIFY_EMAIL 을 본인 네이버 메일로 변경
       예) "yourname@naver.com"
    6. 디스크 아이콘으로 저장 (Ctrl+S)

    ── C. 웹앱으로 배포 ───────────────────────────
    7. 우측 상단 "배포" → "새 배포"
    8. 톱니바퀴(유형 선택) → "웹 앱"
    9. 설정:
         - 설명: 블크업 상담신청
         - 실행 계정: 나
         - 액세스 권한: "모든 사용자"  ← 반드시 이걸로!
    10. "배포" 클릭 → 권한 승인(본인 구글 계정 허용)
    11. 표시되는 "웹 앱 URL" (…/exec 로 끝남) 복사

    ── D. 랜딩에 연결 ────────────────────────────
    12. app.jsx 상단의 APPS_SCRIPT_URL 값에 11번 URL 붙여넣기
        const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfyc…/exec";

  ▶ 네이버 메일 수신 관련
    - 발신 주체는 Apps Script(=구글 계정 Gmail)입니다.
      네이버 메일로 "받기"만 하므로 네이버쪽 추가 설정은 필요 없습니다.
    - 혹시 알림이 안 오면 네이버 메일의 스팸함을 확인하고,
      보낸사람을 "수신 허용"으로 등록하세요.

  ▶ 코드 수정 후에는 반드시 "배포 → 배포 관리 → 편집(연필) → 버전: 새 버전 → 배포"
    로 재배포해야 변경이 적용됩니다. (URL은 그대로 유지됩니다)
════════════════════════════════════════════════════════════════*/

const CONFIG = {
  SHEET_NAME: "상담신청",                 // 기록할 시트 탭 이름
  NOTIFY_EMAIL: "yourname@naver.com",      // ← 알림 받을 네이버 메일로 변경
  MAIL_SUBJECT: "[블크업 13기] 새 상담 신청이 도착했습니다",
};

// 상담 상태 코드 → 한글 라벨
const STATUS_LABEL = {
  "입문": "블로그 입문 (운영 6개월 미만)",
  "정체": "정체기 (운영 6개월 이상, 발행 멈춤)",
  "성장": "성장 중 (수익화 방향이 막막)",
  "기타": "기타",
};

/**
 * 랜딩 신청폼(fetch POST)이 호출하는 진입점.
 */
function doPost(e) {
  try {
    const data = parseBody(e);

    appendRow(data);
    sendNotifyMail(data);

    return jsonOutput({ result: "success" });
  } catch (err) {
    // 실패해도 폼은 no-cors라 응답을 못 읽지만, 로그로 남겨 디버깅
    console.error(err);
    return jsonOutput({ result: "error", message: String(err) });
  }
}

/**
 * 브라우저로 URL을 직접 열었을 때 동작 확인용.
 */
function doGet() {
  return jsonOutput({ result: "ok", message: "블크업 상담신청 수신 서버가 동작 중입니다." });
}

/* ── 요청 본문 파싱 (text/plain JSON 또는 form-encoded 모두 대응) ── */
function parseBody(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (_) {
      // form-encoded fallback
    }
  }
  return (e && e.parameter) ? e.parameter : {};
}

/* ── 구글시트에 한 줄 추가 ── */
function appendRow(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  // 시트 탭이 없으면 자동 생성
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }

  // 헤더가 비어있으면 헤더 먼저 작성
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["접수일시", "이름", "연락처", "현재 상태", "상담 시간대", "유입 페이지"]);
    sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  const now = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
  const statusLabel = STATUS_LABEL[data.status] || data.status || "";

  sheet.appendRow([
    now,
    data.name || "",
    data.phone || "",
    statusLabel,
    data.time || "",
    data.page || "블크업 13기",
  ]);
}

/* ── 네이버 메일로 알림 발송 ── */
function sendNotifyMail(data) {
  if (!CONFIG.NOTIFY_EMAIL || CONFIG.NOTIFY_EMAIL.indexOf("yourname") === 0) return;

  const now = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm");
  const statusLabel = STATUS_LABEL[data.status] || data.status || "-";

  const body =
    "블크업 13기 상담 신청이 새로 들어왔습니다.\n\n" +
    "■ 접수일시 : " + now + "\n" +
    "■ 이름     : " + (data.name || "-") + "\n" +
    "■ 연락처   : " + (data.phone || "-") + "\n" +
    "■ 현재상태 : " + statusLabel + "\n" +
    "■ 시간대   : " + (data.time || "-") + "\n" +
    "■ 페이지   : " + (data.page || "블크업 13기") + "\n\n" +
    "— 구글시트에 자동 기록되었습니다.";

  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAIL,
    subject: CONFIG.MAIL_SUBJECT,
    body: body,
  });
}

/* ── JSON 응답 헬퍼 ── */
function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
