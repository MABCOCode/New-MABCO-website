const BaseModel = require('./BaseModel');

class AssetModel extends BaseModel {
  static props = ['_id', 'storageKey', 'cdnUrl', 'variants', 'mimeType', 'size', 'width', 'height', 'alt'];

  constructor(data = {}) {
    super(data, AssetModel.props);
  }

  static fromDocument(doc = {}) {
    return new AssetModel(doc);
  }
}

module.exports = AssetModel;
