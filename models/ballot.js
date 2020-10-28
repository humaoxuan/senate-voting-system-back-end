'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ballot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ballot.init({
    type: DataTypes.STRING,
    preferences: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ballot',
  });
  return ballot;
};