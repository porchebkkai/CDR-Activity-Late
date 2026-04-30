// code.gs - Google Apps Script Code for Smart CDR System

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('Smart CDR System')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// --- CONFIGURATION CONSTANTS ---
const OFFENSE_CATEGORIES = {
  "Level 1": [
    { code: "L1_01", name: "1. ฝ่าฝืนกฎของห้องเรียนและสถานที่ต่างๆ (Violation of Class/Location Rules)" },
    { code: "L1_02", name: "2. แต่งกายผิดระเบียบ ไม่ตัดผม ไม่ตัดเล็บ (Uniform/Appearance Violation)" },
    { code: "L1_03", name: "3. ออกจากห้องช้า หรือเข้าห้องช้า (Late Entry/Exit)" },
    { code: "L1_04", name: "4. ไม่ปฏิบัติตามคำสั่งครู หรือขัดจังหวะการสอน (Insubordination/Disruption)" },
    { code: "L1_05", name: "5. กิน-ดื่มในห้องเรียน หรือยืนกิน/ดื่ม (Eating/Drinking in Class)" },
    { code: "L1_06", name: "6. ไม่ส่งงานและการบ้าน เกียจคร้าน (Homework Incomplete/Laziness)" },
    { code: "L1_07", name: "7. แสดงท่าทางหยาบคาย หรือสัญลักษณ์ที่ไม่เหมาะสม (Inappropriate Gestures)" },
    { code: "L1_08", name: "8. รบกวนเพื่อนขณะเล่น (Disturbing Others)" },
    { code: "L1_09", name: "9. เรียกชื่อเพื่อนไม่สุภาพ หรือตั้งฉายาที่ไม่ดี (Name Calling)" },
    { code: "L1_10", name: "10. ปล่อยข่าวลือ (Spreading Rumors)" },
    { code: "L1_11", name: "11. เตะหรือขว้างปาสิ่งของ (Kicking/Throwing Objects)" },
    { code: "L1_12", name: "12. ทิ้งขยะเรี่ยราด (Littering)" },
    { code: "L1_13", name: "13. มีพฤติกรรมที่เป็นอันตราย (Dangerous Behavior e.g. Running on Stairs)" },
    { code: "L1_14", name: "14. ใช้ภาษาไม่เหมาะสม (Inappropriate Language)" },
    { code: "L1_15", name: "15. ทำเสียงรบกวนหรือตะโกนโดยไม่จำเป็น (Unnecessary Noise/Shouting)" },
    { code: "L1_16", name: "16. มาสายหลัง 8.00 น. (Late Arrival post 8:00)" },
    { code: "L1_17", name: "17. ทะเลาะวิวาท หรือต่อสู้โดยไม่ทำให้บาดเจ็บ (Non-injurious Fighting)" },
    { code: "L1_18", name: "18. ลุกจากที่นั่งหลังจากได้รับคำเตือนแล้ว (Leaving Seat)" },
    { code: "L1_19", name: "19. ใช้เครื่องสำอางแต่งหน้า หรือใช้น้ำหอม (Using Makeup/Perfume)" },
    { code: "L1_20", name: "20. ใช้อุปกรณ์โรงเรียนผิดวัตถุประสงค์ (Misuse of School Equipment)" }
  ],
  "Level 2": [
    { code: "L2_01", name: "1. ฝ่าฝืนกฎระเบียบและนโยบายโรงเรียน (Major Policy Violation e.g. Skipping Class)" },
    { code: "L2_02", name: "2. พฤติกรรมก้าวร้าวต่อครู บุคลากร (Aggression towards Staff)" },
    { code: "L2_03", name: "3. ไม่ให้เกียรติครูอย่างร้ายแรง (Disrespecting Teacher)" },
    { code: "L2_04", name: "4. ตั้งใจทำลายการเรียนการสอน (Intentional Disruption)" },
    { code: "L2_05", name: "5. ไม่เชื่อฟัง ท้าทาย หรือลองดีต่อคำสั่งครู (Defiance)" },
    { code: "L2_06", name: "6. ทำร้ายร่างกายผู้อื่นจนบาดเจ็บ (Causing Injury)" },
    { code: "L2_07", name: "7. ทะเลาะวิวาทหรือต่อสู้กันบ่อยครั้ง (Frequent Fighting)" },
    { code: "L2_08", name: "8. ทำลายทรัพย์สินโรงเรียน (Vandalism)" },
    { code: "L2_09", name: "9. เกเร รังแก หรือข่มขู่เพื่อนนักเรียน (Bullying/Intimidation)" },
    { code: "L2_10", name: "10. โกหก หลอกลวง หรือลักขโมย (Lying/Theft)" },
    { code: "L2_11", name: "11. ทุจริตการสอบ (Cheating)" },
    { code: "L2_12", name: "12. พกพาวัตถุอันตรายหรืออาวุธ (Possession of Weapons)" },
    { code: "L2_13", name: "13. ติดเกม / ใช้ Social Media เสื่อมเสีย (Inappropriate Social Media/Gaming)" },
    { code: "L2_14", name: "14. พกพาโทรศัพท์มือถือ/สื่อสาร (Unauthorized Phone Possession)" },
    { code: "L2_15", name: "15. ครอบครองสื่อต้องห้าม (Possession of Banned Media)" },
    { code: "L2_16", name: "16. นำยานพาหนะมาโรงเรียนโดยไม่ได้รับอนุญาต (Unauthorized Vehicle)" },
    { code: "L2_17", name: "17. พฤติกรรมชู้สาว (Inappropriate PDA)" },
    { code: "L2_18", name: "18. พฤติกรรมอื่นๆ ที่เป็นอันตราย (Other Dangerous Behavior)" }
  ]
};
const PUNISHMENT_MATRIX = {
  "G_1_5": {
    "Level 1": [
      { min: 1, max: 2, punishment: "In-class Isolation", deduction: 5 },
      { min: 3, max: 4, punishment: "Run 5 Rounds", deduction: 5 },
      { min: 5, max: 6, punishment: "Lunch Detention (1 Day)", deduction: 5 },
      { min: 7, max: 999, punishment: "Lunch Detention (1 Week) + Run 8 Rounds", deduction: 5 }
    ],
    "Level 2": [
      { min: 1, max: 1, punishment: "Run 15 Rounds", deduction: 10 },
      { min: 2, max: 2, punishment: "Subject Withdrawal + Run", deduction: 10 },
      { min: 3, max: 3, punishment: "In-school Isolation + Run 20 Rounds", deduction: 10 },
      { min: 4, max: 999, punishment: "Probation / Parent Meeting", deduction: 10 }
    ]
  },
  "G_6_12": {
    "Level 1": [
      { min: 1, max: 2, punishment: "In-class Isolation", deduction: 5 },
      { min: 3, max: 4, punishment: "Run 10 Rounds", deduction: 5 },
      { min: 5, max: 6, punishment: "Lunch Detention (1 Day)", deduction: 5 },
      { min: 7, max: 999, punishment: "Lunch Detention (1 Week) + Run 15 Rounds", deduction: 5 }
    ],
    "Level 2": [
      { min: 1, max: 1, punishment: "Run 30 Rounds", deduction: 10 },
      { min: 2, max: 2, punishment: "Subject Withdrawal + Run", deduction: 10 },
      { min: 3, max: 3, punishment: "In-school Isolation + Run 40 Rounds", deduction: 10 },
      { min: 4, max: 999, punishment: "Probation / Parent Meeting", deduction: 10 }
    ]
  }
};

function getOffenseCategories() {
  return OFFENSE_CATEGORIES;
}

// --- SHARED CONSTANTS ---
const OFFENSE_LEVELS = { LEVEL_1: 'Level 1', LEVEL_2: 'Level 2' };
const GRADE_GROUPS   = { G_1_5: 'G_1_5',     G_6_12: 'G_6_12' };
const LATENESS_TYPES = { REAL_LATE: 'Real Late', ACTIVITY_LATE: 'Activity Late' };
// Canonical status values for Lateness_Log.Status
const LATENESS_STATUSES = { PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected', CONVERTED: 'Converted', PROCESSED: 'Processed' };
const CDR_STATUSES = { ACTIVE: 'Active', RESOLVED: 'Resolved' };
// Admin-level roles that see all records across all classes
const ADMIN_ROLES = ['Superadmin', 'VP', 'DisciplineDept'];
// ------------------------------

// --- SHARED UTILITIES ---

/**
 * Safely parses any value to a Date. Returns null on invalid input instead of
 * an Invalid Date object, preventing silent comparison failures.
 */
function parseSafeDate(value) {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  // Handle YYYY-MM config strings (append day so they parse as local time)
  if (typeof value === 'string' && /^\d{4}-\d{2}$/.test(value)) {
    value = value + '-01';
  }
  var d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Returns a 'yyyy-MM' string for the given date, using the script timezone.
 * Single source of truth for month-year keys used across all filter functions.
 */
function getMonthYearKey(date, tz) {
  var d = (date instanceof Date) ? date : parseSafeDate(date);
  if (!d) return null;
  return Utilities.formatDate(d, tz || Session.getScriptTimeZone(), 'yyyy-MM');
}

/**
 * Searches a 2-D sheet values array (from getValues()) for the row whose
 * column-0 value matches studentId. Returns the matched row array or null.
 */
function findStudentRow(studentId, data) {
  var sid = String(studentId).trim();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === sid) return data[i];
  }
  return null;
}

/**
 * Returns true when the given userRole is allowed to see records for
 * recordClass, given the user's assignedClasses string ('ALL' or CSV).
 */
function canAccessClass(userRole, assignedClasses, recordClass) {
  if (ADMIN_ROLES.indexOf(userRole) !== -1) return true;
  if (String(assignedClasses).toUpperCase() === 'ALL') return true;
  var classes = String(assignedClasses || '').split(',').map(function (c) { return c.trim(); });
  return classes.indexOf(String(recordClass).trim()) !== -1;
}

/**
 * Calculates the active term window from termConfig (keys: Semester1Start,
 * Semester1End, Semester2Start, Semester2End, each 'YYYY-MM').
 * Returns { startDate, endDate, term } — term is 1, 2, or 0 (fallback).
 */
function getCurrentTerm(termConfig) {
  var s1Start = parseSafeDate(termConfig['Semester1Start']);
  var s1End   = parseSafeDate(termConfig['Semester1End']);
  if (s1End) s1End = new Date(s1End.getFullYear(), s1End.getMonth() + 1, 0);

  var s2Start = parseSafeDate(termConfig['Semester2Start']);
  var s2End   = parseSafeDate(termConfig['Semester2End']);
  if (s2End) s2End = new Date(s2End.getFullYear(), s2End.getMonth() + 1, 0);

  var now = new Date();
  if (s1Start && s1End && now >= s1Start && now <= s1End) {
    return { startDate: s1Start, endDate: s1End, term: 1 };
  }
  if (s2Start && s2End && now >= s2Start && now <= s2End) {
    return { startDate: s2Start, endDate: s2End, term: 2 };
  }
  return { startDate: new Date(now.getFullYear(), 0, 1), endDate: new Date(now.getFullYear(), 11, 31), term: 0 };
}

/**
 * Reads and returns termConfig as a plain object from the Config sheet.
 * Centralised so callers don't each re-scan the sheet.
 */
function getTermConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var configSheet = ss.getSheetByName('Config');
  if (!configSheet) return {};
  var data = configSheet.getDataRange().getValues();
  var cfg = {};
  for (var i = 1; i < data.length; i++) cfg[data[i][0]] = data[i][1];
  return cfg;
}

/**
 * ONE-TIME MIGRATION — run once from the Apps Script editor after deployment.
 * Normalises legacy status values in Lateness_Log that were written before
 * the Phase 4 status-enum refactor:
 *   Accepted       → Approved
 *   Closed         → Rejected
 *   ConvertedToCDR → Converted
 * Safe to run multiple times (skips already-normalised rows).
 */
function migrateLatnessStatuses() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Lateness_Log');
  if (!sheet) { Logger.log('Lateness_Log sheet not found'); return; }

  var data = sheet.getDataRange().getValues();
  var statusCol = 10; // Column J (1-based) — Status field
  var map = { 'Accepted': 'Approved', 'Closed': 'Rejected', 'ConvertedToCDR': 'Converted' };
  var changed = 0;

  for (var i = 1; i < data.length; i++) {
    var current = String(data[i][statusCol - 1]).trim();
    if (map[current]) {
      sheet.getRange(i + 1, statusCol).setValue(map[current]);
      changed++;
    }
  }
  Logger.log('migrateLatnessStatuses: updated ' + changed + ' row(s).');
  return 'Done — ' + changed + ' row(s) updated.';
}
// ------------------------------

// --- PHASE 1: SETUP & CONFIGURATION (v2.3) ---

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Users Sheet
  var usersSheet = ss.getSheetByName('Users');
  var userHeaders = ['Username', 'Password', 'FullName', 'Role', 'AssignedClasses', 'Email', 'Status', 'LastLogin', 'PIN'];
  if (!usersSheet) { usersSheet = ss.insertSheet('Users'); usersSheet.appendRow(userHeaders); }
  else { usersSheet.getRange(1, 1, 1, userHeaders.length).setValues([userHeaders]); } // Enforce Headers

  // Generic Sheet Setup
  var sheetsToSetup = {
    'CDR_Log': ['ID', 'Date', 'StudentID', 'StudentName', 'Class', 'Level', 'Category', 'Description', 'RecordedBy', 'Status', 'ParentMeetingRequested', 'ParentMeetingApproved', 'Notes', 'OffenseCount', 'Punishment', 'Deduction'],
    'Lateness_Log': ['ID', 'Date', 'Time', 'StudentID', 'StudentName', 'Class', 'Reason', 'RecordedBy', 'RecordType', 'Status', 'StrikeCount', 'ReviewedBy', 'ReviewedAt', 'Action', 'Notes', 'ActedBy', 'ActedAt', 'CDR_ID'],
    'Attendance': ['ID', 'Date', 'StudentID', 'StudentName', 'Class', 'Status', 'Reason', 'RecordedBy'],
    'Tidiness': ['ID', 'Date', 'WeekOfYear', 'StudentID', 'StudentName', 'Class', 'Hair', 'Nails', 'Uniform', 'Bag', 'RecordedBy'],
    'Students': ['StudentID', 'FullName', 'Class', 'Gender', 'Status', 'ParentPhone'],
    'Config': ['Key', 'Value', 'Description'],
    'Bonus_Eligibility': ['StudentID', 'Month_Year', 'Is_Eligible', 'Disqualification_Reason', 'Last_Updated'],
    'Behaviour_Scores': ['StudentID', 'StudentName', 'Class', 'Term', 'AcademicYear', 'Score', 'LastUpdated']
  };

  for (var sheetName in sheetsToSetup) {
    var sheet = ss.getSheetByName(sheetName);
    var headers = sheetsToSetup[sheetName];
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(headers);
    } else {
      // Ensure headers are correct
      var existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var headersMatch = true;
      if (existingHeaders.length !== headers.length) {
        headersMatch = false;
      } else {
        for (var i = 0; i < headers.length; i++) {
          if (existingHeaders[i] !== headers[i]) {
            headersMatch = false;
            break;
          }
        }
      }
      if (!headersMatch) {
        // If headers don't match, overwrite them. This is a destructive operation for header row.
        // Consider more robust migration if data needs to be preserved under old headers.
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        // Clear any extra columns if new headers are shorter
        if (existingHeaders.length > headers.length) {
          sheet.getRange(1, headers.length + 1, 1, existingHeaders.length - headers.length).clearContent();
        }
      }
    }
  }

  // Seed Config defaults if empty
  var configSheet = ss.getSheetByName('Config');
  if (configSheet && configSheet.getLastRow() === 1) { // Only header row exists
    configSheet.appendRow(['AcademicYear', '2568', 'Current academic year']);
    configSheet.appendRow(['SchoolNameTH', 'โรงเรียนอิกเราะสามัญศึกษา', 'Official school name in Thai']);
    configSheet.appendRow(['Semester1Start', '', 'Start date of Semester 1 (YYYY-MM)']);
    configSheet.appendRow(['Semester1End', '', 'End date of Semester 1 (YYYY-MM)']);
    configSheet.appendRow(['Semester2Start', '', 'Start date of Semester 2 (YYYY-MM)']);
    configSheet.appendRow(['Semester2End', '', 'End date of Semester 2 (YYYY-MM)']);
    configSheet.appendRow(['Holidays', '[]', 'JSON array of holiday dates (YYYY-MM-DD)']);
  }

  return 'Database V2.3 Schema Enforced Successfully.';
}


