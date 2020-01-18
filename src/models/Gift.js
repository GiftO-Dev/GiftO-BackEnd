module.exports = (sequelize, DataTypes) => {
  const Gift = sequelize.define('gift', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    from: {
      field: 'from',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    to: {
      field: 'to',
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    expire: {
      field: 'expire',
      type: DataTypes.DATE,
      allowNull: false,
    },
    accessId: {
      field: 'access_id',
      type: DataTypes.STRING(200),
      allowNull: false,
    }
  }, {
    tableName: 'gift',
    timestamps: false,
  });

  Gift.getById = (id) => Gift.findOne({
    where: {
      idx: id,
    }
  });

  Gift.getByAccessId = (access) => Gift.findOne({
    where: {
      accessId: access
    }
  });

  return Gift;
}