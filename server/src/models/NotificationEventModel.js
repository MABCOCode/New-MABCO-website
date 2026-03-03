const BaseModel = require('./BaseModel');

class NotificationEventModel extends BaseModel {
  static props = ['_id', 'eventAt', 'meta', 'channel', 'eventType'];

  constructor(data = {}) {
    super(data, NotificationEventModel.props);
  }

  static fromDocument(doc = {}) {
    return new NotificationEventModel(doc);
  }
}

module.exports = NotificationEventModel;
