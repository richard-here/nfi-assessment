const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const DBSOURCE = './db/nfi.db';

const dbInit = async () => {
  const db = await open({
    filename: DBSOURCE,
    driver: sqlite3.Database,
  });

  console.log('Terhubung dengan database SQLite');

  const userTableStmt = 'CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, balance INTEGER, createdat TEXT)';
  const depositTableStmt = 'CREATE TABLE deposit (id INTEGER PRIMARY KEY AUTOINCREMENT, amount INTEGER, createdat TEXT, userid INTEGER, FOREIGN KEY(userid) REFERENCES user(id))';
  const withdrawalTableStmt = 'CREATE TABLE withdrawal (id INTEGER PRIMARY KEY AUTOINCREMENT, amount INTEGER, createdat TEXT, userid INTEGER, FOREIGN KEY(userid) REFERENCES user(id))';
  try {
    await db.exec(userTableStmt);
  } catch (err) {
    console.log('Tabel USER sudah ada sebelumnya');
  }

  try {
    await db.exec(depositTableStmt);
  } catch (err) {
    console.log('Tabel DEPOSIT sudah ada sebelumnya');
  }

  try {
    await db.exec(withdrawalTableStmt);
  } catch (err) {
    console.log('Tabel WITHDRAWAL sudah ada sebelumnya');
  }
  return db;
};

module.exports = dbInit();
