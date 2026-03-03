const BaseModel = require('./BaseModel');

class FooterReadModel extends BaseModel {
  static props = ['_id', 'locale', 'payload'];

  constructor(data = {}) {
    super(data, FooterReadModel.props);
  }

  static fromDocument(doc = {}) {
    return new FooterReadModel(doc);
  }
}

module.exports = FooterReadModel;
