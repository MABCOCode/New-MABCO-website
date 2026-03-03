const BaseModel = require('./BaseModel');

class ProductRevisionModel extends BaseModel {
  static props = ['_id', 'productId', 'version', 'snapshot', 'editedBy', 'editedAt', 'reason'];

  constructor(data = {}) {
    super(data, ProductRevisionModel.props);
  }

  static fromDocument(doc = {}) {
    return new ProductRevisionModel(doc);
  }
}

module.exports = ProductRevisionModel;
