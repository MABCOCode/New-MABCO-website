const BaseModel = require('./BaseModel');

class OfferModel extends BaseModel {
  static props = ['_id', 'offer_no', 'offer_type', 'mainproductstk_code', 'discount', 'discount_type', 'title', 'title_ar', 'description', 'description_ar', 'products', 'start', 'end', 'is_active', 'createdAt'];

  constructor(data = {}) {
    super(data, OfferModel.props);
  }

  static fromDocument(doc = {}) {
    return new OfferModel(doc);
  }
}

module.exports = OfferModel;
