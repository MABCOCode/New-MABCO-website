const BaseModel = require('./BaseModel');

class ShowroomModel extends BaseModel {
  static props = ['_id', 'code', 'name', 'city', 'address', 'phone', 'location', 'hours', 'services', 'isActive'];

  constructor(data = {}) {
    super(data, ShowroomModel.props);
  }

  static fromDocument(doc = {}) {
    return new ShowroomModel(doc);
  }
}

module.exports = ShowroomModel;
