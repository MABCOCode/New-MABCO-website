const BaseModel = require('./BaseModel');

class OfferModel extends BaseModel {
  static props = ['_id', 'code', 'type', 'titleEn', 'titleAr', 'descriptionEn', 'descriptionAr', 'discountType', 'discountValue', 'couponValue', 'eligibleProductIds', 'validityDays', 'freeProductId', 'discountPercentage', 'relatedProductIds', 'content', 'definition', 'scope', 'priority', 'window', 'isActive', 'createdAt'];

  constructor(data = {}) {
    super(data, OfferModel.props);
  }

  static fromDocument(doc = {}) {
    return new OfferModel(doc);
  }
}

module.exports = OfferModel;
