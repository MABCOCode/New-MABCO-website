const BaseModel = require('./BaseModel');

class NotificationModel extends BaseModel {
  static props = ['_id', 'type', 'title', 'message', 'recipientType', 'recipientQuery', 'recipientIds', 'channels', 'navigation', 'priority', 'status', 'scheduleAt', 'sentAt', 'createdBy', 'createdAt', 'metrics'];

  constructor(data = {}) {
    super(data, NotificationModel.props);
  }

  static fromDocument(doc = {}) {
    return new NotificationModel(doc);
  }
}

module.exports = NotificationModel;
