/**
 * Boatyard — Brand Personality response endpoint
 * Deploy: Extensions > Apps Script, paste this, then Deploy > New deployment
 *         > Web app > Execute as: Me > Who has access: Anyone
 *
 * Two separate keys. The survey page is public, so its key must only be
 * able to append rows. Reading every response requires the other key,
 * which never appears in any published file.
 */
var SHEET_ID   = '1Dp0xWo7QmvnWeshiOV5QIHXbGgX00PcTx4s0q74hx08';
var SHEET_NAME = 'Responses';
var WRITE_KEY  = 'write_5ncaa860cifnbaanalyvpb4zsd';  // goes in index.html   (public — append only)
var READ_KEY   = 'read_tes35gkm3qxcd44ecrj0k63gox';   // goes in results.html (keep private — reads everything)

function sheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Append one response row. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var body = JSON.parse(e.postData.contents);

    /* Snapshot write — only the READ_KEY holder (results.html, kept local) can do this. */
    if (body.action === 'snapshot') {
      if (body.key !== READ_KEY) return json_({ error: 'Bad read key' });
      var ss  = SpreadsheetApp.openById(SHEET_ID);
      var sum = ss.getSheetByName('Summary') || ss.insertSheet('Summary');
      sum.clear();
      var rows = body.rows || [];
      if (rows.length) sum.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
      sum.autoResizeColumns(1, rows.length ? rows[0].length : 1);
      return json_({ ok: true, wrote: rows.length });
    }

    /* Delete one response row — only the READ_KEY holder can do this. */
    if (body.action === 'delete') {
      if (body.key !== READ_KEY) return json_({ error: 'Bad read key' });
      var sh2 = sheet_();
      var r   = parseInt(body.row, 10);
      if (!r || r < 2 || r > sh2.getLastRow()) return json_({ error: 'Row out of range' });
      sh2.deleteRow(r);
      return json_({ ok: true });
    }

    /* Normal response append — the public WRITE_KEY. */
    if (body.key !== WRITE_KEY) return json_({ error: 'Bad write key' });

    var sh   = sheet_();
    var row  = body.row || {};
    var keys = Object.keys(row);

    if (sh.getLastRow() === 0) sh.appendRow(keys);
    var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    sh.appendRow(headers.map(function (h) {
      return row[h] === undefined || row[h] === null ? '' : row[h];
    }));
    return json_({ ok: true });
  } catch (err) {
    return json_({ error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Return every response as JSON. */
function doGet(e) {
  if (!e || !e.parameter || e.parameter.key !== READ_KEY) return json_({ error: 'Bad read key' });
  var sh = sheet_();
  if (sh.getLastRow() < 2) return json_({ ok: true, rows: [] });

  var values  = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var headers = values[0];
  var rows    = values.slice(1)
    .map(function (r, i) { return { r: r, sheetRow: i + 2 }; })   // +2: header is row 1, data starts row 2
    .filter(function (x) { return x.r.join('').trim() !== ''; })
    .map(function (x) {
      var o = {};
      headers.forEach(function (h, i) { o[h] = x.r[i]; });
      o._row = x.sheetRow;
      return o;
    });
  return json_({ ok: true, rows: rows });
}
