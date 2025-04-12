const mongoose = require('mongoose');

const notificationsSchema = mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'recipientType',
        required: function () {
            return this.recipientType !== 'testadmin';
        }
    },
    recipientType: {
        type: String,
        required: true,
        enum: ['user-stas', 'testadmin'] 
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const notificationsModel = mongoose.model("Notifications", notificationsSchema);

module.exports = notificationsModel;
