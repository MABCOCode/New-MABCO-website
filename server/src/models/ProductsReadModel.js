const BaseModel = require('./BaseModel');

class ProductsReadModel extends BaseModel {
  static props = ['_id', 'productId', 'locale', 'payload'];

  constructor(data = {}) {
    super(data, ProductsReadModel.props);
  }

  static fromDocument(doc = {}) {
    return new ProductsReadModel(doc);
  }
}

module.exports = ProductsReadModel;
