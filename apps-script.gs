// ============================================================
//  DYNANCE — Google Apps Script Backend (apps-script.gs)
//  Paste this entire file into:
//  Google Sheets → Extensions → Apps Script → replace all code → Save
//  Then: Deploy → New deployment → Web App → Anyone → Deploy
//  Copy the Web App URL and paste it into admin.html ADMIN_CONFIG.appsScriptURL
// ============================================================

// ── CONFIG: Update this to match YOUR Google Sheet ──────────
// The name of the sheet tab where products are stored (default: Sheet1)
const SHEET_NAME = "Products";

// ── MAIN ROUTER ─────────────────────────────────────────────
// Google Apps Script calls doGet for GET requests, doPost for POST requests.

function doGet(e) {
  // GET request: return all products
  const action = e.parameter.action;
  if (action === "get") {
    return getProducts();
  }
  return jsonResponse({ status: "error", message: "Unknown action" });
}

function doPost(e) {
  // POST request: add, update, or delete a product
  try {
    const payload = JSON.parse(e.postData.contents);
    const action  = payload.action;

    if (action === "add")    return addProduct(payload.product);
    if (action === "update") return updateProduct(payload.product);
    if (action === "delete") return deleteProduct(payload.id);

    return jsonResponse({ status: "error", message: "Unknown action" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

// ── GET ALL PRODUCTS ─────────────────────────────────────────
function getProducts() {
  const sheet = getSheet();
  const data  = sheet.getDataRange().getValues();

  // Row 0 is the header row — skip it
  if (data.length <= 1) {
    return jsonResponse({ status: "ok", products: [] });
  }

  const headers  = data[0]; // ["id","name","description","price","imgURL","emoji","inStock"]
  const products = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  return jsonResponse({ status: "ok", products });
}

// ── ADD PRODUCT ──────────────────────────────────────────────
function addProduct(p) {
  const sheet = getSheet();
  ensureHeaders(sheet);

  // Append a new row with the product data
  sheet.appendRow([
    p.id          || Date.now().toString(),
    p.name        || "",
    p.description || "",
    p.price       || "",
    p.imgURL      || "",
    p.emoji       || "📦",
    p.inStock     !== undefined ? p.inStock.toString() : "true",
  ]);

  return jsonResponse({ status: "ok", message: "Product added" });
}

// ── UPDATE PRODUCT ───────────────────────────────────────────
function updateProduct(p) {
  const sheet = getSheet();
  const data  = sheet.getDataRange().getValues();

  // Find the row with matching id (column A = index 0)
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString() === p.id.toString()) {
      // Update columns B through G (indices 1-6)
      sheet.getRange(i + 1, 2).setValue(p.name        || "");
      sheet.getRange(i + 1, 3).setValue(p.description || "");
      sheet.getRange(i + 1, 4).setValue(p.price       || "");
      sheet.getRange(i + 1, 5).setValue(p.imgURL      || "");
      sheet.getRange(i + 1, 6).setValue(p.emoji       || "📦");
      sheet.getRange(i + 1, 7).setValue(p.inStock !== undefined ? p.inStock.toString() : "true");
      return jsonResponse({ status: "ok", message: "Product updated" });
    }
  }

  return jsonResponse({ status: "error", message: "Product not found" });
}

// ── DELETE PRODUCT ───────────────────────────────────────────
function deleteProduct(id) {
  const sheet = getSheet();
  const data  = sheet.getDataRange().getValues();

  // Find row with matching id and delete entire row
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString() === id.toString()) {
      sheet.deleteRow(i + 1); // +1 because sheet rows are 1-indexed
      return jsonResponse({ status: "ok", message: "Product deleted" });
    }
  }

  return jsonResponse({ status: "error", message: "Product not found" });
}

// ── HELPERS ──────────────────────────────────────────────────

// Get or create the Products sheet tab
function getSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);

  // Create sheet and add headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["id", "name", "description", "price", "imgURL", "emoji", "inStock"]);
    // Style the header row
    sheet.getRange(1, 1, 1, 7).setBackground("#1E3A5F").setFontColor("#FFFFFF").setFontWeight("bold");
  }

  return sheet;
}

// Ensure headers exist (in case sheet was created manually)
function ensureHeaders(sheet) {
  const firstRow = sheet.getRange(1, 1).getValue();
  if (firstRow !== "id") {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, 7).setValues([["id","name","description","price","imgURL","emoji","inStock"]]);
    sheet.getRange(1, 1, 1, 7).setBackground("#1E3A5F").setFontColor("#FFFFFF").setFontWeight("bold");
  }
}

// Wrap any object in a JSON ContentService response with CORS headers
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
