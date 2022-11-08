const { expect } = require('chai');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const { validateAmount, validateUserId, validateUserExist } = require('../src/validations');
const dbPromise = require('../db/database');

describe('Validation Functions Unit Tests', () => {
  describe('Validating Amount functionality', () => {
    it('should return response code 400 with is invalid when amount is not defined', () => {
      const amount = undefined;
      const validation = validateAmount(amount);
      const { responseCode, isValid } = validation;
      expect(responseCode).to.equal(400);
      expect(isValid).to.equal(false);
    });
    it('should return response code 400 with is invalid when amount is not a number', () => {
      const amount = '400';
      const validation = validateAmount(amount);
      const { responseCode, isValid } = validation;
      expect(responseCode).to.equal(400);
      expect(isValid).to.equal(false);
    });
    it('should return response code 400 with is invalid when there are more than 2 decimals', () => {
      const amount = 400.123;
      const validation = validateAmount(amount);
      const { responseCode, isValid } = validation;
      expect(responseCode).to.equal(400);
      expect(isValid).to.equal(false);
    });
    it('should return is valid when the input is of type number with a maximum of 2 decimals', () => {
      const amounts = [400, 400.1, 400.2];
      amounts.forEach((amount) => {
        const validation = validateAmount(amount);
        const { isValid } = validation;
        expect(isValid).to.equal(true);
      });
    });
  });

  describe('Validating User ID Functionality', () => {
    it('should return response code 400 with is invalid when amount is not defined', () => {
      const userId = undefined;
      const validation = validateUserId(userId);
      const { responseCode, isValid } = validation;
      expect(responseCode).to.equal(400);
      expect(isValid).to.equal(false);
    });
    it('should return response code 400 with is invalid when amount is not a whole number', () => {
      const userIds = ['1', 1.13];
      userIds.forEach((userId) => {
        const validation = validateUserId(userId);
        const { responseCode, isValid } = validation;
        expect(responseCode).to.equal(400);
        expect(isValid).to.equal(false);
      });
    });
    it('should return is valid when the input is a whole number', () => {
      const userId = 1;
      const validation = validateUserId(userId);
      const { isValid } = validation;
      expect(isValid).to.equal(true);
    });
  });

  describe('Validating User Exist Functionality', () => {
    it('should return response code 404 and is invalid if user does not exist', async () => {
      const db = await dbPromise;
      sinon.stub(db, 'get').returns(undefined);
      const validation = await validateUserExist(1);
      const { responseCode, isValid } = validation;
      expect(responseCode).to.equal(404);
      expect(isValid).to.equal(false);
      db.get.restore();
    });
    it('should return response code 200, is valid, and user data if user exists', async () => {
      const db = await dbPromise;
      const userData = {
        id: 1,
        balance: 1000,
        createdAt: '2022-11-07 19:33:33',
      };
      sinon.stub(db, 'get').returns(userData);
      const validation = await validateUserExist(1);
      const { responseCode, isValid, data } = validation;
      expect(responseCode).to.equal(200);
      expect(isValid).to.equal(true);
      expect(data).to.equal(userData);
      db.get.restore();
    });
  });
});
