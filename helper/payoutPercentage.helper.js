const payoutAmount = function ({ amount, percentage }) {
  const payOut = Number(amount * (percentage / 100));
  return payOut;
};

module.exports = { payoutAmount };
