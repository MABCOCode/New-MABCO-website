const BaseModel = require('./BaseModel');

class WebEventModel extends BaseModel {
  static props = ['_id', 'eventAt', 'meta', 'eventType', 'path', 'referrer', 'metadata'];

  constructor(data = {}) {
    super(data, WebEventModel.props);
  }

  static fromDocument(doc = {}) {
    return new WebEventModel(doc);
  }
}

module.exports = WebEventModel;
