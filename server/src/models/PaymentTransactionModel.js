const BaseModel = require('./BaseModel');

class PaymentTransactionModel extends BaseModel {
  static props = ['_id', 'transactionId', 'provider', 'serviceType', 'accountRef', 'amount', 'status', 'requestedBy', 'createdAt', 'settledAt'];

  constructor(data = {}) {
    super(data, PaymentTransactionModel.props);
  }

  static fromDocument(doc = {}) {
    return new PaymentTransactionModel(doc);
  }
}

module.exports = PaymentTransactionModel;
