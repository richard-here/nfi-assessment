const { decimalCount } = require('./helpers');
const dbPromise = require('../db/database');

const validateUserId = (userId) => {
  if (userId === undefined || typeof userId !== 'number' || decimalCount(userId) !== 0) {
    return {
      status: 'bad request',
      message: 'ID harus diisi dengan angka',
      responseCode: 400,
      isValid: false,
    };
  }
  return {
    isValid: true,
  };
};

const validateAmount = (amount) => {
  if (amount === undefined || typeof amount !== 'number' || decimalCount(amount) > 2) {
    return {
      status: 'bad request',
      message: 'Amount harus diisi dengan format angka dengan maksimal 2 angka di belakang koma',
      responseCode: 400,
      isValid: false,
    };
  }

  return {
    isValid: true,
  };
};

const validateUserExist = async (userId) => {
  const db = await dbPromise;
  try {
    const result = await db.get('SELECT * FROM user WHERE id = ?', [userId]);
    if (result === undefined) {
      return {
        status: 'not found',
        message: `Tidak terdapat user dengan ID ${userId}`,
        responseCode: 404,
        isValid: false,
        data: {},
      };
    }
    return {
      status: 'successful',
      message: `Berhasil mendapatkan informasi pengguna dengan ID ${userId}`,
      responseCode: 200,
      isValid: true,
      data: result,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 'internal server error',
      message: 'Terdapat kesalahan untuk mendapatkan informasi pengguna',
      responseCode: 500,
      isValid: false,
      data: {},
    };
  }
};

module.exports = { validateAmount, validateUserExist, validateUserId };
