const BaseModel = require('./BaseModel');

class SiteContentModel extends BaseModel {
  static props = ['_id', 'key', 'locale', 'content'];

  constructor(data = {}) {
    super(data, SiteContentModel.props);
  }

  static fromDocument(doc = {}) {
    return new SiteContentModel(doc);
  }
}

module.exports = SiteContentModel;
