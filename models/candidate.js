'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class candidate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  candidate.init({
    name: DataTypes.STRING,
    party: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'candidate',
  });
  return candidate;
};