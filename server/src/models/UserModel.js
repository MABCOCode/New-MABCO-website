const BaseModel = require('./BaseModel');

class UserModel extends BaseModel {
  static props = ['_id', 'email', 'phone', 'name', 'role', 'adminMeta', 'preferences', 'stats', 'createdAt', 'updatedAt'];

  constructor(data = {}) {
    super(data, UserModel.props);
  }

  static fromDocument(doc = {}) {
    return new UserModel(doc);
  }
}

module.exports = UserModel;
