module.exports = function(sequelize, DataTypes) {
  const GiftPreference = sequelize.define("GiftPreference", {
    preference: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  GiftPreference.associate = function(models) {
    GiftPreference.belongsTo(models.Person, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return GiftPreference;
};
