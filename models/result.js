'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  result.init({
    state: DataTypes.STRING,
    senator: DataTypes.STRING,
    party: DataTypes.STRING,
    order_elected: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'result',
  });
  return result;
};