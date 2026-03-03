const BaseModel = require('./BaseModel');

class CartModel extends BaseModel {
  static props = ['_id', 'userId', 'sessionId', 'items', 'limits', 'totalsSnapshot', 'expiresAt', 'updatedAt'];

  constructor(data = {}) {
    super(data, CartModel.props);
  }

  static fromDocument(doc = {}) {
    return new CartModel(doc);
  }
}

module.exports = CartModel;
