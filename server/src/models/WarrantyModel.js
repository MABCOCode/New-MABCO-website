const BaseModel = require('./BaseModel');

class WarrantyModel extends BaseModel {
  static props = ['_id', 'serialNumber', 'imei', 'userId', 'productId', 'purchaseOrderId', 'coverageType', 'startsAt', 'endsAt', 'claimsUsed', 'maxClaims', 'isActive'];

  constructor(data = {}) {
    super(data, WarrantyModel.props);
  }

  static fromDocument(doc = {}) {
    return new WarrantyModel(doc);
  }
}

module.exports = WarrantyModel;
