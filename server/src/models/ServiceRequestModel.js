const BaseModel = require('./BaseModel');

class ServiceRequestModel extends BaseModel {
  static props = ['_id', 'type', 'userId', 'payload', 'status', 'assignedTo', 'createdAt', 'updatedAt'];

  constructor(data = {}) {
    super(data, ServiceRequestModel.props);
  }

  static fromDocument(doc = {}) {
    return new ServiceRequestModel(doc);
  }
}

module.exports = ServiceRequestModel;
