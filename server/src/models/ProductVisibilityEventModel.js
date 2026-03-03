const BaseModel = require('./BaseModel');

class ProductVisibilityEventModel extends BaseModel {
  static props = ['_id', 'productId', 'action', 'actorUserId', 'actorRole', 'reason', 'createdAt'];

  constructor(data = {}) {
    super(data, ProductVisibilityEventModel.props);
  }

  static fromDocument(doc = {}) {
    return new ProductVisibilityEventModel(doc);
  }
}

module.exports = ProductVisibilityEventModel;
