const BaseModel = require('./BaseModel');

class BrandModel extends BaseModel {
  static props = ['_id', 'brand_code', 'slug', 'name', 'cat_code', 'cat_codes', 'image', 'isActive', 'sortOrder', 'categoryIds'];

  constructor(data = {}) {
    super(data, BrandModel.props);
  }

  static fromDocument(doc = {}) {
    return new BrandModel(doc);
  }
}

module.exports = BrandModel;
