class BaseModel {
  constructor(data = {}, allowedProps = []) {
    if (!data || typeof data !== 'object') return;
    this.assign(data, allowedProps);
  }

  assign(data = {}, allowedProps = []) {
    if (!Array.isArray(allowedProps) || allowedProps.length === 0) {
      Object.assign(this, data);
      return;
    }

    for (const prop of allowedProps) {
      if (Object.prototype.hasOwnProperty.call(data, prop)) {
        this[prop] = data[prop];
      }
    }
  }

  toJSON() {
    return { ...this };
  }
}

module.exports = BaseModel;