// --- SYSTEM CONFIG ---
function getSystemConfig() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var configSheet = ss.getSheetByName('Config');
    // If missing, return default structure instead of just error string to prevent client crash
    if (!configSheet) {
      return {
        success: true,
        config: { academicYear: '', semester1Start: '', semester1End: '', semester2Start: '', semester2End: '', holidays: [] }
      };
    }

    var data = configSheet.getDataRange().getValues();
    var config = {
      academicYear: '',
      semester1Start: '', semester1End: '',
      semester2Start: '', semester2End: '',
      holidays: []
    };

    for (var i = 1; i < data.length; i++) {
      var key = data[i][0];
      var val = data[i][1];

      if (key === 'AcademicYear') config.academicYear = val;
      if (key === 'Semester1Start') config.semester1Start = val;
      if (key === 'Semester1End') config.semester1End = val;
      if (key === 'Semester2Start') config.semester2Start = val;
      if (key === 'Semester2End') config.semester2End = val;
      if (key === 'Holidays') {
        try { config.holidays = JSON.parse(val); } catch (e) { config.holidays = []; }
      }
    }
    return { success: true, config: config };
  } catch (e) {
    // Catch-all for any other runtime errors
    return { success: false, message: e.toString() };
  }
}


function saveSystemConfig(configData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var configSheet = ss.getSheetByName('Config');
  var data = configSheet.getDataRange().getValues();

  var updates = {
    'AcademicYear': configData.academicYear,
    'Semester1Start': configData.semester1Start,
    'Semester1End': configData.semester1End,
    'Semester2Start': configData.semester2Start,
    'Semester2End': configData.semester2End,
    'Holidays': JSON.stringify(configData.holidays)
  };

  // Upsert Logic
  for (var key in updates) {
    var found = false;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === key) {
        configSheet.getRange(i + 1, 2).setValue(updates[key]);
        found = true;
        break;
      }
    }
    if (!found) {
      configSheet.appendRow([key, updates[key]]);
    }
  }
  return { success: true };
}



// --- ADMIN CONSOLE BACKEND (Users & Students) ---

// 1. Fetch Users for Admin Table
function getAllUsers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  var data = sheet.getDataRange().getValues();
  var users = [];
  // Skip header (row 0)
  for (var i = 1; i < data.length; i++) {
    users.push({
      username: data[i][0],
      password: data[i][1], // Sent for editing (hashed)
      fullName: data[i][2],
      role: data[i][3],
      classes: data[i][4],
      email: data[i][5],
      status: data[i][6],
      pin: data[i][8] // PIN is Index 8
    });
  }
  return users;
}

// 2. Save User (Handles BOTH Add and Edit)
function saveUser(form) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Users');
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;

    // Search for existing user
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(form.username)) {
        rowIndex = i + 1; // 1-based index
        break;
      }
    }

    // Validation
    if (rowIndex === -1 && form.isEdit) return { success: false, message: 'User not found.' };
    if (rowIndex !== -1 && !form.isEdit) return { success: false, message: 'Username already exists.' };

    // Format Data: [User, Pass, Name, Role, Class, Email, Status, LastLogin(preserve), PIN]
    var newRow = [
      form.username,
      form.password,
      form.fullName,
      form.role,
      form.classes,
      form.email,
      form.status || 'Active',
      (rowIndex !== -1 ? data[rowIndex - 1][7] : ''), // Preserve LastLogin
      form.pin
    ];

    if (rowIndex === -1) {
      sheet.appendRow(newRow); // Create
    } else {
      sheet.getRange(rowIndex, 1, 1, 9).setValues([newRow]); // Update
    }
    return { success: true };

  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// 3. Delete User
function deleteUser(username) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(username)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'User not found' };
}

// 4. Fetch Students for Admin Table
function getAllStudentsAdmin() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Students');
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  // Return columns: ID, Name, Class, ParentPhone, Status
  // Assuming cols: [ID, Name, Class, ParentPhone, Status] -> [0, 1, 2, 3, 4]
  if (data.length <= 1) return [];
  return data.slice(1).map(function (r) {
    return { id: r[0], name: r[1], class: r[2], status: r[4] };
  });
}

// 5. Save Student (Admin)
function saveStudentAdmin(form) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Students');
    if (!sheet) return { success: false, message: 'Students sheet missing' };

    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;

    // Search for existing student by ID
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(form.id)) {
        rowIndex = i + 1;
        break;
      }
    }

    // Validation
    if (rowIndex === -1 && form.isEdit) return { success: false, message: 'Student ID not found.' };
    if (rowIndex !== -1 && !form.isEdit) return { success: false, message: 'Student ID already exists.' };

    // Row Data: [ID, Name, Class, Gender, Status, Phone]
    // Updated to match setupSheets definition
    var newRow = [
      form.id,
      form.name,
      form.class,
      form.gender || 'Male', // Default to Male if missing (Critical for punishment logic)
      form.status || 'Active',
      form.parentPhone || ''
    ];

    if (rowIndex === -1) {
      sheet.appendRow(newRow);
    } else {
      // Update all 6 columns
      sheet.getRange(rowIndex, 1, 1, 6).setValues([newRow]);
    }

    return { success: true };

  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// 6. Delete Student
function deleteStudentAdmin(studentId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Students');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(studentId)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Student not found' };
}


// --- AUTHENTICATION & SECURITY ---

// --- PIN Rate-Limiting Helpers ---

function getPinAttempts() {
  var config = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');
  if (!config) return {};
  var data = config.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === 'PinAttempts') {
      try { return JSON.parse(data[i][1]) || {}; } catch (e) { return {}; }
    }
  }
  return {};
}

function savePinAttempts(attempts) {
  var config = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');
  if (!config) return;
  var data = config.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === 'PinAttempts') {
      config.getRange(i + 1, 2).setValue(JSON.stringify(attempts));
      return;
    }
  }
  config.appendRow(['PinAttempts', JSON.stringify(attempts), 'PIN brute-force protection counters']);
}

/**
 * Authenticates a user via PIN.
 * Locks a PIN for 15 minutes after 5 consecutive failed attempts.
 * Checks Column I (Index 8) of the Users sheet.
 */
function authenticateByPIN(pin) {
  var pinKey = String(pin).trim();
  var now = new Date().getTime();

  // --- RATE LIMIT CHECK ---
  var attempts = getPinAttempts();
  var entry = attempts[pinKey] || { count: 0, lockedUntil: null };

  if (entry.lockedUntil && now < entry.lockedUntil) {
    var minutesLeft = Math.ceil((entry.lockedUntil - now) / 60000);
    return { success: false, locked: true, message: 'PIN ถูกล็อก กรุณารอ ' + minutesLeft + ' นาที (Locked — try again in ' + minutesLeft + ' min)' };
  }
  // -----------------------

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const userSheet = ss.getSheetByName('Users');
  const data = userSheet.getDataRange().getValues();

  // Structure: [Username, Password, FullName, Role, AssignedClasses, Email, Status, LastLogin, PIN]
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][8]).trim() === pinKey && data[i][6] === 'Active') {
      // SUCCESS — clear any existing counter for this PIN
      delete attempts[pinKey];
      savePinAttempts(attempts);

      return {
        success: true,
        user: {
          fullName: data[i][2],
          role: data[i][3],
          username: data[i][0],
          authMethod: 'PIN'
        }
      };
    }
  }

  // FAILURE — increment counter
  entry.count = (entry.count || 0) + 1;
  if (entry.count >= 5) {
    entry.lockedUntil = now + (15 * 60 * 1000); // lock for 15 minutes
    entry.count = 0;
    attempts[pinKey] = entry;
    savePinAttempts(attempts);
    return { success: false, locked: true, message: 'PIN ถูกล็อก 15 นาที (Locked for 15 min — too many attempts)' };
  }

  attempts[pinKey] = entry;
  savePinAttempts(attempts);
  var remaining = 5 - entry.count;
  return { success: false, message: 'PIN ไม่ถูกต้อง (Invalid PIN — ' + remaining + ' attempt' + (remaining === 1 ? '' : 's') + ' left)' };
}

/**
 * Privacy-focused Student Fetch.
 * Returns ONLY Name and Class for a specific ID.
 * Prevents full database exposure to PIN users.
 */
function getStudentNameByID(studentId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Students'); // Ensure this matches your actual sheet name
  const data = sheet.getDataRange().getValues();

  // Assuming Col A = ID, Col B = Name, Col C = Class
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(studentId)) {
      return {
        success: true,
        name: data[i][1],
        class: data[i][2]
      };
    }
  }

  return { success: false, message: 'Student ID not found' };
}

// --- RECORDING & VERIFICATION LOGIC ---

/**
 * HRT Verification Action.
 * transitions record from 'Pending' -> 'Approved' or 'Rejected'
 */
function verifyIncident(recordId, action, hrtName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Lateness_Log');
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;

  // Find row by Unique ID (Col A / Index 0)
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(recordId)) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) {
    return { success: false, message: 'Record not found.' };
  }

  // Schema: Status is Col J (Index 9)
  // We log who verified it in ReviewedBy(11) and ReviewedAt(12)
  if (action === 'Approve') {
    sheet.getRange(rowIndex + 1, 10).setValue('Approved'); // Status
    sheet.getRange(rowIndex + 1, 12).setValue(hrtName);    // ReviewedBy
    sheet.getRange(rowIndex + 1, 13).setValue(new Date()); // ReviewedAt

    // Trigger Logic: Deduct Bonus
    // Verified record -> Deducts bonus (PRD Item 73)
    const studentId = data[rowIndex][3];
    const recordDate = data[rowIndex][1];

    try {
      updateBonusEligibility(studentId, recordDate);
    } catch (e) { console.error(e); }

    return { success: true, message: 'Record Verified & Processed.' };

  } else if (action === 'Reject') {
    sheet.getRange(rowIndex + 1, 10).setValue('Rejected');
    sheet.getRange(rowIndex + 1, 12).setValue(hrtName);
    sheet.getRange(rowIndex + 1, 13).setValue(new Date());
    return { success: true, message: 'Record Rejected.' };
  }
}

/**
 * Fetch Unverified records for HRT Dashboard
 * Targets 'Lateness_Log' where Status is 'Pending'
 */
function getUnverifiedRecords(teacherClass) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Lateness_Log');
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const results = [];

  // Schema: ID(0), Date(1), Time(2), StudentID(3), StudentName(4), Class(5), Reason(6), RecordedBy(7), RecordType(8), Status(9)
  for (let i = 1; i < data.length; i++) {
    const rowClass = String(data[i][5]);
    const rowStatus = String(data[i][9]);
    const rowType = String(data[i][8]); // RecordType

    // matchClass logic: If teacherClass is 'ALL', match everything. Otherwise match specific class.
    const matchClass = (teacherClass === 'ALL') ? true : (rowClass === teacherClass);

    // We specifically want 'Real Late' records (or any Pending record that needs verification)
    // The prompt explicitly mentions ensuring we grab 'Real Late'. 
    // We filter for Status='Pending' AND (Class Match).
    if (rowStatus === LATENESS_STATUSES.PENDING && matchClass) {
      results.push({
        id: data[i][0],      // ID for robust verification
        timestamp: data[i][1], // Date
        studentName: data[i][4],
        class: rowClass,     // Added Class for VP view
        type: rowType,       // RecordType
        reason: data[i][6],
        recordedBy: data[i][7]
      });
    }
  }
  return results;
}

function authenticateUser(email, password) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var usersSheet = ss.getSheetByName('Users');
  if (!usersSheet) {
    return { success: false, message: 'Users sheet not found. Please run setupSheets() first.' };
  }
  var data = usersSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var userEmail = String(data[i][5]).trim();
    var userPassword = String(data[i][1]).trim();
    var userStatus = String(data[i][6]).trim();

    if (userEmail === email && userPassword === password && userStatus === 'Active') {
      return {
        success: true,
        roles: data[i][3] // Return roles (could be "Teacher,HRT" or single role)
      };
    }
  }
  return { success: false, message: 'Invalid email or password' };
}


function getUserDetails(email) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var usersSheet = ss.getSheetByName('Users');
  if (!usersSheet) {
    return { success: false, message: 'Users sheet not found. Please run setupSheets() first.' };
  }
  var data = usersSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][5] && data[i][6] &&
      String(data[i][5]).trim() === email &&
      String(data[i][6]).trim() === 'Active') {
      return {
        success: true,
        user: {
          username: data[i][0],
          fullName: data[i][2],
          role: data[i][3],
          assignedClasses: data[i][4],
          email: data[i][5]
        }
      };
    }
  }
  return { success: false, message: 'User not found or inactive. Email: ' + email };
}

// --- REPLACE getCDRRecords IN CODE.GS ---

