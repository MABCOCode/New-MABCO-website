const BaseModel = require('./BaseModel');

class AdminActionModel extends BaseModel {
  static props = ['_id', 'actorUserId', 'actorRole', 'actionType', 'targetType', 'targetId', 'changes', 'requestMeta', 'durationMs', 'status', 'note', 'createdAt'];

  constructor(data = {}) {
    super(data, AdminActionModel.props);
  }

  static fromDocument(doc = {}) {
    return new AdminActionModel(doc);
  }
}

module.exports = AdminActionModel;
