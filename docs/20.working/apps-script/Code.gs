// === 설정 ===
const SPREADSHEET_ID = "1yIerpkBH3yFHd8iXpYJKaykFAo3JKrs5NGhin3dN9Rg";
const SHEET_NAME = "상담리스트";
const NOTIFY_EMAIL = "hanabro00@naver.com"; // 알림 받을 네이버 메일 주소

/**
 * 랜딩페이지 폼에서 POST로 전송된 신청 데이터를
 * 1) 구글시트에 한 줄로 기록하고
 * 2) 네이버 메일로 알림 메일을 발송한다.
 *
 * 폼 전송 예 (app.jsx):
 * fetch(SCRIPT_URL, {
 *   method: "POST",
 *   mode: "no-cors",
 *   headers: { "Content-Type": "text/plain;charset=utf-8" },
 *   body: JSON.stringify({ name, phone, status, time })
 * });
 */
function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  const sheet = getOrCreateSheet();
  const timestamp = new Date();

  sheet.appendRow([
    timestamp,
    data.name || "",
    data.phone || "",
    data.status || "",
    data.time || "",
  ]);

  sendNotificationMail(data, timestamp);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["접수일시", "이름", "연락처", "현재 상태", "상담 가능 시간대"]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function sendNotificationMail(data, timestamp) {
  const subject = `[블크업 13기] 신규 상담 신청 - ${data.name}`;
  const formattedTime = Utilities.formatDate(timestamp, "Asia/Seoul", "yyyy-MM-dd HH:mm");

  const body = [
    "새로운 상담 신청이 접수되었습니다.",
    "",
    `접수일시: ${formattedTime}`,
    `이름: ${data.name}`,
    `연락처: ${data.phone}`,
    `현재 상태: ${data.status}`,
    `상담 가능 시간대: ${data.time}`,
  ].join("\n");

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}
