const { expect } = require('chai');
const { describe, it } = require('mocha');
const { decimalCount } = require('../src/helpers');

describe('Helper Functions Unit Tests', () => {
  describe('Counting Decimal functionality', () => {
    it('should successfully return the number of decimal digits when given a number with decimals', () => {
      const number = 30.123;
      const decimals = decimalCount(number);
      expect(decimals).to.equal(3);
    });
    it('should return 0 when given a whole number', () => {
      const number = 30;
      const decimals = decimalCount(number);
      expect(decimals).to.equal(0);
    });
    it('should return an error string when given an input that is not type of number', () => {
      const number = '30.123';
      const decimals = decimalCount(number);
      expect(decimals).to.be.a('string');
    });
  });
});
