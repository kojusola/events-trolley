const { v4 } = require('uuid');
const profileModel = require('../models/user/profile.model');
const accountModel = require('../models/user/account.model');
const transactionModel = require('../models/user/transactions.model');

const creditAccount = async function({
  amount, accountId,userId, purpose, reference = v4(), metadata, opts
}) {
  const account = await accountModel.findOne({userId});

  if (!account) {
    return res.status(400).json({
      success: false,
      msg: 'Account does not exist',
    });
  }

  await accountModel.findOneAndUpdate({userId}, {$inc : {'balance': amount},opts});

  const transaction =await transactionModel({
                        txn_type: 'credit',
                        purpose,
                        amount,
                        userId,
                        accountId,
                        reference,
                        metadata,
                        balanceBefore: Number(account.balance),
                        balanceAfter: Number(account.balance) + Number(amount)
                    });
            await transaction.save(opts)
    return res.status(200).json({
        success: true,
        msg: 'Credit Successful',
      });
}

const debitAccount = async function({
  amount, accountId,userId, purpose, reference = v4(), metadata, opts
}) {
    const account = await accountModel.findOne({userId});

  if (!account) {
    return res.status(400).json({
      success: false,
      msg: 'Account does not exist',
    });
  }

  if (Number(account.balance) < amount) {
    return res.status(400).json({
        success: false,
        msg: 'Insufficient Balance'
      });
  }
  await accountModel.findOneAndUpdate({userId}, {$inc : {'balance': -amount},opts});
  const transaction =await transactionModel({
    txn_type: 'credit',
    purpose,
    amount,
    userId,
    accountId,
    reference,
    metadata,
    balanceBefore: Number(account.balance),
    balanceAfter: Number(account.balance) - Number(amount)
});
await transaction.save(opts)
return res.status(200).json({
success: true,
msg: 'Debit Successful',
});
}

module.exports = { creditAccount, debitAccount };
