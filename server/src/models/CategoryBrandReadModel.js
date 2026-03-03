const BaseModel = require('./BaseModel');

class CategoryBrandReadModel extends BaseModel {
  static props = ['_id', 'categoryId', 'locale', 'payload'];

  constructor(data = {}) {
    super(data, CategoryBrandReadModel.props);
  }

  static fromDocument(doc = {}) {
    return new CategoryBrandReadModel(doc);
  }
}

module.exports = CategoryBrandReadModel;
