import { openDB } from 'idb'

const DB_NAME = 'DailyReportDB'
const DB_VERSION = 1
const STORE_NAME = 'reports'

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'date' })
        store.createIndex('date', 'date', { unique: true })
      }
    }
  })
}

export const saveReport = async (report) => {
  const db = await initDB()
  return db.put(STORE_NAME, report)
}

export const getReport = async (date) => {
  const db = await initDB()
  return db.get(STORE_NAME, date)
}

export const getAllReports = async () => {
  const db = await initDB()
  return db.getAll(STORE_NAME)
}

export const deleteReport = async (date) => {
  const db = await initDB()
  return db.delete(STORE_NAME, date)
}
