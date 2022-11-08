const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(50),
          allowNull: true,
          unique: true,
        },
        name: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        provider: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        refreshToken: {
          type: Sequelize.TEXT,
          allowNull: true,
          defaultValue: "",
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
};