function getCDRRecords(param1, param2) {
  try {
    var filter = {};
    var isLegacyFormat = false;

    // 1. Determine Input Format
    if (typeof param1 === 'object' && param1 !== null) {
      filter = param1; // New format: { role: 'HRT', classIds: [...], ... }
    } else {
      isLegacyFormat = true;
      filter = {
        context: 'legacy',
        role: param1,
        assignedClasses: param2
      };
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cdrSheet = ss.getSheetByName('CDR_Log');
    if (!cdrSheet) return isLegacyFormat ? [] : { success: true, data: [] };

    // 2. Fetch Data
    var data = cdrSheet.getDataRange().getValues();
    if (data.length <= 1) return isLegacyFormat ? [] : { success: true, data: [] };

    var records = [];
    var scriptTimeZone = Session.getScriptTimeZone();

    // Helper: Parse Class IDs safely
    var targetClassIds = [];
    if (!isLegacyFormat && filter.classIds) {
      if (Array.isArray(filter.classIds)) targetClassIds = filter.classIds;
      else targetClassIds = [String(filter.classIds)];
    } else if (isLegacyFormat && filter.assignedClasses) {
      if (filter.assignedClasses !== 'ALL') {
        targetClassIds = String(filter.assignedClasses).split(',');
      }
    }
    // Normalize target classes (Trim spaces)
    targetClassIds = targetClassIds.map(function (c) { return String(c).trim(); });

    // 3. Iterate Rows
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      // Skip empty rows (Require ID and StudentName)
      if (!row[0] || !row[3]) continue;

      var rowClass = String(row[4] || '').trim();
      var rowRole = filter.role;
      var includeRecord = false;

      // --- FILTER LOGIC ---

      // A. Role-Based Access — delegates to canAccessClass() shared utility
      var includeRecord = canAccessClass(rowRole, filter.assignedClasses || '', rowClass);

      // If Access Denied, skip immediately
      if (!includeRecord) continue;

      // B. Advanced Filters (Only apply if 'includeRecord' is still true)

      // Date Object creation (Safe)
      var recordDate = row[1] ? new Date(row[1]) : new Date();
      var validDate = !isNaN(recordDate.getTime());

      // 1. Academic Year Filter
      if (filter.academicYear && validDate) {
        var recYear = recordDate.getFullYear();
        // logic: matches 2025 in "2025-2026"
        if (String(recYear) !== filter.academicYear.split('-')[0]) {
          continue;
        }
      }

      // 2. Term Filter
      if (filter.term && validDate) {
        var m = recordDate.getMonth() + 1; // 1-12
        // Term 1: May(5)-Oct(10), Term 2: Nov(11)-Apr(4)
        var recTerm = (m >= 5 && m <= 10) ? '1' : '2';
        if (String(filter.term) !== String(recTerm)) {
          continue;
        }
      }

      // 3. Month Filter (YYYY-MM)
      if (filter.month && validDate) {
        var recMonthStr = Utilities.formatDate(recordDate, scriptTimeZone, 'yyyy-MM');
        if (recMonthStr !== filter.month) {
          continue;
        }
      }

      // 4. Offense Type (A=Level 1, B=Level 2)
      if (filter.offenseType) {
        var recLevel = String(row[5] || '');
        var targetLevel = (filter.offenseType === 'A') ? 'Level 1' : 'Level 2';
        if (recLevel !== targetLevel) continue;
      }

      // 5. Status (OPEN/DONE)
      if (filter.status) {
        var recStatus = String(row[9] || 'Active');
        var checkStatus = (recStatus === 'Active') ? 'OPEN' : 'DONE';
        if (filter.status !== checkStatus) continue;
      }

      // --- ADD RECORD ---
      records.push({
        id: String(row[0]),
        date: validDate ? row[1] : null, // Keep original Date object for sorting
        studentId: String(row[2] || ''),
        studentName: String(row[3] || ''),
        class: rowClass,
        level: String(row[5] || ''),
        category: String(row[6] || ''),
        description: String(row[7] || ''),
        recordedBy: String(row[8] || ''),
        status: String(row[9] || 'Active'),
        parentMeetingRequested: (row[10] === true || String(row[10]).toUpperCase() === 'TRUE'),
        parentMeetingApproved: (row[11] === true || String(row[11]).toUpperCase() === 'TRUE'),
        notes: String(row[12] || ''),
        offenseCount: Number(row[13]) || 1,
        punishment: String(row[14] || ''),
        deduction: Number(row[15]) || 0 // Added deduction
      });
    }

    // 4. Sort & Limit (New Format Only)
    if (!isLegacyFormat) {
      // Sort by Date Descending
      records.sort(function (a, b) {
        var dateA = a.date ? new Date(a.date).getTime() : 0;
        var dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });

      // Apply Offset/Limit
      var offset = filter.offset || 0;
      var limit = filter.limit || 50;
      records = records.slice(offset, offset + limit);

      // Convert Date objects to ISO Strings for JSON transport
      records.forEach(function (r) {
        if (r.date instanceof Date) {
          r.date = Utilities.formatDate(r.date, scriptTimeZone, "yyyy-MM-dd'T'HH:mm:ss");
        }
      });

      return { success: true, data: records, total: records.length };
    }

    return records; // Return array for legacy calls

  } catch (error) {
    Logger.log('getCDRRecords Fatal Error: ' + error.toString());
    return isLegacyFormat ? [] : { success: false, message: error.toString(), data: [] };
  }
}



/**
 * Helper: Count Offenses by Level (Cumulative)
 * Counts ALL offenses of a specific Level (1 or 2) for a student within the current Term.
 * Ignores Category distinctions (e.g. Late + No Homework = 2 offenses).
 */
function countLevelOffenses(studentId, level, termConfig) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cdrSheet = ss.getSheetByName('CDR_Log');
  if (!cdrSheet) return 0;

  // Determine Date Range using shared getCurrentTerm utility
  var termWindow = getCurrentTerm(termConfig);
  var startDate = termWindow.startDate;
  var endDate   = termWindow.endDate;

  var data = cdrSheet.getDataRange().getValues();
  var count = 0;

  var sid = String(studentId).trim();
  var lvl = String(level).trim();
  for (var i = 1; i < data.length; i++) {
    var rowDate = parseSafeDate(data[i][1]);
    if (!rowDate) continue;
    var rowStudentId = String(data[i][2]).trim();
    var rowLevel = String(data[i][5]).trim();
    if (rowStudentId === sid && rowLevel === lvl && rowDate >= startDate && rowDate <= endDate) {
      count++;
    }
  }
  return count;
}

/**
 * Helper to determine grade group from class string.
 * Supports:
 * - International: "1A", "6B1", "12A2" -> Extracts leading number.
 * - Thai/Legacy: "M.1/1" (Matthayom 1 = G7), "P.6/1" (Prathom 6 = G6).
 *
 * MAPPING:
 * - Grades 1-5 -> 'G_1_5'
 * - Grades 6-12 -> 'G_6_12' (Includes P.6 and M.1-6)
 */
function getGradeGroup(classStr) {
  var str = String(classStr).trim();

  // 1. Check for Thai Matthayom (M.x) -> M.1 is Grade 7
  // Matches "M.1", "ม.1", "M1"
  var mMatch = str.match(/^[Mmม]\.?\s*(\d+)/i);
  if (mMatch) {
    // M.1 starts at Grade 7, so it's always G_6_12
    return 'G_6_12';
  }

  // 2. Check for Thai Prathom (P.x) -> P.1 is Grade 1
  // Matches "P.1", "ป.1", "P1"
  var pMatch = str.match(/^[Ppป]\.?\s*(\d+)/i);
  if (pMatch) {
    var pLevel = parseInt(pMatch[1], 10);
    // P.1-5 = G_1_5
    // P.6   = G_6_12 (Based on the group name G_6_12)
    return (pLevel >= 1 && pLevel <= 5) ? 'G_1_5' : 'G_6_12';
  }

  // 3. Default / International: Extract leading number
  // "1A" -> 1, "12B2" -> 12
  var digitMatch = str.match(/^(\d+)/);
  if (digitMatch) {
    var gradeNum = parseInt(digitMatch[1], 10);
    if (gradeNum >= 1 && gradeNum <= 5) {
      return 'G_1_5';
    } else {
      return 'G_6_12';
    }
  }

  // Fallback
  return 'G_6_12';
}

function applyCDRRules(record) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cdrSheet = ss.getSheetByName('CDR_Log');

  if (!cdrSheet) {
    return { offenseCount: 1, punishment: 'ไม่สามารถคำนวณบทลงโทษได้ (Missing Sheets)', deduction: 0 };
  }

  // 1. Fetch Term Configuration via shared utility
  var termConfig = getTermConfig();

  // --- ESCALATION LOGIC ---
  // If Incoming Level 1, Check for Auto-Escalation to Level 2
  if (record.level === OFFENSE_LEVELS.LEVEL_1) {
    var l1Count = countLevelOffenses(record.studentId, OFFENSE_LEVELS.LEVEL_1, termConfig);
    if (l1Count >= 8) {
      record.level = OFFENSE_LEVELS.LEVEL_2;
    }
  }
  // ----------------------------------------

  // 2. Determine Grade Group
  var gradeGroup = getGradeGroup(record.class);

  // 4. Count Historical Offenses (Term-Aware Filter)
  // Use Helper Function for consistent counting
  // Note: record.level might have been escalated above.
  var offenseCount = countLevelOffenses(record.studentId, record.level, termConfig);

  var newOffenseCount = offenseCount + 1; // Current offense + history

  // 5. Determine Punishment from Matrix
  var punishment = 'ไม่สามารถกำหนดบทลงโทษได้';
  var deduction = 0;
  var rules = [];
  var requestMeeting = false;

  if (PUNISHMENT_MATRIX[gradeGroup] && PUNISHMENT_MATRIX[gradeGroup][record.level]) {
    rules = PUNISHMENT_MATRIX[gradeGroup][record.level];
  }

  // Iterate rules to find the range that matches newOffenseCount
  for (var j = 0; j < rules.length; j++) {
    if (newOffenseCount >= rules[j].min && newOffenseCount <= rules[j].max) {
      punishment = rules[j].punishment;
      deduction = rules[j].deduction || 0;

      // AUTO-TRIGGER: Check if this step explicitly requires "Parent Meeting"
      // Looking for keyword "Parent Meeting" or "ผู้ปกครอง" in the punishment string
      if (String(punishment).toLowerCase().includes('parent meeting') || String(punishment).includes('ผู้ปกครอง')) {
        requestMeeting = true;
      }
      break;
    }
  }

  // IMMEDIATE ESCALATION: Check for Serious Misbehavior (Type B / Level 2 direct triggers)
  // List of severe categories that might warrant immediate meeting regardless of count
  const severeCategories = [
    'L2_02', // Aggressive behavior
    'L2_04', // Disrupting class / arrogance (if severe)
    'L2_06', // Physical injury
    'L2_07', // Fighting
    'L2_10', // Theft / Lying (Severe)
    'L2_11', // Cheating / Forgery
    'L2_12', // Dangerous weapons
    'L2_17', // Inappropriate PDA
    'L2_18'  // Other Dangerous
  ];

  // If the record's category code matches a severe one AND it's Level 2
  // Note: The record.category passed here might be the full name, not the code.
  // We need to match against the codes defined in OFFENSE_CATEGORIES or the full string.
  // Let's implement a check based on the OFFENSE_CATEGORIES array.

  if (record.level === 'Level 2') {
    // Check if the DESCRIPTION or CATEGORY implies immediate severity
    // Or strictly if it hits Step 4 (which is handled above via punishment string)

    // For immediate escalation based on type, we need to map the incoming category name to the code if possible,
    // or just rely on the step logic if the user's requirement is "Direct entry into Level 2... follows ladder... but reserves right to escalate".
    // Since the 'reserve right' is a human decision, the automated system should primarily rely on the Step logic (Step 4).
    // However, if we want to force it for specific types:

    const categoryName = String(record.category || '').toLowerCase();
    if (categoryName.includes('fighting') || categoryName.includes('ต่อสู้') ||
      categoryName.includes('aggression') || categoryName.includes('ก้าวร้าว') ||
      categoryName.includes('stealing') || categoryName.includes('ขโมย') ||
      categoryName.includes('cheating') || categoryName.includes('ทุจริต') ||
      categoryName.includes('weapon') || categoryName.includes('อาวุธ')) {
      // Optional: Force immediate meeting? 
      // For now, let's stick to the rule: "Recurrent Level 1 -> Level 2 ... meeting mandatory at Step 4".
      // The user said "Direct entry into Level 2 occurs for serious offenses... Level 2 generally follows a four-step punishment ladder".
      // This implies even serious offenses start at Step 1 of Level 2, UNLESS manually escalated.
      // So, sticking to the `requestMeeting` flag from the Step 4 check above is the safest automated approach.
      // BUT, if the user explicitly requested "Immediate Escalation", we can set it here.
      // Let's keep it tied to the matrix for consistency unless the admin manually flags it (which they can't in Kiosk mode).
    }
  }

  return {
    offenseCount: newOffenseCount,
    punishment: punishment,
    deduction: deduction,
    requestMeeting: requestMeeting
  };
}

/**
 * Updates or creates the student's behaviour score for the current term.
 * Calculates: BaseScore (100) - Sum(Deductions for this term)
 * @param {string} studentId - The student's ID
 * @param {string} studentName - The student's name
 * @param {string} studentClass - The student's class
 */
function updateBehaviourScore(studentId, studentName, studentClass) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cdrSheet = ss.getSheetByName('CDR_Log');
    var configSheet = ss.getSheetByName('Config');
    var scoreSheet = ss.getSheetByName('Behaviour_Scores');

    if (!cdrSheet || !configSheet || !scoreSheet) {
      Logger.log('updateBehaviourScore: Missing required sheets');
      return;
    }

    // 1. Get Config for Term Detection
    var configData = configSheet.getDataRange().getValues();
    var termConfig = {};
    for (var k = 1; k < configData.length; k++) {
      termConfig[configData[k][0]] = configData[k][1];
    }
    var academicYear = termConfig['AcademicYear'] || String(new Date().getFullYear());

    // 2. Determine Current Term
    function parseConfigDate(value) {
      if (!value) return null;
      if (value instanceof Date) return value;
      return new Date(value + '-01');
    }

    var s1Start = parseConfigDate(termConfig['Semester1Start']);
    var s1End = parseConfigDate(termConfig['Semester1End']);
    if (s1End) { s1End = new Date(s1End.getFullYear(), s1End.getMonth() + 1, 0); }

    var s2Start = parseConfigDate(termConfig['Semester2Start']);
    var s2End = parseConfigDate(termConfig['Semester2End']);
    if (s2End) { s2End = new Date(s2End.getFullYear(), s2End.getMonth() + 1, 0); }

    var now = new Date();
    var currentTerm = '1'; // Default to Term 1
    var startDate, endDate;

    if (s1Start && s1End && now >= s1Start && now <= s1End) {
      currentTerm = '1';
      startDate = s1Start;
      endDate = s1End;
    } else if (s2Start && s2End && now >= s2Start && now <= s2End) {
      currentTerm = '2';
      startDate = s2Start;
      endDate = s2End;
    } else {
      // Fallback: Use current calendar year
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    }

    // 3. Calculate Total Deductions for this Student in this Term
    var cdrData = cdrSheet.getDataRange().getValues();
    var totalDeduction = 0;

    // CDR_Log columns: ID(0), Date(1), StudentID(2), ..., Deduction(15)
    for (var i = 1; i < cdrData.length; i++) {
      var rowStudentId = String(cdrData[i][2]).trim();
      var rowDate = new Date(cdrData[i][1]);
      var rowDeduction = Number(cdrData[i][15]) || 0;

      if (rowStudentId === String(studentId).trim()) {
        // Check if within term date range
        if (rowDate >= startDate && rowDate <= endDate) {
          totalDeduction += rowDeduction;
        }
      }
    }

    // 4. Calculate Final Score (Base 100 - Deductions, min 0)
    var baseScore = 100;
    var finalScore = Math.max(0, baseScore - totalDeduction);

    // 5. Upsert into Behaviour_Scores
    // Search for existing row with same StudentID + Term + AcademicYear
    var scoreData = scoreSheet.getDataRange().getValues();
    var existingRowIndex = -1;

    for (var j = 1; j < scoreData.length; j++) {
      var existingStudentId = String(scoreData[j][0]).trim();
      var existingTerm = String(scoreData[j][3]).trim();
      var existingYear = String(scoreData[j][4]).trim();

      if (existingStudentId === String(studentId).trim() &&
        existingTerm === currentTerm &&
        existingYear === academicYear) {
        existingRowIndex = j + 1; // 1-based for Sheets API
        break;
      }
    }

    var rowData = [studentId, studentName || '', studentClass || '', currentTerm, academicYear, finalScore, new Date()];

    if (existingRowIndex > 0) {
      // Update existing row
      scoreSheet.getRange(existingRowIndex, 1, 1, 7).setValues([rowData]);
    } else {
      // Append new row
      scoreSheet.appendRow(rowData);
    }

    Logger.log('updateBehaviourScore: Updated score for ' + studentId + ' to ' + finalScore);

  } catch (e) {
    Logger.log('updateBehaviourScore Error: ' + e.toString());
  }
}

