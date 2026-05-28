import { openDB } from 'idb';

const DB_NAME = 'DailyReportDB';
const DB_VERSION = 1;
const STORE_NAME = 'reports';

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'date' });
        store.createIndex('date', 'date', { unique: true });
      }
    },
  });
};

// 保存日报
export const saveReport = async report => {
  const db = await initDB();
  return db.put(STORE_NAME, report);
};

/**
 * 根据日期获取日报
 * @param {string} date
 * @returns
 */
export const getReport = async date => {
  const db = await initDB();
  return db.get(STORE_NAME, date);
};

/**
 * 获取所有日报
 * @returns
 */
export const getAllReports = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

/**
 * 删除日报
 * @param {string} date
 * @returns
 */
export const deleteReport = async date => {
  const db = await initDB();
  return db.delete(STORE_NAME, date);
};
