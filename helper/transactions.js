const { v4 } = require('uuid');
const profileModel = require('../models/user/profile.model');
const accountModel = require('../models/user/account.model');
const transactionModel = require('../models/user/transactions.model');

const creditAccount = async function({
  amount,userId, purpose, reference , metadata, opts
}) {
  const account = await accountModel.findOne({userId});

  if (!account) {
    return {
      success: false,
      msg: 'Account does not exist',
    }
  }

  await accountModel.findOneAndUpdate({userId}, {$inc : {'balance': amount},opts});

  const transaction =await transactionModel({
                        transactionType: 'credit',
                        purpose,
                        amount,
                        userId,
                        accountId:account._id,
                        reference,
                        metadata,
                        balanceBefore: Number(account.balance),
                        balanceAfter: Number(account.balance) + Number(amount)
                    });
            await transaction.save(opts)
    return {
        success: true
      }
}

const debitAccount = async function({
  amount,userId, purpose, reference, metadata, opts
}) {
    const account = await accountModel.findOne({userId});

  if (!account) {
    return {
      success: false,
      msg: 'Account does not exist',
    }
  } 

  if (Number(account.balance) < amount) {
    return {
        success: false,
        msg: 'Insufficient Balance'
    }
  }
  await accountModel.findOneAndUpdate({userId}, {$inc : {'balance': -amount},opts});
  const transaction =await transactionModel({
    transactionType: 'debit',
    purpose,
    amount,
    userId,
    accountId:account._id,
    reference,
    metadata,
    balanceBefore: Number(account.balance),
    balanceAfter: Number(account.balance) - Number(amount)
});
await transaction.save(opts)
  return {
  success: true,
  reference: reference
  }
}

module.exports = { creditAccount, debitAccount };
