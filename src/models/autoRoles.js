const { model, Schema } = require("mongoose");

const autoRolesSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  roleId: {
    type: String,
    required: true,
  },
  //   roles: {
  //     type: Array,
  //     default: [],
  //     required: true,
  //   },
});
module.exports = model("AutoRoles", autoRolesSchema);
