const BaseModel = require('./BaseModel');

class CartEventModel extends BaseModel {
  static props = ['_id', 'eventAt', 'meta', 'productId', 'action', 'cartId', 'orderId', 'qty', 'priceSnapshot'];

  constructor(data = {}) {
    super(data, CartEventModel.props);
  }

  static fromDocument(doc = {}) {
    return new CartEventModel(doc);
  }
}

module.exports = CartEventModel;
