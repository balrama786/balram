import mongoose from 'mongoose';

const userSettingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  ai_model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AIModel",
    default: null
  },
  is_show_phone_no: {
    type: Boolean,
    default: false
  },
  api_key: {
    type: String,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'user_settings'
});

// userSettingSchema.index({ user_id: 1 });

export default mongoose.model('UserSetting', userSettingSchema);
