const BaseModel = require('./BaseModel');

class MaintenanceTicketModel extends BaseModel {
  static props = ['_id', 'ticketNumber', 'serialNumber', 'userId', 'productSnapshot', 'statusCode', 'statusLabel', 'timeline', 'technicianId', 'receivedAt', 'eta', 'closedAt', 'updatedAt'];

  constructor(data = {}) {
    super(data, MaintenanceTicketModel.props);
  }

  static fromDocument(doc = {}) {
    return new MaintenanceTicketModel(doc);
  }
}

module.exports = MaintenanceTicketModel;
