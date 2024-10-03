const { Schema, model } = require("mongoose");
const notificationConfigSchema = new Schema(
  {
    guildId: {
      type: String,
      required: true,
    },
    notificationChannelId: {
      type: String,
      required: true,
    },
    ytChannelId: {
      type: String,
      required: true,
    },
    customMessage: {
      type: String,
      required: true,
    },
    lastChecked: {
      type: Date,
      required: true,
    },
    lastCheckedVid: {
      type: {
        id: {
          type: String,
          required: true,
        },
        publishDate: {
          type: Date,
          required: true,
        },
      },
      required: false,
    },
  },
  { timestamps: true }
);
module.exports = model("NotificationConfig", notificationConfigSchema);
