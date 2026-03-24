const BaseModel = require('./BaseModel');

class OrderModel extends BaseModel {
  static props = [
    '_id',
    'orderNumber',
    'userId',
    'customerSnapshot',
    'items',
    'pricing',
    'status',
    'statusHistory',
    'payment',
    'fulfillment',
    'addresses',
    'appliedOffersSnapshot',
    'invoiceNo',
    'inv_no',
    'lastEditedBy',
    'locale',
    'createdAt',
    'updatedAt',
  ];

  constructor(data = {}) {
    super(data, OrderModel.props);
  }

  static fromDocument(doc = {}) {
    return new OrderModel(doc);
  }
}

module.exports = OrderModel;
