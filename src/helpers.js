const decimalCount = (num) => {
  if (typeof num !== 'number') {
    return 'num is not a number';
  }
  const numStr = String(num);
  if (numStr.includes('.')) {
    return numStr.split('.')[1].length;
  }
  return 0;
};

module.exports = { decimalCount };
