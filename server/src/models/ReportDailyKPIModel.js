const BaseModel = require('./BaseModel');

class ReportDailyKPIModel extends BaseModel {
  static props = ['_id', 'date', 'traffic', 'sales', 'notifications', 'admin', 'products'];

  constructor(data = {}) {
    super(data, ReportDailyKPIModel.props);
  }

  static fromDocument(doc = {}) {
    return new ReportDailyKPIModel(doc);
  }
}

module.exports = ReportDailyKPIModel;
