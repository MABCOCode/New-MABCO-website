const BaseModel = require('./BaseModel');

class ShowroomsReadModel extends BaseModel {
  static props = ['_id', 'locale', 'payload'];

  constructor(data = {}) {
    super(data, ShowroomsReadModel.props);
  }

  static fromDocument(doc = {}) {
    return new ShowroomsReadModel(doc);
  }
}

module.exports = ShowroomsReadModel;