function saveCDRRecord(record) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cdrSheet = ss.getSheetByName('CDR_Log');
  if (!cdrSheet) {
    return { success: false, message: 'CDR_Log sheet not found' };
  }

  // Apply CDR Rules Engine
  var rules = applyCDRRules(record);
  var id = 'CDR' + new Date().getTime();

  cdrSheet.appendRow([
    id,
    new Date(),
    record.studentId,
    record.studentName,
    record.class,
    record.level,
    record.category,
    record.description,
    record.recordedBy,
    'Active',
    (record.parentMeetingRequested === true || String(record.parentMeetingRequested).toUpperCase() === 'TRUE' || rules.requestMeeting === true), // Force Boolean & Include Rule Trigger
    false,
    record.notes || '',
    rules.offenseCount,
    rules.punishment,
    rules.deduction // Added deduction
  ]);

  // --- NEW: Trigger Email for Level 2 Offenses ---
  if (record.level === 'Level 2') {
    var subject = "URGENT: Level 2 Offense - " + record.studentName;
    var body = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #dc2626;">🚨 Level 2 Offense Reported</h2>
        <p><strong>Student:</strong> ${record.studentName} (${record.studentId})</p>
        <p><strong>Class:</strong> ${record.class}</p>
        <p><strong>Category:</strong> ${record.category}</p>
        <hr>
        <p><strong>Description:</strong><br>${record.description}</p>
        <p><strong>Calculated Punishment:</strong><br>${rules.punishment}</p>
        <p><strong>Recorded By:</strong> ${record.recordedBy}</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">Please login to Smart CDR to manage this case.</p>
      </div>
    `;
    // Send to DisciplineDept. We pass 'ALL' implicitly via null class filter or specific logic inside helper
    sendSystemEmail('DisciplineDept', subject, body, null);
  }
  // -----------------------------------------------

  // --- Update Behaviour Score Cache ---
  try {
    updateBehaviourScore(record.studentId, record.studentName, record.class);
  } catch (e) { Logger.log('Score update failed: ' + e); }

  return { success: true, message: 'CDR record saved successfully', id: id, punishment: rules.punishment, offenseCount: rules.offenseCount, deduction: rules.deduction };
}

function updateCDRRecord(id, updates) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cdrSheet = ss.getSheetByName('CDR_Log');
  if (!cdrSheet) {
    return { success: false, message: 'CDR_Log sheet not found' };
  }
  var data = cdrSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      if (updates.status) cdrSheet.getRange(i + 1, 10).setValue(updates.status);
      if (updates.parentMeetingApproved !== undefined) {
        var boolVal = (updates.parentMeetingApproved === true || String(updates.parentMeetingApproved).toUpperCase() === 'TRUE');
        cdrSheet.getRange(i + 1, 12).setValue(boolVal);
      }
      if (updates.notes) cdrSheet.getRange(i + 1, 13).setValue(updates.notes);

      return { success: true, message: 'CDR record updated successfully' };
    }
  }
  return { success: false, message: 'Record not found' };
}


function deleteCDRRecord(id) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cdrSheet = ss.getSheetByName('CDR_Log');
  if (!cdrSheet) {
    return { success: false, message: 'CDR_Log sheet not found' };
  }
  var data = cdrSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      // Capture student info before deleting
      var studentId = String(data[i][2]);
      var studentName = String(data[i][3]);
      var studentClass = String(data[i][4]);

      cdrSheet.deleteRow(i + 1);

      // Recalculate score after deletion
      try {
        updateBehaviourScore(studentId, studentName, studentClass);
      } catch (e) { Logger.log('Score recalc failed: ' + e); }

      return { success: true, message: 'CDR record deleted successfully' };
    }
  }
  return { success: false, message: 'Record not found' };
}


// --- LATENESS LOGIC (Aligned with Report) ---
function getMonthlyLatenessCount(studentId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Lateness_Log');
  if (!sheet) return 0;

  var data = sheet.getDataRange().getValues();
  var count = 0;
  var now = new Date();
  var currentMonth = now.getMonth();
  var currentYear = now.getFullYear();

  // Schema: ID(0), Date(1), Time(2), StudentID(3)... RecordType(8)
  for (var i = 1; i < data.length; i++) {
    var rowDate = new Date(data[i][1]);
    var rowId = String(data[i][3]).trim();
    var rowType = String(data[i][8]); // 'Activity Late' or 'Real Late'

    // Match Student, Month, Year, and Type='Activity Late'
    if (rowId === String(studentId).trim() &&
      rowDate.getMonth() === currentMonth &&
      rowDate.getFullYear() === currentYear &&
      rowType === 'Activity Late') {
      count++;
    }
  }
  return count;
}

// --- LATENESS LOGIC (Aligned with Report) ---
// Normalized to handle: 'Activity Late', '7:40' (legacy string), Date objects (Sheets auto-format)
function getMonthlyActivityLateCount(studentId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Lateness_Log');
  if (!sheet) return 0;

  var data = sheet.getDataRange().getValues();
  var count = 0;
  var now = new Date();
  var currentMonth = now.getMonth();
  var currentYear = now.getFullYear();
  var scriptTimeZone = Session.getScriptTimeZone();

  // Schema: ID(0), Date(1), Time(2), StudentID(3)... RecordType(8)
  for (var i = 1; i < data.length; i++) {
    var rowDate = new Date(data[i][1]);
    var rowId = String(data[i][3]).trim();

    // --- NORMALIZE RecordType ---
    var rawType = data[i][8];
    var cleanType;

    if (rawType instanceof Date) {
      // Google Sheets auto-formatted "7:40" into a Date object (e.g., 1899-12-30T07:40:00)
      cleanType = Utilities.formatDate(rawType, scriptTimeZone, 'H:mm'); // Output: "7:40"
    } else {
      cleanType = String(rawType).trim();
    }

    // Normalize leading zeros (07:40 -> 7:40)
    if (cleanType === '07:40') cleanType = '7:40';
    if (cleanType === '08:00') cleanType = '8:00';

    // Activity Late Detection (matches 'Activity Late' or legacy '7:40')
    var isActivityLate = (cleanType === 'Activity Late' || cleanType === '7:40');

    // Match Student, Month, Year, and Type='Activity Late'
    if (rowId === String(studentId).trim() &&
      rowDate.getMonth() === currentMonth &&
      rowDate.getFullYear() === currentYear &&
      isActivityLate) {
      count++;
    }
  }
  return count;
}

function saveLatenessRecord(record) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var latenessSheet = ss.getSheetByName('Lateness_Log');
    if (!latenessSheet) {
      return { success: false, message: 'Lateness_Log sheet not found' };
    }

    // === ADD THIS DUPLICATE CHECK ===
    var dateStr = record.date || new Date().toISOString().split('T')[0];
    var studentId = String(record.studentId).trim();

    // Check for duplicate records
    if (hasExistingLatenessRecord(studentId, dateStr)) {
      return {
        success: false,
        duplicate: true,
        message: 'นักเรียนคนนี้มีข้อมูลการมาสายในวันนี้อยู่แล้ว'
      };
    }
    // === END DUPLICATE CHECK ===

    var id = 'LATE' + new Date().getTime();
    // Fix: Interpret record.date (YYYY-MM-DD) as LOCAL time
    var recordDate;
    if (record.date) {
      var parts = record.date.split('-');
      recordDate = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      var now = new Date();
      recordDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    // Logic separation: Real Late vs Activity Late
    var isRealLate = (record.recordType === 'Real Late' || record.recordType === '8:00');
    var isActivityLate = (record.recordType === 'Activity Late' || record.recordType === '7:40');
    // --- CALCULATE STRIKE COUNT (Activity Late Only) ---
    var strikeCount = 0;
    if (isActivityLate && record.studentId) {
      // Get existing count for this month + 1
      strikeCount = getMonthlyActivityLateCount(record.studentId) + 1;
    } else if (isRealLate) {
      strikeCount = 1; // Real late doesn't use the monthly 1-2-3 ladder in the same way
    }
    // 1. Save to Lateness_Log Sheet
    latenessSheet.appendRow([
      id,                                         // ID
      Utilities.formatDate(recordDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
      record.time || '',                          // Time
      record.studentId || '',                     // StudentID
      record.studentName || '',                   // StudentName
      record.class || '',                         // Class
      record.reason || '',                        // Reason
      record.recordedBy || '',                    // RecordedBy
      record.recordType || '',                    // RecordType
      record.status || LATENESS_STATUSES.PENDING,  // Status
      strikeCount,                                // StrikeCount
      '', '', '', '', '', '', ''                  // Placeholders for review columns
    ]);
    // 2. Integration: Bonus Update
    if (record.studentId) {
      try { updateBonusEligibility(record.studentId, recordDate); } catch (e) { console.error(e); }
    }
    // 3. --- STRICT THAI MESSAGING RULES ---
    var actionMessage = '';
    if (isActivityLate) {
      if (strikeCount === 1) {
        actionMessage = 'Strike 1: นักเรียนได้รับการตักเตือนและแจ้งผู้ปกครอง';
      } else if (strikeCount === 2) {
        actionMessage = 'Strike 2: งดเบรค (Lunch Detention) + แจ้งเตือนผู้ปกครองเรื่องนัดพบ';
      } else if (strikeCount >= 3) {
        actionMessage = 'Strike 3: เชิญผู้ปกครอง + นัดหมาย (3 ครั้ง/เดือน)';
      }
    } else if (isRealLate) {
      // Optional: Add specific message for Real Late if needed
      actionMessage = 'Real Late: หัก 10 คะแนน + วิ่ง (ตามกฎ)';
    }
    return { success: true, message: 'บันทึกสำเร็จ', id: id, action: actionMessage };
  } catch (error) {
    Logger.log('saveLatenessRecord error: ' + error.toString());
    return { success: false, message: 'Failed to save: ' + error.toString() };
  }
}

function getPendingLatenessForHRT(filter) {
  try {
    // 1. Force return validation
    var result = filterLatenessRecords(filter, true);

    // 2. If result is somehow null/undefined, force an error object
    if (!result) {
      return {
        success: false,
        message: 'Server Error: filterLatenessRecords returned nothing.',
        data: []
      };
    }

    return result;

  } catch (e) {
    Logger.log('Error in getPendingLatenessForHRT: ' + e.toString());
    return {
      success: false,
      message: 'Server Error: ' + e.toString(),
      data: []
    };
  }
}

// --- REPLACE IN CODE.GS ---

function filterLatenessRecords(filter, includeDebug) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var latenessSheet = ss.getSheetByName('Lateness_Log');

    if (!latenessSheet) {
      return {
        success: true,
        data: [],
        count: 0,
        diag: includeDebug ? { error: 'Sheet not found' } : undefined
      };
    }

    // Safe Filter Handling
    var safeFilter = filter || {};
    var classIds = [];
    if (safeFilter.classIds) {
      if (Array.isArray(safeFilter.classIds)) classIds = safeFilter.classIds;
      else classIds = [String(safeFilter.classIds)];
    }

    var targetStatus = safeFilter.status || LATENESS_STATUSES.PENDING;
    var data = latenessSheet.getDataRange().getValues();
    var records = [];
    var scriptTimeZone = Session.getScriptTimeZone();

    // Helper to safely format Date objects to strings
    function safeDateStr(d, format) {
      if (!d) return "";
      if (d instanceof Date && !isNaN(d.getTime())) {
        return Utilities.formatDate(d, scriptTimeZone, format);
      }
      return String(d); // Return as string if it's already text
    }

    var filterDateStr = safeFilter.date ? safeDateStr(new Date(safeFilter.date), 'yyyy-MM-dd') : null;

    // Loop data (skip header)
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;

      var rowClass = String(row[5] || '').trim();
      var rowStatus = String(row[9] || LATENESS_STATUSES.PENDING).trim();
      var rowDate = row[1];

      // Filters
      if (rowStatus !== targetStatus) continue;
      if (classIds.length > 0 && classIds.indexOf(rowClass) === -1) continue;
      if (filterDateStr) {
        var rowDateStr = safeDateStr(rowDate, 'yyyy-MM-dd');
        if (rowDateStr !== filterDateStr) continue;
      }

      // --- CRITICAL FIX: Format Time and Type correctly ---
      // If row[2] (Time) is a Date object, extract HH:mm
      var rawTime = row[2];
      var cleanTime = (rawTime instanceof Date) ? Utilities.formatDate(rawTime, scriptTimeZone, 'HH:mm') : String(rawTime);

      // If row[8] (Type) is a Date object (common in Sheets), extract HH:mm, otherwise assume "8:00" text
      var rawType = row[8];
      var cleanType = (rawType instanceof Date) ? Utilities.formatDate(rawType, scriptTimeZone, 'HH:mm') : String(rawType);

      // Normalize type for logic checks (handle 08:00 vs 8:00)
      if (cleanType === '08:00') cleanType = '8:00';
      if (cleanType === '07:40') cleanType = '7:40';

      records.push({
        id: String(row[0]),
        date: safeDateStr(rowDate, 'yyyy-MM-dd'),
        time: cleanTime,
        studentId: String(row[3] || ''),
        studentName: String(row[4] || ''),
        class: rowClass,
        reason: String(row[6] || ''),
        recordedBy: String(row[7] || ''),
        recordType: cleanType,
        status: rowStatus,
        strikeCount: Number(row[10] || 0)
      });
    }

    return {
      success: true,
      data: records,
      count: records.length,
      diag: includeDebug ? { recordsFound: records.length } : undefined
    };

  } catch (error) {
    Logger.log('filterLatenessRecords Error: ' + error.toString());
    return {
      success: false,
      message: 'Filter Error: ' + error.toString(),
      data: []
    };
  }
}


function getLatenessSummaryForHRT(filter) {
  try {
    var result = filterLatenessRecords(filter, true); // Include debug info

    if (result.success) {
      return {
        success: true,
        todayPendingCount: result.count,
        diag: result.diag
      };
    } else {
      return result;
    }

  } catch (error) {
    Logger.log('getLatenessSummaryForHRT error: ' + error.toString());
    return {
      success: false,
      message: 'Failed to get lateness summary: ' + error.toString()
    };
  }
}


// Legacy function for backward compatibility
function getPendingLateness(classIds) {
  var filter = {
    classIds: classIds,
    status: LATENESS_STATUSES.PENDING
  };
  return filterLatenessRecords(filter, false);
}


function approveLateness(id, isAcceptable) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var latenessSheet = ss.getSheetByName('Lateness_Log');

    if (!latenessSheet) {
      return { success: false, message: 'Lateness_Log sheet not found' };
    }

    var data = latenessSheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(id).trim()) {
        // Update status and review information
        var newStatus = isAcceptable ? LATENESS_STATUSES.APPROVED : LATENESS_STATUSES.REJECTED;
        var reviewedBy = Session.getActiveUser().getEmail() || 'HRT';
        var reviewedAt = new Date();

        // Expected columns: ID, Date, Time, StudentID, StudentName, Class, Reason, RecordedBy, RecordType, Status, StrikeCount, ReviewedBy, ReviewedAt, Action, Notes, ActedBy, ActedAt, CDR_ID
        latenessSheet.getRange(i + 1, 10).setValue(newStatus); // Status
        latenessSheet.getRange(i + 1, 12).setValue(reviewedBy); // ReviewedBy
        latenessSheet.getRange(i + 1, 13).setValue(reviewedAt); // ReviewedAt

        return { success: true, message: 'Lateness status updated successfully' };
      }
    }

    return { success: false, message: 'Record not found' };

  } catch (error) {
    Logger.log('approveLateness error: ' + error.toString());
    return { success: false, message: 'Failed to approve lateness: ' + error.toString() };
  }
}


// --- REPLACE IN CODE.GS ---

function createCDRFromLateness(latenessId, studentId, studentName, studentClass, createdBy) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cdrSheet = ss.getSheetByName('CDR_Log');
    var latenessSheet = ss.getSheetByName('Lateness_Log');

    if (!cdrSheet || !latenessSheet) {
      return { success: false, message: 'Required sheets not found' };
    }

    // 1. Fetch Term Configuration (Needed for Counting)
    var termConfig = getTermConfig();

    // 2. Check Level 1 Offense Count (Existing)
    var l1Count = countLevelOffenses(studentId, OFFENSE_LEVELS.LEVEL_1, termConfig);

    // 3. Determine Level and Punishment Strategy
    var targetLevel = 'Level 1';
    var punishment = '';
    var deduction = 0;
    var finalOffenseCount = 0;
    var meetingReq = false;

    // RULE: If 8 or more Level 1 offenses already exist, the 9th+ becomes Level 2
    if (l1Count >= 8) {
      targetLevel = 'Level 2';

      // Use Standard Matrix Logic for Level 2
      // We create a mock record to pass to the rules engine
      var mockRecord = {
        studentId: studentId,
        studentName: studentName,
        class: studentClass,
        level: 'Level 2', // Force Level 2
        date: new Date(),
        category: 'มาสายโดยไม่มีเหตุผลอันควร (Real Late - Escalated)',
        description: 'Auto-escalated from Lateness (9th+ Offense)'
      };

      var rules = applyCDRRules(mockRecord);

      punishment = rules.punishment;
      deduction = rules.deduction;
      finalOffenseCount = rules.offenseCount;
      meetingReq = rules.requestMeeting;

    } else {
      // Still Level 1 (Counts 1-8) -> Apply Gender-Based Exception
      targetLevel = 'Level 1';

      var gender = getStudentGender(studentId);

      if (gender === 'Female') {
        punishment = 'วิ่ง 7 รอบ (มาสายหลัง 8:00 น.) + หัก 5 คะแนน';
        deduction = 5;
      } else {
        punishment = 'วิ่ง 15 รอบ (มาสายหลัง 8:00 น.) + หัก 5 คะแนน';
        deduction = 5;
      }

      // Offense count is simply previous + 1 (Manual calc since we bypass matrix for text)
      finalOffenseCount = l1Count + 1;
    }

    // 4. Create CDR Record
    var cdrId = 'CDR' + new Date().getTime();

    cdrSheet.appendRow([
      cdrId,
      new Date(),
      studentId,
      studentName,
      studentClass,
      targetLevel,
      'มาสายโดยไม่มีเหตุผลอันควร (Real Late)',
      'มาสายหลัง 8:00 น. (สร้างจากการปฏิเสธเหตุผล ID: ' + latenessId + ')',
      createdBy || 'HRT',
      'Active',
      meetingReq, // Use the flag calculated from Matrix (if Level 2) or default false (Level 1)
      false,
      'System: ' + targetLevel + ' Logic Applied. (Prev L1 Count: ' + l1Count + ')',
      finalOffenseCount,
      punishment,
      deduction
    ]);

    // 5. Update Lateness Log Status
    var latenessData = latenessSheet.getDataRange().getValues();
    for (var i = 1; i < latenessData.length; i++) {
      if (String(latenessData[i][0]).trim() === String(latenessId).trim()) {
        latenessSheet.getRange(i + 1, 10).setValue(LATENESS_STATUSES.CONVERTED);
        latenessSheet.getRange(i + 1, 12).setValue(createdBy || 'HRT');
        latenessSheet.getRange(i + 1, 13).setValue(new Date());
        latenessSheet.getRange(i + 1, 18).setValue(cdrId);
        break;
      }
    }

    // 6. Trigger Immediate Bonus Disqualification AND Level 2 Email
    try {
      updateBonusEligibility(studentId, new Date());
      updateBehaviourScore(studentId, studentName, studentClass);

      // If escalated to Level 2, we should probably trigger the email too using the helper
      if (targetLevel === 'Level 2') {
        var subject = "URGENT: Level 2 Offense (Lateness Escalation) - " + studentName;
        var body = `
           <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
             <h2 style="color: #dc2626;">🚨 Level 2 Offense (Escalated)</h2>
             <p><strong>Student:</strong> ${studentName} (${studentId})</p>
             <p><strong>Class:</strong> ${studentClass}</p>
             <p><strong>Reason:</strong> Excessive Lateness (9th+ Offense)</p>
             <hr>
             <p><strong>Punishment:</strong> ${punishment}</p>
             <p><strong>Recorded By:</strong> System (via ${createdBy || 'HRT'})</p>
           </div>
         `;
        sendSystemEmail('DisciplineDept', subject, body, null);
      }

    } catch (e) {
      Logger.log('Post-process updates failed: ' + e.toString());
    }

    return {
      success: true,
      message: 'CDR created successfully. ' + targetLevel + ' applied.',
      cdrId: cdrId,
      punishment: punishment,
      deduction: deduction,
      level: targetLevel
    };

  } catch (error) {
    Logger.log('createCDRFromLateness error: ' + error.toString());
    return { success: false, message: 'Failed to create CDR: ' + error.toString() };
  }
}

function logHrtAction(latenessId, action, notes, actedBy) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var latenessSheet = ss.getSheetByName('Lateness_Log');
    var cdrSheet = ss.getSheetByName('CDR_Log');

    if (!latenessSheet) return { success: false, message: 'Lateness_Log sheet not found' };

    var data = latenessSheet.getDataRange().getValues();
    var recordFound = false;
    var studentInfo = null;
    var rowIndex = -1;

    // Find the record
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(latenessId).trim()) {
        recordFound = true;
        rowIndex = i;
        studentInfo = {
          studentId: String(data[i][3] || ''),
          studentName: String(data[i][4] || ''),
          class: String(data[i][5] || ''),
          strikeCount: Number(data[i][10] || 0)
        };
        break;
      }
    }

    if (!recordFound) return { success: false, message: 'Record not found' };

    // Fallback recalculation if strike count missing
    if (studentInfo.strikeCount === 0) {
      studentInfo.strikeCount = getMonthlyActivityLateCount(studentInfo.studentId);
    }

    var monthlyStrikeCount = studentInfo.strikeCount;
    var responseMessage = '';
    var autoCreatedCDR = false;
    var cdrId = '';

    // --- STRICT RULES ENGINE ---
    if (monthlyStrikeCount === 1) {
      responseMessage = 'Strike 1: นักเรียนได้รับการตักเตือนและแจ้งผู้ปกครอง';
    }
    else if (monthlyStrikeCount === 2) {
      responseMessage = 'Strike 2: งดเบรค (Lunch Detention) + แจ้งเตือนผู้ปกครองเรื่องนัดพบ';
    }
    else if (monthlyStrikeCount >= 3) {
      // --- STRIKE 3: AUTO-GENERATE MEETING REQUEST ---
      responseMessage = 'Strike 3: เชิญผู้ปกครอง + นัดหมาย (3 ครั้ง/เดือน)';

      if (cdrSheet) {
        cdrId = 'CDR_AUTO_' + new Date().getTime();

        // Auto-insert into CDR_Log
        cdrSheet.appendRow([
          cdrId,                                // ID
          new Date(),                           // Date
          studentInfo.studentId,                // StudentID
          studentInfo.studentName,              // Name
          studentInfo.class,                    // Class
          'N/A',                                // Level (N/A for meeting tracking)
          'มาสายกิจกรรม (Activity Late)',       // Category
          'มาสายกิจกรรมยามเช้าครบ 3 ครั้ง (Strike 3)', // Description
          actedBy || 'System',                  // RecordedBy
          'Active',                             // Status
          true,                                 // ParentMeetingRequested (TRUE)
          false,                                // ParentMeetingApproved
          'System Auto-Generated from Lateness Log ID: ' + latenessId, // Notes
          monthlyStrikeCount,                   // OffenseCount
          'เชิญผู้ปกครอง + นัดหมาย',            // Punishment
          0                                     // Deduction
        ]);

        autoCreatedCDR = true;

        // Optional: Send Email Trigger here if needed
      }
    }

    // Update Lateness Log
    latenessSheet.getRange(rowIndex + 1, 10).setValue(LATENESS_STATUSES.PROCESSED); // Status
    latenessSheet.getRange(rowIndex + 1, 11).setValue(monthlyStrikeCount); // StrikeCount
    latenessSheet.getRange(rowIndex + 1, 14).setValue(action); // Action taken
    latenessSheet.getRange(rowIndex + 1, 15).setValue(notes + ' | ' + responseMessage); // Notes
    latenessSheet.getRange(rowIndex + 1, 16).setValue(actedBy || 'HRT'); // ActedBy
    latenessSheet.getRange(rowIndex + 1, 17).setValue(new Date()); // ActedAt

    if (autoCreatedCDR) {
      latenessSheet.getRange(rowIndex + 1, 18).setValue(cdrId); // Link CDR ID
    }

    return { success: true, message: responseMessage };

  } catch (error) {
    Logger.log('logHrtAction error: ' + error.toString());
    return { success: false, message: 'Failed to log action: ' + error.toString() };
  }
}


function getMisbehaviorList() {
  var BEHAVIOR_TYPES = {
    "G_1_5": {
      "Level 1": ['ฝ่าฝืนกฎของห้องเรียน', 'แต่งกายผิดระเบียบ', 'ออกจากห้องช้าและเข้าห้องช้า', 'ไม่ปฏิบัติตามคำสั่งครู', 'กิน-ดื่มระหว่างเรียน', 'ไม่ส่งงานและการบ้าน', 'แสดงท่าทางหยาบคาย', 'รบกวนขณะที่เพื่อนเล่น', 'เรียกชื่อหรือตั้งฉายา', 'ปล่อยข่าวลือ', 'เตะหรือขว้างปาสิ่งของ', 'ทิ้งขยะเรี่ยราด', 'มีพฤติกรรมที่เป็นอันตราย', 'ใช้ภาษาที่รับไม่ได้', 'ทำเสียงรบกวนหรือตะโกน', 'มาสายหลัง 8 นาฬิกา'],
      "Level 2": ['ฝ่าฝืนกฎระเบียบและนโยบายของโรงเรียน', 'มีพฤติกรรมก้าวร้าวต่อครู', 'มีพฤติกรรมไม่ให้เกียติครูอย่างร้ายแรง', 'ตั้งใจทำลายการเรียนการสอน', 'มีพฤติกรรมไม่เชื่อฟัง ท้าทาย', 'ทำร้ายหรือทำอันตรายให้ผู้อื่นบาดเจ็บ', 'ทะเลาะ ต่อสู้กันบ่อยครั้ง', 'เขียนข้อความหรือวาดภาพตามสถานที่', 'เกเร รังแกและข่มขู่เพื่อน', 'โกหก หลอกลวง ลักขโมย', 'ทุจริตการสอบ ปลอมแปลงเอกสาร', 'พกพาวัตถุอันตรายหรืออาวุธ', 'มีพฤติกรรมเล่นเกมหรือติด social media', 'พกพาโทรศัพท์มือถือ', 'นำยานพาหนะมาโรงเรียนโดยไม่ได้รับอนุญาต', 'มีพฤติกรรมไม่เหมาะสมกับเพศตรงข้าม']
    },
    "G_6_12": {
      "Level 1": ['แสดงอาการโกรธ ไม่ปฏิบัติตามคำสั่ง', 'จงใจฝ่าฝืนกฎระเบียบ', 'ทะเลาะวิวาท (ไม่บาดเจ็บ)', 'ใช้ภาษาหรือคำพูดที่ไม่สุภาพ', 'พูดมากหรือพูดเรื่อยเปื่อย', 'ทำตลกให้เพื่อนหัวเราะขณะครูสอน', 'รบกวนการสอนของครู', 'ไม่ทำงานและการบ้าน', 'ลุกจากที่หลังจากได้รับคำเตือน', 'ออกหรือเข้าห้องโดยไม่ขออนุญาต', 'ทิ้งขยะเรี่ยราด', 'กินหรือดื่มในห้องเรียน', 'ปล่อยข่าวลือ', 'ข่มขู่เพื่อนด้วยคำพูด', 'เรียกหรือตั้งชื่อเพื่อนไม่เหมาะสม', 'ใช้เครื่องสำอางหรือน้ำหอม', 'ใช้เครื่องมือโรงเรียนผิดเป้าหมาย', 'มีพฤติกรรมที่เป็นอันตราย', 'มาสายหลัง 8 นาฬิกา'],
      "Level 2": ['ฝ่าฝืนกฎระเบียบ (ทิ้งละหมาด, หนีเรียน)', 'มีพฤติกรรมก้าวร้าวต่อครู', 'มีพฤติกรรมไม่ให้เกียติครูอย่างร้ายแรง', 'ตั้งใจทำลายการเรียนการสอน', 'มีพฤติกรรมไม่เชื่อฟัง ท้าทาย', 'เกเร รังแกและข่มขู่เพื่อน', 'ทะเลาะวิวาท ทำร้ายผู้อื่นบาดเจ็บ', 'ทำลายทรัพย์สินของโรงเรียน', 'ทุจริตการสอบ ปลอมแปลงเอกสาร', 'โกหก หลอกลวง ลักขโมย', 'พกพาวัตถุอันตรายหรืออาวุธ', 'ติดเกมส์/Social media สร้างความเสื่อมเสีย', 'พกพาโทรศัพท์มือถือ/เครื่องเล่นเกม', 'ครอบครองสื่อต้องห้าม', 'มีพฤติกรรมไม่เหมาะสมกับเพศตรงข้าม', 'นำยานพาหนะมาโรงเรียนโดยไม่ได้รับอนุญาต']
    }
  };
  return BEHAVIOR_TYPES;
}


function getLatenessRecords(userRole, assignedClasses, optionalDateStr) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var latenessSheet = ss.getSheetByName('Lateness_Log');
  if (!latenessSheet) {
    return [];
  }
  var data = latenessSheet.getDataRange().getValues();
  var records = [];

  // Normalize assignedClasses to array of strings
  var targetClasses = [];
  if (assignedClasses && String(assignedClasses).toUpperCase() !== 'ALL') {
    targetClasses = String(assignedClasses).split(',').map(function (c) { return c.trim(); });
  }

  // Determine Filtering Date (Client > Server)
  var filterDateStr = optionalDateStr;
  if (!filterDateStr) {
    var today = new Date();
    filterDateStr = Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  for (var i = 1; i < data.length; i++) {
    var rowClass = String(data[i][5] || '').trim();
    // Parse Date for comparison
    var rowDate = data[i][1] ? new Date(data[i][1]) : null;
    var rowDateStr = rowDate ? Utilities.formatDate(rowDate, Session.getScriptTimeZone(), 'yyyy-MM-dd') : '';

    var record = {
      id: data[i][0],
      date: data[i][1],
      time: data[i][2],
      studentId: data[i][3],
      studentName: data[i][4],
      class: rowClass,
      reason: data[i][6],
      recordedBy: data[i][7],
      recordType: data[i][8],
      status: data[i][9], // Added Status
      strikeCount: data[i][10] // Added StrikeCount
    };

    var include = false;

    // Filter Logic:
    // 1. Must be TODAY (or specific date passed)
    if (rowDateStr !== filterDateStr) continue;

    // 2. Role/Class Check
    if (['Superadmin', 'VP', 'DisciplineDept'].indexOf(userRole) !== -1) {
      include = true;
    } else if (String(assignedClasses).toUpperCase() === 'ALL') {
      include = true;
    } else {
      // Check if rowClass is in targetClasses
      if (targetClasses.indexOf(rowClass) !== -1) {
        include = true;
      }
    }

    if (include) {
      records.push(record);
    }
  }

  return records;
}

// --- REPLACE getDashboardStats IN CODE.GS ---

function getDashboardStats(userRole, assignedClasses, username) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cdrSheet = ss.getSheetByName('CDR_Log');
  var latenessSheet = ss.getSheetByName('Lateness_Log');
  var bonusSheet = ss.getSheetByName('Bonus_Eligibility');

  var stats = {
    totalCDR: 0,
    level1: 0,
    level2: 0,
    totalLateness: 0,
    pendingMeetings: 0,
    bonusStatus: 'N/A',
    disqualificationReason: '',
    behaviorScore: 100,
    // NEW: Case Status Counters
    pendingCases: 0,
    resolvedCases: 0
  };

  // 1. Calculate CDR Stats
  if (cdrSheet) {
    var cdrData = cdrSheet.getDataRange().getValues();
    for (var i = 1; i < cdrData.length; i++) {
      var shouldCount = false;

      // Filter Logic (Who sees what?)
      if (userRole === 'Superadmin' || userRole === 'VP' || userRole === 'DisciplineDept' || assignedClasses === 'ALL') {
        shouldCount = true;
      } else {
        var classes = assignedClasses ? String(assignedClasses).split(',') : [];
        // Trim spaces from classes
        classes = classes.map(function (c) { return c.trim(); });
        var rowClass = String(cdrData[i][4]).trim();

        if (classes.indexOf(rowClass) !== -1) {
          shouldCount = true;
        }
        if (userRole === 'Student' && String(cdrData[i][2]).trim() === username) {
          shouldCount = true;
        }
      }

      if (shouldCount) {
        stats.totalCDR++;

        // Count Levels
        var level = String(cdrData[i][5]).trim();
        if (level === 'Level 1') stats.level1++;
        if (level === 'Level 2') stats.level2++;

        // Count Meetings
        if (cdrData[i][10] === true && cdrData[i][11] === false) stats.pendingMeetings++;

        // --- NEW: Count Status ---
        var status = String(cdrData[i][9]).trim().toUpperCase(); // Col J
        if (status === 'RESOLVED' || status === 'CLOSED' || status === 'DONE') {
          stats.resolvedCases++;
        } else {
          // Active, Open, Pending, etc.
          stats.pendingCases++;
        }
      }
    }
  }

  // 2. Calculate Lateness Stats
  if (latenessSheet) {
    var latenessData = latenessSheet.getDataRange().getValues();
    for (var i = 1; i < latenessData.length; i++) {
      var shouldCount = false;
      if (userRole === 'Superadmin' || userRole === 'VP' || userRole === 'DisciplineDept' || assignedClasses === 'ALL') {
        shouldCount = true;
      } else {
        var classes = assignedClasses ? String(assignedClasses).split(',') : [];
        classes = classes.map(function (c) { return c.trim(); });
        var rowClass = String(latenessData[i][5]).trim();

        if (classes.indexOf(rowClass) !== -1) {
          shouldCount = true;
        }
        if (userRole === 'Student' && String(latenessData[i][3]).trim() === username) {
          shouldCount = true;
        }
      }

      if (shouldCount) {
        stats.totalLateness++;
      }
    }
  }

  // 3. Student Specific Stats (Bonus & Score)
  if (userRole === 'Student') {
    if (bonusSheet) {
      var timeZone = Session.getScriptTimeZone();
      var currentMonthYear = Utilities.formatDate(new Date(), timeZone, 'yyyy-MM');
      var bonusData = bonusSheet.getDataRange().getValues();

      stats.bonusStatus = 'Eligible';
      stats.disqualificationReason = '';

      for (var k = 1; k < bonusData.length; k++) {
        var rowStudentId = String(bonusData[k][0]).trim();
        var rowMonth = String(bonusData[k][1]).trim();

        if (rowStudentId === username && rowMonth === currentMonthYear) {
          var isEligible = bonusData[k][2];
          stats.bonusStatus = isEligible ? 'Eligible' : 'Disqualified';
          stats.disqualificationReason = bonusData[k][3];
          break;
        }
      }
    }
    stats.behaviorScore = calculateBehaviorScore(username);
  }

  return stats;
}


function getStudentsByClass(classRoom) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var studentsSheet = ss.getSheetByName('Students');
  if (!studentsSheet) {
    return [];
  }
  var data = studentsSheet.getDataRange().getValues();
  var students = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] && data[i][4] && String(data[i][2]).trim() === classRoom && String(data[i][4]).trim() === 'Active') {
      students.push({
        studentId: data[i][0],
        name: data[i][1],
        class: data[i][2],
        gender: data[i][3]
      });
    }
  }
  return students;
}


function getAllClasses() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var studentsSheet = ss.getSheetByName('Students');
  if (!studentsSheet) {
    return [];
  }
  var data = studentsSheet.getDataRange().getValues();
  var classesSet = {};
  for (var i = 1; i < data.length; i++) {
    if (data[i][4] && String(data[i][4]).trim() === 'Active') {
      classesSet[data[i][2]] = true;
    }
  }
  var classes = [];
  for (var className in classesSet) {
    classes.push(className);
  }
  // Sort classes
  classes.sort();
  return classes;
}


function getAttendanceForToday(classRoom) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var attendanceSheet = ss.getSheetByName('Attendance');
  if (!attendanceSheet) {
    return [];
  }
  var today = new Date();
  var todayStr = Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var data = attendanceSheet.getDataRange().getValues();
  var todayAttendance = [];
  for (var i = 1; i < data.length; i++) {
    var recordDate = new Date(data[i][1]);
    var recordDateStr = Utilities.formatDate(recordDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');

    if (recordDateStr === todayStr && data[i][4] === classRoom) {
      todayAttendance.push({
        studentId: data[i][2],
        studentName: data[i][3],
        class: data[i][4],
        status: data[i][5]
      });
    }
  }
  return todayAttendance;
}


function saveAttendance(attendanceData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var attendanceSheet = ss.getSheetByName('Attendance');

  if (!attendanceSheet) {
    return { success: false, message: 'Attendance sheet not found' };
  }

  var date = new Date(attendanceData.date);
  var records = attendanceData.records;
  var recordedBy = attendanceData.recordedBy;
  var classRoom = records.length > 0 ? records[0].class : '';

  // 1. Delete existing attendance records for today and this class (Upsert Logic)
  var today = new Date();
  var todayStr = Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var data = attendanceSheet.getDataRange().getValues();
  var rowsToDelete = [];

  for (var i = 1; i < data.length; i++) {
    var recordDate = new Date(data[i][1]);
    var recordDateStr = Utilities.formatDate(recordDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');

    if (recordDateStr === todayStr && data[i][4] === classRoom) {
      rowsToDelete.push(i + 1); // +1 because sheet rows are 1-indexed
    }
  }

  // Delete rows in reverse order to maintain correct row numbers
  for (var j = rowsToDelete.length - 1; j >= 0; j--) {
    attendanceSheet.deleteRow(rowsToDelete[j]);
  }

  // 2. Add new attendance records & Update Bonus Eligibility
  for (var i = 0; i < records.length; i++) {
    var id = 'ATT' + new Date().getTime() + '_' + i;

    // Save to Sheet
    attendanceSheet.appendRow([
      id,
      date,
      records[i].studentId,
      records[i].studentName,
      records[i].class,
      records[i].status,
      '', // Reason (Default empty for mass attendance, or add generic reason if provided)
      recordedBy
    ]);

    // **INTEGRATION POINT:** Update Bonus Eligibility immediately
    // Only update if status is significant (Absent/Leave) or to restore eligibility (Present)
    // The helper function handles the specific logic.
    try {
      updateBonusEligibility(records[i].studentId, date);
    } catch (e) {
      Logger.log('Error updating bonus for student ' + records[i].studentId + ': ' + e.toString());
    }
  }

  return { success: true, message: 'Attendance saved successfully' };
}


function getTidinessForCurrentWeek(classRoom) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tidinessSheet = ss.getSheetByName('Tidiness');
  if (!tidinessSheet) {
    return [];
  }
  var currentWeek = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-ww');
  var data = tidinessSheet.getDataRange().getValues();
  var weekTidiness = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] === currentWeek && data[i][5] === classRoom) {
      weekTidiness.push({
        studentId: data[i][3],
        studentName: data[i][4],
        class: data[i][5],
        hair: data[i][6],
        nails: data[i][7],
        uniform: data[i][8],
        bag: data[i][9]
      });
    }
  }
  return weekTidiness;
}


function saveTidinessCheck(tidinessData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tidinessSheet = ss.getSheetByName('Tidiness');
  if (!tidinessSheet) {
    return { success: false, message: 'Tidiness sheet not found' };
  }
  var date = new Date(tidinessData.date);
  var records = tidinessData.records;
  var recordedBy = tidinessData.recordedBy;
  var classRoom = records.length > 0 ? records[0].class : '';
  // Calculate current week
  var currentWeek = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-ww');
  // Delete existing tidiness records for current week and this class
  var data = tidinessSheet.getDataRange().getValues();
  var rowsToDelete = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] === currentWeek && data[i][5] === classRoom) {
      rowsToDelete.push(i + 1); // +1 because sheet rows are 1-indexed
    }
  }
  // Delete rows in reverse order to maintain correct row numbers
  for (var j = rowsToDelete.length - 1; j >= 0; j--) {
    tidinessSheet.deleteRow(rowsToDelete[j]);
  }
  // Add new tidiness records
  for (var i = 0; i < records.length; i++) {
    var id = 'TID' + new Date().getTime() + '_' + i;

    tidinessSheet.appendRow([
      id,
      date,
      currentWeek,
      records[i].studentId,
      records[i].studentName,
      records[i].class,
      records[i].hair,
      records[i].nails,
      records[i].uniform,
      records[i].bag,
      recordedBy
    ]);
  }
  return { success: true, message: 'Tidiness check saved successfully' };
}

// Parent Meeting Functions
// --- VP: Get Pending Approvals (Requested=True, Approved=False) ---
// --- VP: Get Pending Approvals (Requested=True, Approved=False) ---
function getPendingApprovals(filterClass) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cdrSheet = ss.getSheetByName('CDR_Log');
    if (!cdrSheet) {
      console.warn("CDR_Log sheet not found");
      return [];
    }

    var data = cdrSheet.getDataRange().getValues();
    var requests = [];

    // DEBUG LOGGING
    console.log("getPendingApprovals called. Filter: '" + filterClass + "'. Total Rows: " + data.length);

    for (var i = 1; i < data.length; i++) {
      var rawRequested = data[i][10]; // Col K (ParentMeetingRequested)
      var rawApproved = data[i][11]; // Col L (ParentMeetingApproved)
      var studentClass = String(data[i][4] || '').trim();
      var rawStatus = data[i][9]; // Col J - for debug

      // Robust Boolean Normalization
      var isRequested = (rawRequested === true || String(rawRequested).trim().toUpperCase() === 'TRUE');
      var isApproved = (rawApproved === true || String(rawApproved).trim().toUpperCase() === 'TRUE');

      // DEBUG: Log first 5 rows or if it matches our test case
      if (i < 5 || String(data[i][3]).includes('Test Student')) {
        console.log(`Row ${i + 1} [${data[i][0]}]: ReqRaw=${rawRequested}(${typeof rawRequested})->${isRequested}, ApprRaw=${rawApproved}(${typeof rawApproved})->${isApproved}, Class='${studentClass}', Status='${rawStatus}'`);
      }

      // Filter Logic: Requested AND Not Approved
      if (isRequested && !isApproved) {

        // Class Filter
        var include = true;
        if (filterClass && String(filterClass).toUpperCase() !== 'ALL') {
          // Handle multi-class filter (e.g. "M.1/1, M.1/2")
          var targetClasses = String(filterClass).split(',').map(function (c) { return c.trim().toUpperCase(); });
          if (targetClasses.indexOf(studentClass.toUpperCase()) === -1) {
            include = false;
          }
        }

        if (include) {
          requests.push({
            id: data[i][0],
            studentId: data[i][2],
            studentName: data[i][3],
            class: data[i][4],
            level: data[i][5],
            category: data[i][6],
            description: data[i][7],
            // Return normalized ISO string for date
            requestedDate: data[i][1] ? (data[i][1] instanceof Date ? data[i][1].toISOString() : String(data[i][1])) : new Date().toISOString()
          });
        }
      }
    }

    console.log("Pending Approvals Returning: " + requests.length + " records.");
    return requests;

  } catch (e) {
    console.error("Error in getPendingApprovals: " + e.toString());
    return [];
  }
}


// --- VP: Approve Meeting ---
function approveParentMeeting(cdrId, vpName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cdrSheet = ss.getSheetByName('CDR_Log');

  if (!cdrSheet) return { success: false, message: 'CDR Log not found' };

  var data = cdrSheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(cdrId).trim()) {
      // Set ParentMeetingApproved = TRUE (Col L / Index 11)
      cdrSheet.getRange(i + 1, 12).setValue(true);
      // Update Status to Approved (Col J / Index 9)
      cdrSheet.getRange(i + 1, 10).setValue('Approved');

      // Log the approval in Notes (Col M / Index 12)
      var currentNotes = data[i][12] || '';
      cdrSheet.getRange(i + 1, 13).setValue(currentNotes + '\n[VP Approved by ' + vpName + ' on ' + new Date().toISOString() + ']');

      return { success: true, message: 'Meeting Request Approved' };
    }
  }
  return { success: false, message: 'Record not found' };
}

// --- VP: Reject Meeting ---
function rejectParentMeeting(cdrId, vpName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cdrSheet = ss.getSheetByName('CDR_Log');

  if (!cdrSheet) return { success: false, message: 'CDR Log not found' };

  var data = cdrSheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(cdrId).trim()) {
      // Set ParentMeetingApproved = FALSE (Col L / Index 11)
      cdrSheet.getRange(i + 1, 12).setValue(false);
      // Update Status to Rejected (Col J / Index 9)
      cdrSheet.getRange(i + 1, 10).setValue('Rejected');

      // Log the rejection in Notes (Col M / Index 12)
      var currentNotes = data[i][12] || '';
      cdrSheet.getRange(i + 1, 13).setValue(currentNotes + '\n[VP Rejected by ' + vpName + ' on ' + new Date().toISOString() + ']');

      return { success: true, message: 'Meeting Request Rejected' };
    }
  }
  return { success: false, message: 'Record not found' };
}

// --- Manual Trigger: HRT Requests Meeting ---
function requestParentMeeting(cdrId, requestedBy) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cdrSheet = ss.getSheetByName('CDR_Log');
  if (!cdrSheet) return { success: false, message: 'CDR Log not found' };

  var data = cdrSheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(cdrId).trim()) {
      var row = i + 1;

      // Set ParentMeetingRequested = TRUE (Col K / Index 10)
      cdrSheet.getRange(row, 11).setValue(true);
      // Set ParentMeetingApproved = FALSE (Col L / Index 11) - Reset approval
      cdrSheet.getRange(row, 12).setValue(false);

      // Log in Notes
      var currentNotes = data[i][12] || '';
      cdrSheet.getRange(row, 13).setValue(currentNotes + '\n[Manual Meeting Request by ' + requestedBy + ' on ' + new Date().toISOString() + ']');

      return { success: true, message: 'Parent Meeting Requested. Sent to VP for approval.' };
    }
  }
  return { success: false, message: 'Record not found' };
}



// --- Office Staff: Get Approved Meetings (Ready for Scheduling or Scheduled) ---
function getPendingParentMeetings() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cdrSheet = ss.getSheetByName('CDR_Log');
  if (!cdrSheet) return [];

  var data = cdrSheet.getDataRange().getValues();
  var meetings = [];
  var timeZone = Session.getScriptTimeZone();

  for (var i = 1; i < data.length; i++) {
    var requested = data[i][10]; // Col K
    var approved = data[i][11];  // Col L
    var status = String(data[i][9]); // Col J

    // Logic: Requested + Approved + (Status is Approved or Scheduled)
    // Exclude 'Completed', 'Closed', 'Done'
    if (requested === true && approved === true &&
      status !== 'Completed' && status !== 'Closed' && status !== 'Done') {

      // Extract Meeting Time from Col Q (Index 16) if exists
      var meetingTimeStr = '';
      if (data[i][16]) {
        try {
          meetingTimeStr = Utilities.formatDate(new Date(data[i][16]), timeZone, 'dd/MM/yyyy HH:mm');
        } catch (e) {
          meetingTimeStr = String(data[i][16]);
        }
      }

      meetings.push({
        cdrId: data[i][0],
        studentId: data[i][2],
        studentName: data[i][3],
        class: data[i][4],
        reason: data[i][6] + ' - ' + data[i][7],
        status: status, // Expected: 'Approved' or 'Scheduled'
        meetingTime: meetingTimeStr,
        requestedDate: data[i][1] ? Utilities.formatDate(new Date(data[i][1]), timeZone, 'dd/MM/yyyy') : '-'
      });
    }
  }

  return meetings;
}


// --- Office Staff: Update Meeting Status (Schedule / Complete) ---
function updateParentMeetingStatus(cdrId, status, timeStr) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cdrSheet = ss.getSheetByName('CDR_Log');

    if (!cdrSheet) return { success: false, message: 'CDR Log not found' };

    var data = cdrSheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(cdrId).trim()) {

        // Update Status (Col J / Index 9)
        cdrSheet.getRange(i + 1, 10).setValue(status);

        // If scheduling, save the time to Col Q (Index 16)
        if (status === 'Scheduled' && timeStr) {
          cdrSheet.getRange(i + 1, 17).setValue(new Date(timeStr));
        }

        // Log action in Notes (Col M / Index 12)
        var currentNotes = data[i][12] || '';
        var logEntry = '\n[Status Update: ' + status + ' by Office on ' + new Date().toISOString() + ']';
        cdrSheet.getRange(i + 1, 13).setValue(currentNotes + logEntry);

        return { success: true, message: 'Status updated to ' + status };
      }
    }
    return { success: false, message: 'Record not found' };

  } catch (error) {
    Logger.log('updateParentMeetingStatus error: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

function updateBonusEligibility(studentId, dateObject) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var latenessSheet = ss.getSheetByName('Lateness_Log');
  var attendanceSheet = ss.getSheetByName('Attendance');
  var cdrSheet = ss.getSheetByName('CDR_Log'); // [REQ] Add CDR_Log access
  var bonusSheet = ss.getSheetByName('Bonus_Eligibility');

  if (!latenessSheet || !attendanceSheet || !bonusSheet || !cdrSheet) {
    Logger.log('Error: Missing required sheets for bonus calculation.');
    return false;
  }

  var timeZone = Session.getScriptTimeZone();
  var targetDate = new Date(dateObject);
  var targetMonthYear = Utilities.formatDate(targetDate, timeZone, 'yyyy-MM');

  var isEligible = true;
  var reason = '';

  // 1. [NEW] Safety Check: Level 2 Offenses (CDR_Log)
  // Logic: Any Level 2 offense in the current month disqualifies immediately.
  var cdrData = cdrSheet.getDataRange().getValues();
  for (var c = 1; c < cdrData.length; c++) {
    var cdrDate = cdrData[c][1];
    var cdrStudentId = String(cdrData[c][2]).trim();
    var cdrLevel = String(cdrData[c][5]).trim();

    if (!cdrDate) continue;

    var cdrMonthYear = Utilities.formatDate(new Date(cdrDate), timeZone, 'yyyy-MM');
    if (cdrStudentId === String(studentId).trim() &&
      cdrMonthYear === targetMonthYear &&
      cdrLevel === 'Level 2') {
      isEligible = false;
      reason = 'Disqualified: Level 2 Offense';
      break;
    }
  }

  // 2. Query Lateness_Log (Only if still eligible)
  if (isEligible) {
    var latenessData = latenessSheet.getDataRange().getValues();
    for (var i = 1; i < latenessData.length; i++) {
      var rowDate = latenessData[i][1];
      var rowStudentId = String(latenessData[i][3]).trim();
      if (!rowDate) continue;

      var rowMonthYear = Utilities.formatDate(new Date(rowDate), timeZone, 'yyyy-MM');
      if (rowStudentId === String(studentId).trim() && rowMonthYear === targetMonthYear) {
        isEligible = false;
        reason = 'Found Lateness Record';
        break;
      }
    }
  }

  // 3. Query Attendance Sheet (Only if still eligible)
  if (isEligible) {
    var attendanceData = attendanceSheet.getDataRange().getValues();
    for (var j = 1; j < attendanceData.length; j++) {
      var rowDate = attendanceData[j][1];
      var rowStudentId = String(attendanceData[j][2]).trim();
      var rowStatus = String(attendanceData[j][5]).toLowerCase().trim();

      if (!rowDate) continue;

      var rowMonthYear = Utilities.formatDate(new Date(rowDate), timeZone, 'yyyy-MM');
      if (rowStudentId === String(studentId).trim() && rowMonthYear === targetMonthYear) {
        if (rowStatus === 'absent' || rowStatus === 'leave' || rowStatus === 'ขาด' || rowStatus === 'ลา') {
          isEligible = false;
          reason = 'Attendance Status: ' + rowStatus;
          break;
        }
      }
    }
  }

  // 4. Update Bonus_Eligibility Sheet (Upsert)
  var bonusData = bonusSheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var k = 1; k < bonusData.length; k++) {
    var existingId = String(bonusData[k][0]).trim();
    var existingMonth = String(bonusData[k][1]).trim();
    if (existingId === String(studentId).trim() && existingMonth === targetMonthYear) {
      rowIndex = k + 1;
      break;
    }
  }

  var timestamp = new Date();
  if (rowIndex > 0) {
    bonusSheet.getRange(rowIndex, 3).setValue(isEligible);
    bonusSheet.getRange(rowIndex, 4).setValue(reason);
    bonusSheet.getRange(rowIndex, 5).setValue(timestamp);
  } else {
    bonusSheet.appendRow([studentId, targetMonthYear, isEligible, reason, timestamp]);
  }

  return isEligible;
}

// --- ADD TO CODE.GS ---

function getStudentGender(studentId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var studentsSheet = ss.getSheetByName('Students');
  if (!studentsSheet) return 'Male'; // Default fallback

  var data = studentsSheet.getDataRange().getValues();
  // Assuming StudentID is Col A (index 0) and Gender is Col D (index 3) based on setupSheets
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(studentId).trim()) {
      return data[i][3] || 'Male';
    }
  }
  return 'Male'; // Default
}

function calculateBehaviorScore(studentId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cdrSheet = ss.getSheetByName('CDR_Log');
  var configSheet = ss.getSheetByName('Config');
  var bonusSheet = ss.getSheetByName('Bonus_Eligibility');

  // Base Score
  var baseScore = 100;
  var deductions = 0;
  var bonusPoints = 0;

  if (!cdrSheet || !configSheet) {
    return baseScore;
  }

  // --- 1. Fetch Term Configuration (Existing Logic) ---
  var configData = configSheet.getDataRange().getValues();
  var termConfig = {};
  for (var k = 1; k < configData.length; k++) {
    termConfig[configData[k][0]] = configData[k][1];
  }

  // Helper to parse "YYYY-MM" or Date objects
  function parseConfigDate(value) {
    if (!value) return null;
    if (value instanceof Date) return value;
    return new Date(value + '-01');
  }

  var s1Start = parseConfigDate(termConfig['Semester1Start']);
  var s1End = parseConfigDate(termConfig['Semester1End']);
  if (s1End) { s1End = new Date(s1End.getFullYear(), s1End.getMonth() + 1, 0); } // End of month

  var s2Start = parseConfigDate(termConfig['Semester2Start']);
  var s2End = parseConfigDate(termConfig['Semester2End']);
  if (s2End) { s2End = new Date(s2End.getFullYear(), s2End.getMonth() + 1, 0); } // End of month

  // --- 2. Determine Current Term Window (Existing Logic) ---
  var today = new Date();
  var startDate, endDate;

  if (s1Start && s1End && today >= s1Start && today <= s1End) {
    startDate = s1Start;
    endDate = s1End;
  } else if (s2Start && s2End && today >= s2Start && today <= s2End) {
    startDate = s2Start;
    endDate = s2End;
  } else {
    // Fallback: If currently in a break, assume the current calendar year
    startDate = new Date(today.getFullYear(), 0, 1);
    endDate = new Date(today.getFullYear(), 11, 31);
  }

  // --- 3. Calculate Deductions (CDR_Log) ---
  var cdrData = cdrSheet.getDataRange().getValues();

  for (var i = 1; i < cdrData.length; i++) {
    var rowDate = new Date(cdrData[i][1]);
    var rowStudentId = String(cdrData[i][2]).trim();
    var rowLevel = String(cdrData[i][5]).trim(); // Level 1 or Level 2

    // Check Student ID and Date Range
    if (rowStudentId === String(studentId).trim() && rowDate >= startDate && rowDate <= endDate) {
      if (rowLevel === 'Level 1') {
        deductions += 5;
      } else if (rowLevel === 'Level 2') {
        deductions += 10;
      }
    }
  }

  // --- 4. Calculate Bonus Points (NEW LOGIC) ---
  if (bonusSheet) {
    // A. Generate list of months (YYYY-MM) within the current term window
    var termMonths = [];
    var currentDateIterator = new Date(startDate);
    var timeZone = Session.getScriptTimeZone();

    // Iterate month by month from Start to End (or Today, whichever is smaller, 
    // to prevent awarding bonus for future months not yet completed, 
    // OR just use endDate if bonuses are calculated retroactively/live)
    // Here we use endDate to define the Term scope.
    while (currentDateIterator <= endDate) {
      var monthStr = Utilities.formatDate(currentDateIterator, timeZone, 'yyyy-MM');
      termMonths.push(monthStr);
      // Move to next month
      currentDateIterator.setMonth(currentDateIterator.getMonth() + 1);
    }

    // B. Query Bonus_Eligibility
    var bonusData = bonusSheet.getDataRange().getValues();

    // Iterate through bonus records
    for (var j = 1; j < bonusData.length; j++) {
      var bStudentId = String(bonusData[j][0]).trim();
      var bMonthYear = String(bonusData[j][1]).trim(); // YYYY-MM
      var bIsEligible = bonusData[j][2]; // Boolean (TRUE/FALSE)

      if (bStudentId === String(studentId).trim()) {
        // Check if this record's month belongs to the current term
        if (termMonths.indexOf(bMonthYear) !== -1) {
          // If Eligible, Add 10 Points
          if (bIsEligible === true) {
            bonusPoints += 10;
          }
        }
      }
    }
  }

  // --- 5. Return Final Score ---
  // Formula: 100 - Deductions + Bonus
  var finalScore = baseScore - deductions + bonusPoints;

  // Ensure score doesn't drop below 0 (Optional: Cap at 100? Usually behavior scores can go >100 with bonus, or capped. Keeping max(0) as requested).
  return Math.max(0, finalScore);
}

function getClassScores(filterClass) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var studentsSheet = ss.getSheetByName('Students');

  if (!studentsSheet) return [];

  var data = studentsSheet.getDataRange().getValues();
  var studentScores = [];

  // Parse filterClass if it contains multiple classes (e.g. "M.1/1,M.1/2")
  var targetClasses = [];
  if (filterClass && filterClass !== 'ALL') {
    targetClasses = filterClass.split(',').map(function (c) { return c.trim(); });
  }

  // Loop through students (skip header)
  for (var i = 1; i < data.length; i++) {
    // Columns: 0=ID, 1=Name, 2=Class, 4=Status
    var studentId = String(data[i][0]).trim();
    var studentName = data[i][1];
    var studentClass = String(data[i][2]).trim();
    var status = data[i][4];

    // Only process Active students
    if (status !== 'Active') continue;

    // Filter Logic
    var shouldInclude = false;
    if (filterClass === 'ALL') {
      shouldInclude = true;
    } else {
      // Check if student's class is in the target list
      if (targetClasses.indexOf(studentClass) !== -1) {
        shouldInclude = true;
      }
    }

    if (shouldInclude) {
      // Reuse the existing calculation logic
      var score = calculateBehaviorScore(studentId);

      studentScores.push({
        id: studentId,
        name: studentName,
        class: studentClass,
        score: score
      });
    }
  }

  // Sort Array: Ascending Order (Lowest Score First)
  studentScores.sort(function (a, b) {
    return a.score - b.score;
  });

  return studentScores;
}

// --- REPLACE THE ENTIRE getSystemReportData FUNCTION IN CODE.GS ---

function getSystemReportData(startDateStr, endDateStr, userRole, assignedClasses) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cdrSheet = ss.getSheetByName('CDR_Log');
  var latenessSheet = ss.getSheetByName('Lateness_Log');

  // Initialize Stats
  var stats = {
    totalCDR: 0,
    level1: 0,
    level2: 0,
    totalLateness: 0,
    activityLate: 0, // 7:40
    realLate: 0,     // 8:00
    topOffenses: [],
    topClasses: []
  };

  // Helper to parse date strings (YYYY-MM-DD)
  function parseDate(str) {
    var parts = str.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  // Set time range
  var start = parseDate(startDateStr);
  start.setHours(0, 0, 0, 0);

  var end = parseDate(endDateStr);
  end.setHours(23, 59, 59, 999);

  // --- FILTER LOGIC SETUP ---
  // Determine if we need to filter by specific classes
  var targetClasses = [];
  var isRestricted = false;

  // HRT and Teachers are restricted to their assigned classes
  if (userRole === 'HRT' || userRole === 'Teacher') {
    isRestricted = true;
    if (assignedClasses && assignedClasses !== 'ALL') {
      // Split "M.1/1,M.1/2" into array ["M.1/1", "M.1/2"]
      targetClasses = String(assignedClasses).split(',').map(function (c) { return c.trim(); });
    }
  }

  // --- 1. Process CDR Log ---
  if (cdrSheet) {
    var cdrData = cdrSheet.getDataRange().getValues();
    var offenseCounts = {};
    var classCounts = {};

    for (var i = 1; i < cdrData.length; i++) {
      var rowDate = new Date(cdrData[i][1]); // Col B
      var status = String(cdrData[i][9]);    // Col J (Status)
      var rowClass = String(cdrData[i][4]).trim(); // Col E (Class)

      // 1. Date Filter
      if (rowDate < start || rowDate > end) continue;

      // 2. Status Filter
      if (status === 'Cancelled') continue;

      // 3. Class/Role Filter (CRITICAL FIX)
      // If user is restricted, check if the record's class matches their assigned classes
      if (isRestricted) {
        if (targetClasses.indexOf(rowClass) === -1) continue;
      }

      // If we pass all filters, count stats
      stats.totalCDR++;

      var level = String(cdrData[i][5]).trim(); // Col F
      if (level === 'Level 1') stats.level1++;
      if (level === 'Level 2') stats.level2++;

      var category = String(cdrData[i][6]).trim(); // Col G
      if (category) {
        offenseCounts[category] = (offenseCounts[category] || 0) + 1;
      }

      if (rowClass) {
        classCounts[rowClass] = (classCounts[rowClass] || 0) + 1;
      }
    }

    // Sort and Top 5 - Offenses
    var sortedOffenses = [];
    for (var cat in offenseCounts) {
      sortedOffenses.push({ label: cat, count: offenseCounts[cat] });
    }
    sortedOffenses.sort(function (a, b) { return b.count - a.count; });
    stats.topOffenses = sortedOffenses.slice(0, 5);

    // Sort and Top 5 - Classes
    var sortedClasses = [];
    for (var cls in classCounts) {
      sortedClasses.push({ label: cls, count: classCounts[cls] });
    }
    sortedClasses.sort(function (a, b) { return b.count - a.count; });
    stats.topClasses = sortedClasses.slice(0, 5);
  }

  // --- 2. Process Lateness Log ---
  if (latenessSheet) {
    var latData = latenessSheet.getDataRange().getValues();
    for (var j = 1; j < latData.length; j++) {
      var latDate = new Date(latData[j][1]); // Col B
      var latClass = String(latData[j][5]).trim(); // Col F (Class)

      // 1. Date Filter
      if (latDate < start || latDate > end) continue;

      // 2. Class/Role Filter (CRITICAL FIX)
      if (isRestricted) {
        if (targetClasses.indexOf(latClass) === -1) continue;
      }

      // Count stats
      stats.totalLateness++;

      var type = String(latData[j][8]).trim(); // Col I
      // Check loosely for 7:40 or 8:00
      if (type.indexOf('7:40') !== -1 || type === 'Activity Late') {
        stats.activityLate++;
      } else if (type.indexOf('8:00') !== -1 || type === 'Real Late') {
        stats.realLate++;
      }
    }
  }

  return stats;
}

// --- ADD TO CODE.GS ---

function resolveCDR(cdrId, resolutionNotes, resolvedBy) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('CDR_Log');
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;

    // Find the row with the matching CDR ID
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(cdrId).trim()) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      return { success: false, message: 'CDR Record not found.' };
    }

    // Update Columns
    // Col J (Index 9) = Status -> Set to 'Resolved'
    // Col M (Index 12) = Notes -> Append resolution notes
    // Col N (Index 13) = ReviewedBy -> Set to teacher's name/email
    // Col O (Index 14) = ReviewedAt -> Timestamp (Optional, if you have a column for it)

    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
    var existingNotes = String(data[rowIndex][12] || '');
    var newNotes = existingNotes + (existingNotes ? "\n" : "") + "[Resolved]: " + resolutionNotes;

    sheet.getRange(rowIndex + 1, 10).setValue('Resolved');
    sheet.getRange(rowIndex + 1, 13).setValue(newNotes);

    // Optional: Log who did it if you have columns for it, otherwise just Notes is fine
    // sheet.getRange(rowIndex + 1, 14).setValue(resolvedBy); 

    return { success: true };

  } catch (error) {
    Logger.log('Error resolving CDR: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

/**
 * Sends system emails based on Role and Class assignment.
 * @param {string} targetRole - The role to find (e.g., 'DisciplineDept', 'HRT').
 * @param {string} subject - Email subject line.
 * @param {string} htmlBody - HTML content of the email.
 * @param {string} relatedClass - (Optional) The specific class involved (e.g., 'M.1/1'). Used to find the specific HRT.
 */
function sendSystemEmail(targetRole, subject, htmlBody, relatedClass) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var usersSheet = ss.getSheetByName('Users');
    if (!usersSheet) return;

    var data = usersSheet.getDataRange().getValues();
    var recipients = [];

    // Columns (0-based): 3=Role, 4=AssignedClasses, 5=Email, 6=Status
    for (var i = 1; i < data.length; i++) {
      var userRole = String(data[i][3]).trim();
      var assignedClasses = String(data[i][4]).trim();
      var userEmail = String(data[i][5]).trim();
      var status = String(data[i][6]).trim();

      if (status !== 'Active' || !userEmail) continue;

      // Check Role Match (Supports multiple roles e.g., "Teacher,HRT")
      if (userRole.indexOf(targetRole) !== -1) {
        var shouldSend = false;

        // If a specific class is provided (e.g., finding the HRT for M.1/1)
        if (relatedClass) {
          if (assignedClasses === 'ALL' || assignedClasses.indexOf(relatedClass) !== -1) {
            shouldSend = true;
          }
        } else {
          // If no class filter, send to everyone with the role (e.g., DisciplineDept)
          shouldSend = true;
        }

        if (shouldSend) {
          recipients.push(userEmail);
        }
      }
    }

    if (recipients.length > 0) {
      // Remove duplicates
      recipients = [...new Set(recipients)];

      MailApp.sendEmail({
        to: recipients.join(','),
        subject: "[Smart CDR] " + subject,
        htmlBody: htmlBody,
        name: 'Smart CDR System'
      });
      Logger.log('Email sent to: ' + recipients.join(','));
    }

  } catch (e) {
    Logger.log('Error sending email: ' + e.toString());
    // We suppress the error so it doesn't break the main application flow
  }
}

/**
 * Checks if a lateness record already exists for a student on a specific date
 * @param {string} studentId - Student ID to check
 * @param {string} dateStr - Date string in YYYY-MM-DD format to check
 * @returns {boolean} True if duplicate record exists, false otherwise
 */
function hasExistingLatenessRecord(studentId, dateStr) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var latenessSheet = ss.getSheetByName('Lateness_Log');
  if (!latenessSheet) return false;

  var data = latenessSheet.getDataRange().getValues();
  var normalizedStudentId = String(studentId).trim();
  var normalizedDateStr = dateStr.split('T')[0]; // Ensure YYYY-MM-DD format
  var timeZone = Session.getScriptTimeZone();

  for (var i = 1; i < data.length; i++) {
    var rowStudentId = String(data[i][3]).trim(); // StudentID column (index 3)

    // Handle date value (could be Date object or string)
    var rowDateValue = data[i][1]; // Date column (index 1)
    if (!rowDateValue) continue;

    var rowDate;
    if (rowDateValue instanceof Date) {
      rowDate = rowDateValue;
    } else {
      try {
        rowDate = new Date(rowDateValue);
      } catch (e) {
        continue; // Skip invalid dates
      }
    }

    var rowDateStr = Utilities.formatDate(rowDate, timeZone, 'yyyy-MM-dd');
    if (rowStudentId === normalizedStudentId && rowDateStr === normalizedDateStr) {
      return true;
    }
  }

  return false;
}

// ==========================================
// REPORTS MODULE
// ==========================================

/**
 * Fetch all unique classes from Students sheet for dropdowns
 */
function getAllClasses() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Students');
  var classes = [];

  if (sheet) {
    var data = sheet.getDataRange().getValues();
    // Start from row 1 to skip header
    for (var i = 1; i < data.length; i++) {
      var c = String(data[i][2]).trim(); // Col C is Class
      if (c && classes.indexOf(c) === -1) {
        classes.push(c);
      }
    }
  }
  return classes.sort();
}

/**
 * Get list of students for a specific class
 */
function getStudentsByClass(classId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Students');
  var students = [];

  if (sheet) {
    var data = sheet.getDataRange().getValues();
    // Schema: ID(0), Name(1), Class(2), ...
    for (var i = 1; i < data.length; i++) {
      var sClass = String(data[i][2]).trim();
      if (sClass === String(classId).trim()) {
        students.push({
          studentId: data[i][0],
          name: data[i][1],
          class: sClass
        });
      }
    }
  }
  return students;
}

/**
 * Lookup HRT for a class
 */
function getClassTeacher(className) {
  if (!className) return "ไม่ระบุ";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var usersSheet = ss.getSheetByName('Users');
  var data = usersSheet.getDataRange().getValues();

  // Users Schema: [Username(0), Password(1), FullName(2), Role(3), AssignedClasses(4), Email(5), Status(6)...]
  for (var i = 1; i < data.length; i++) {
    var role = data[i][3];
    var status = data[i][6];
    if ((role === 'HRT' || role === 'Teacher') && status === 'Active') {
      var assigned = String(data[i][4]).split(',');
      for (var j = 0; j < assigned.length; j++) {
        if (assigned[j].trim() === String(className).trim()) {
          return data[i][2]; // Return FullName
        }
      }
    }
  }
  return "ไม่ระบุ"; // Not Found
}

/**
 * Generate Monthly Class Report (List of Incidents)
 */
function getMonthlyClassReport(classId, monthStr) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var latenessSheet = ss.getSheetByName('Lateness_Log');

    // 1. Setup Data
    var teacherName = getClassTeacher(classId);
    var records = [];
    var summary = {
      totalRecords: 0,
      activityLate: 0,
      realLate: 0,
      studentCounts: {} // Accumulate per student
    };

    if (!latenessSheet) return { success: false, message: 'Lateness_Log not found' };

    var data = latenessSheet.getDataRange().getValues();
    var timeZone = Session.getScriptTimeZone();

    // 2. Parse Target Month (YYYY-MM)
    var parts = monthStr.split('-');
    var targetYear = parseInt(parts[0], 10);
    var targetMonth = parseInt(parts[1], 10) - 1; // JS Months are 0-11

    // 3. Loop Data
    // Schema: ID(0), Date(1), Time(2), StudentID(3), StudentName(4), Class(5), Reason(6), RecordedBy(7), RecordType(8), Status(9), StrikeCount(10)
    for (var i = 1; i < data.length; i++) {
      var rowClass = String(data[i][5]).trim();
      var rowDateValue = data[i][1];

      if (!rowDateValue || rowClass !== String(classId).trim()) continue;

      var rowDate = new Date(rowDateValue);
      if (isNaN(rowDate.getTime())) continue;

      // Check Month/Year
      if (rowDate.getFullYear() !== targetYear || rowDate.getMonth() !== targetMonth) continue;

      // Extract Data - Normalize Type
      var rawType = data[i][8];
      var type;
      if (rawType instanceof Date) {
        var h = rawType.getHours();
        var m = rawType.getMinutes();
        // Check for 7:40 vs 8:00
        if (h === 7 && m === 40) type = 'สายกิจกรรม 7:40 (Activity Late)';
        else type = 'สายเข้าเรียน 8:00+ (Real Late)';
      } else {
        var tStr = String(rawType);
        if (tStr.includes('7:40') || tStr === 'Activity Late') type = 'สายกิจกรรม 7:40 (Activity Late)';
        else type = 'สายเข้าเรียน 8:00+ (Real Late)';
      }

      var isReal = (type.includes('Real Late'));
      var isActivity = (type.includes('Activity Late'));

      // Update Summary
      summary.totalRecords++;
      if (isReal) summary.realLate++;
      if (isActivity) summary.activityLate++;

      var sName = String(data[i][4]);
      if (!summary.studentCounts[sName]) summary.studentCounts[sName] = 0;
      summary.studentCounts[sName]++;

      // Format Time
      var rawTime = data[i][2];
      var timeStr = (rawTime instanceof Date) ? Utilities.formatDate(rawTime, timeZone, 'HH:mm') : String(rawTime);

      // Format Date
      var dateThai = Utilities.formatDate(rowDate, timeZone, 'dd/MM/yyyy'); // Simple format, UI can make it nicer

      records.push({
        date: dateThai,
        time: timeStr,
        studentName: sName,
        reason: String(data[i][6]),
        count: data[i][10] || 1, // Strike Count
        status: String(data[i][9]),
        type: type
      });
    }

    // Sort by Date Descending
    records.sort(function (a, b) {
      // Split DD/MM/YYYY to compare
      var da = a.date.split('/');
      var db = b.date.split('/');
      // YYYYMMDD string compare
      return (db[2] + db[1] + db[0]).localeCompare(da[2] + da[1] + da[0]);
    });

    return {
      success: true,
      report: {
        className: classId,
        teacherName: teacherName,
        month: monthStr,
        records: records,
        summary: summary
      }
    };

  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

/**
 * Generate Individual Student Report
 */
function getStudentLatenessReport(studentId, monthStr) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var latenessSheet = ss.getSheetByName('Lateness_Log');
    var studentSheet = ss.getSheetByName('Students');

    // Lookup Student Name/Class
    var studentName = "";
    var studentClass = "";
    if (studentSheet) {
      var sData = studentSheet.getDataRange().getValues();
      for (var k = 1; k < sData.length; k++) {
        if (String(sData[k][0]) === String(studentId)) {
          studentName = sData[k][1];
          studentClass = sData[k][2];
          break;
        }
      }
    }

    var records = [];
    if (!latenessSheet) return { success: false, message: 'Lateness_Log not found' };

    var data = latenessSheet.getDataRange().getValues();
    var timeZone = Session.getScriptTimeZone();

    var parts = monthStr.split('-');
    var targetYear = parseInt(parts[0], 10);
    var targetMonth = parseInt(parts[1], 10) - 1;

    for (var i = 1; i < data.length; i++) {
      var rowId = String(data[i][3]).trim();
      var rowDateValue = data[i][1];

      if (!rowDateValue || rowId !== String(studentId).trim()) continue;

      var rowDate = new Date(rowDateValue);
      if (rowDate.getFullYear() !== targetYear || rowDate.getMonth() !== targetMonth) continue;

      // Extract Data
      var rawTime = data[i][2];
      var timeStr = (rawTime instanceof Date) ? Utilities.formatDate(rawTime, timeZone, 'HH:mm') : String(rawTime);
      var dateThai = Utilities.formatDate(rowDate, timeZone, 'dd/MM/yyyy');

      // Normalize Type for Display
      var rawType = data[i][8];
      var type;
      if (rawType instanceof Date) {
        var h = rawType.getHours();
        var m = rawType.getMinutes();
        if (h === 7 && m === 40) type = 'สายกิจกรรม 7:40 (Activity Late)';
        else type = 'สายเข้าเรียน 8:00+ (Real Late)';
      } else {
        var tStr = String(rawType);
        if (tStr.includes('7:40') || tStr === 'Activity Late') type = 'สายกิจกรรม 7:40 (Activity Late)';
        else type = 'สายเข้าเรียน 8:00+ (Real Late)';
      }

      records.push({
        date: dateThai,
        time: timeStr,
        studentName: String(data[i][4]), // Should match
        reason: String(data[i][6]),
        count: data[i][10] || 1,
        status: String(data[i][9]),
        type: type
      });
    }

    // Sort Date Ascending for History
    records.sort(function (a, b) {
      var da = a.date.split('/');
      var db = b.date.split('/');
      return (da[2] + da[1] + da[0]).localeCompare(db[2] + db[1] + db[0]);
    });

    var teacherName = getClassTeacher(studentClass);

    return {
      success: true,
      report: {
        studentName: studentName,
        studentId: studentId,
        className: studentClass,
        teacherName: teacherName,
        month: monthStr,
        records: records,
        totalLate: records.length
      }
    };

  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// --- TEST FUNCTION: Verify Lateness Counting Logic ---
// Run this manually in Apps Script Editor to test the fix.
// Expected Result: count = 3 (1x 'Activity Late', 1x '7:40' string, 1x Date object)
function testLatenessCounting() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Lateness_Log');
  var testId = 'TEST_' + new Date().getTime();
  var today = new Date();
  var scriptTimeZone = Session.getScriptTimeZone();
  var todayStr = Utilities.formatDate(today, scriptTimeZone, 'yyyy-MM-dd');

  // --- Insert 3 Mock Records with Different RecordType Formats ---

  // Record 1: "Activity Late" (New Standard)
  sheet.appendRow([
    'TEST1_' + testId, todayStr, '07:35:00', testId, 'Test Student', 'TestClass',
    'Test Reason', 'Tester', 'Activity Late', 'Pending', 1, '', '', '', '', '', '', ''
  ]);

  // Record 2: "7:40" (Legacy String from Rapid Entry)
  sheet.appendRow([
    'TEST2_' + testId, todayStr, '07:38:00', testId, 'Test Student', 'TestClass',
    'Test Reason', 'Tester', '7:40', 'Pending', 1, '', '', '', '', '', '', ''
  ]);

  // Record 3: Date Object (Simulating Sheets auto-format of "7:40")
  // Note: Appending a native JS Date will become a Date serial in Sheets
  var dateFor740 = new Date(1899, 11, 30, 7, 40, 0);
  sheet.appendRow([
    'TEST3_' + testId, todayStr, '07:39:00', testId, 'Test Student', 'TestClass',
    'Test Reason', 'Tester', dateFor740, 'Pending', 1, '', '', '', '', '', '', ''
  ]);

  // --- Run the Count Function ---
  var count = getMonthlyActivityLateCount(testId);

  // --- Assert & Log Result ---
  Logger.log('=== TEST RESULT ===');
  Logger.log('Test ID: ' + testId);
  Logger.log('Expected Count: 3');
  Logger.log('Actual Count: ' + count);
  Logger.log('Status: ' + (count === 3 ? '✅ PASS' : '❌ FAIL'));

  // --- Cleanup: Delete Test Rows ---
  var data = sheet.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    if (String(data[i][3]) === testId) {
      sheet.deleteRow(i + 1);
    }
  }
  Logger.log('Test rows cleaned up.');

  return count === 3 ? 'PASS' : 'FAIL';
}