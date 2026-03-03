const BaseModel = require('./BaseModel');

class CategoryModel extends BaseModel {
  static props = ['_id', 'cat_code', 'slug', 'name', 'iconName', 'sortOrder', 'isActive', 'seo', 'audit'];

  constructor(data = {}) {
    super(data, CategoryModel.props);
  }

  static fromDocument(doc = {}) {
    return new CategoryModel(doc);
  }
}

module.exports = CategoryModel;
