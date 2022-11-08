const validations = require('./validations');
const dbPromise = require('../db/database');

const registerHandler = async (request, h) => {
  const db = await dbPromise;
  try {
    const result = await db.run('INSERT INTO user (balance, createdat) VALUES (:balance, CURRENT_TIMESTAMP)', {
      ':balance': 0,
    });
    const response = h.response({
      status: 'successful',
      message: `User berhasil diregistrasikan dengan ID ${result.lastID}`,
    });
    response.code(201);
    return response;
  } catch (err) {
    console.error(err);
    const response = h.response({
      status: 'internal server error',
      message: 'Terdapat kesalahan server saat melakukan registrasi user',
    });
    response.code(500);
    return response;
  }
};

const withrawBalanceHandler = async (request, h) => {
  const { userId, amount } = request.payload;
  const db = await dbPromise;

  const userIdValidation = validations.validateUserId(userId);
  if (!userIdValidation.isValid) {
    const response = h.response({
      status: userIdValidation.status,
      message: userIdValidation.message,
    });
    response.code(userIdValidation.responseCode);
    return response;
  }

  const amountValidation = validations.validateAmount(amount);
  if (!amountValidation.isValid) {
    const response = h.response({
      status: amountValidation.status,
      message: amountValidation.message,
    });
    response.code(amountValidation.responseCode);
    return response;
  }

  const userExistValidation = await validations.validateUserExist(userId);
  if (!userExistValidation.isValid) {
    const response = h.response({
      status: userExistValidation.status,
      message: userExistValidation.message,
      data: userExistValidation.data,
    });
    response.code(userExistValidation.responseCode);
    return response;
  }

  const userBalance = userExistValidation.data.balance;
  if (userBalance < amount * 100) {
    const response = h.response({
      status: 'forbidden',
      message: `Tidak dapat menarik sebanyak ${amount} ketika sisa saldo hanya ${userBalance / 100}`,
    });
    response.code(403);
    return response;
  }

  const updatedBalance = userBalance - amount * 100;
  try {
    const result = await db.run('INSERT INTO withdrawal (amount, userid, createdAt) VALUES (:amount, :userid, CURRENT_TIMESTAMP)', {
      ':amount': amount * 100,
      ':userid': userId,
    });
    const insertedId = result.lastID;
    const insertedData = await db.get('SELECT * FROM withdrawal WHERE id = ?', [insertedId]);
    await db.run('UPDATE user SET balance = ? WHERE id = ?', [updatedBalance, userId]);
    const userData = await db.get('SELECT * FROM user WHERE id = ?', [userId]);
    const response = h.response({
      status: 'successful',
      message: 'Saldo berhasil ditarik',
      data: {
        withdrawal: { ...insertedData, amount },
        user: { ...userData, balance: updatedBalance / 100 },
      },
    });
    response.code(200);
    return response;
  } catch (err) {
    console.error(err);
    const response = h.response({
      status: 'internal server error',
      message: 'Terdapat kesalahan untuk mendapatkan informasi pengguna',
    });
    response.code(500);
    return response;
  }
};

const depositBalanceHandler = async (request, h) => {
  const { userId, amount } = request.payload;
  const db = await dbPromise;

  const userIdValidation = validations.validateUserId(userId);
  if (!userIdValidation.isValid) {
    const response = h.response({
      status: userIdValidation.status,
      message: userIdValidation.message,
    });
    response.code(userIdValidation.responseCode);
    return response;
  }

  const amountValidation = validations.validateAmount(amount);
  if (!amountValidation.isValid) {
    const response = h.response({
      status: amountValidation.status,
      message: amountValidation.message,
    });
    response.code(amountValidation.responseCode);
    return response;
  }

  const userExistValidation = await validations.validateUserExist(userId);
  if (!userExistValidation.isValid) {
    const response = h.response({
      status: userExistValidation.status,
      message: userExistValidation.message,
      data: userExistValidation.data,
    });
    response.code(userExistValidation.responseCode);
    return response;
  }

  const userBalance = userExistValidation.data.balance;
  const updatedBalance = userBalance + amount * 100;

  try {
    const result = await db.run('INSERT INTO deposit (amount, userid, createdAt) VALUES (:amount, :userid, CURRENT_TIMESTAMP)', {
      ':amount': amount * 100,
      ':userid': userId,
    });
    const insertedId = result.lastID;
    const insertedData = await db.get('SELECT * FROM deposit WHERE id = ?', [insertedId]);
    await db.run('UPDATE user SET balance = ? WHERE id = ?', [updatedBalance, userId]);
    const userData = await db.get('SELECT * FROM user WHERE id = ?', [userId]);
    const response = h.response({
      status: 'successful',
      message: 'Saldo berhasil ditambahkan',
      data: {
        deposit: { ...insertedData, amount },
        user: { ...userData, balance: updatedBalance / 100 },
      },
    });
    response.code(200);
    return response;
  } catch (err) {
    console.error(err);
    const response = h.response({
      status: 'internal server error',
      message: 'Terdapat kesalahan untuk mendapatkan informasi pengguna',
    });
    response.code(500);
    return response;
  }
};

module.exports = { registerHandler, withrawBalanceHandler, depositBalanceHandler };
