module.exports = (sequelize, DataTypes) => {
  const GiftHint = sequelize.define('gift_hint', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    giftIdx: {
      field: 'gift_idx',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hint: {
      field: 'hint',
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  }, {
    tableName: 'gift_hint',
    timestamps: false,
  });

  GiftHint.findByGiftIdx = (giftIdx) => GiftHint.findAll({
    where: {
      giftIdx,
    }
  });

  return GiftHint;
};
