const BaseModel = require('./BaseModel');

class ProductDetailReadModel extends BaseModel {
  static props = ['_id', 'productId', 'locale', 'payload'];

  constructor(data = {}) {
    super(data, ProductDetailReadModel.props);
  }

  static fromDocument(doc = {}) {
    return new ProductDetailReadModel(doc);
  }
}

module.exports = ProductDetailReadModel;
