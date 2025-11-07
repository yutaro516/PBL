// ==========================================================
// Code.gs（動いていたときの完全復元版）
// ==========================================================


// ✅ スプレッドシート情報
const SPREADSHEET_ID = '1ASjhxPSwbz3TRSzBqyjL1BJzpkDbAJZ-918dSPvVxxg';
const SHEET_NAME = 'フォームの回答1';  // ←あなたの現状と一致


// ✅ 列番号（0スタート）
const DATE_COLUMN_INDEX = 0;      // タイムスタンプ
const ITEM_COLUMN_INDEX = 1;      // 落とし物
const LOCATION_COLUMN_INDEX = 2;  // 場所
const PHOTO_COLUMN_INDEX = 3;     // 写真URL




// ==========================================================
// ✅ doGet（場所ページ表示）
// ==========================================================
function doGet(e) {


  if (!e || !e.parameter || !e.parameter.location) {
    const t = HtmlService.createTemplateFromFile('Result');
    return t.evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }


  const place = e.parameter.location;


  const html = HtmlService.createTemplateFromFile('Index');
  html.place = place;


  return html.evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}




// ==========================================================
// ✅ 指定した場所の落とし物データを取得
// ==========================================================
function getLostItemsByLocation(place) {


  if (!place) return [];


  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const values = sheet.getDataRange().getValues();


    const result = [];


    for (let i = 1; i < values.length; i++) {
      const row = values[i];


      if (row[LOCATION_COLUMN_INDEX] &&
          row[LOCATION_COLUMN_INDEX].toString().trim() === place) {


        const timestamp =
          row[DATE_COLUMN_INDEX] instanceof Date
            ? row[DATE_COLUMN_INDEX].toLocaleString()
            : row[DATE_COLUMN_INDEX];


        const itemName = row[ITEM_COLUMN_INDEX];
        const photoUrl = row[PHOTO_COLUMN_INDEX];  // ←変換しない（元のまま）


        result.push({
          timestamp: timestamp,
          item: itemName,
          photoLink: photoUrl          // ←そのまま返す
        });
      }
    }


    return result;


  } catch (err) {
    Logger.log('Error: ' + err);
    return [];
  }
}




// ==========================================================
// ✅ include（HTML読み込み）
// ==========================================================
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
