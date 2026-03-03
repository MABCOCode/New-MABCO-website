const BaseModel = require('./BaseModel');

class ProductModel extends BaseModel {
  static props = ['_id', 'stk_code', 'id', 'slug', 'name', 'nameAr', 'description', 'descriptionAr', 'price', 'image', 'category', 'categoryAr', 'cat_code', 'cat_codes', 'brand', 'brand_code', 'brand_codes', 'rating', 'reviews', 'badge', 'isMostSold', 'isNew', 'isHot', 'availability', 'colorVariants', 'chargeOptions', 'specs', 'inTheBox', 'offers', 'variants', 'status', 'audit', 'version'];

  constructor(data = {}) {
    super(data, ProductModel.props);
  }

  static fromDocument(doc = {}) {
    return new ProductModel(doc);
  }
}

module.exports = ProductModel;
