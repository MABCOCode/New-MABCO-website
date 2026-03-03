const BaseModel = require('./BaseModel');

class SavedSpecTitleModel extends BaseModel {
  static props = ['_id', 'name', 'icon', 'usageCount', 'category', 'nameEnNormalized', 'status', 'audit'];

  constructor(data = {}) {
    super(data, SavedSpecTitleModel.props);
  }

  static fromDocument(doc = {}) {
    return new SavedSpecTitleModel(doc);
  }
}

module.exports = SavedSpecTitleModel;
