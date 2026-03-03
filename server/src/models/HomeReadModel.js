const BaseModel = require('./BaseModel');

class HomeReadModel extends BaseModel {
  static props = ['_id', 'locale', 'payload'];

  constructor(data = {}) {
    super(data, HomeReadModel.props);
  }

  static fromDocument(doc = {}) {
    return new HomeReadModel(doc);
  }
}

module.exports = HomeReadModel;
