const BaseModel = require('./BaseModel');

class OffersReadModel extends BaseModel {
  static props = ['_id', 'offerType', 'locale', 'payload'];

  constructor(data = {}) {
    super(data, OffersReadModel.props);
  }

  static fromDocument(doc = {}) {
    return new OffersReadModel(doc);
  }
}

module.exports = OffersReadModel;
