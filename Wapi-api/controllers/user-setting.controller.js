import UserSetting from '../models/user-setting.model.js';
import User from '../models/user.model.js';
import { Subscription, Setting } from '../models/index.js';


const checkUserSubscriptionStatus = async (userId, userRole = null) => {

  let effectiveUserId = userId;

  if (userRole === 'agent') {
    const agent = await User.findById(userId)
      .select('created_by')
      .lean();

    if (agent?.created_by) {
      effectiveUserId = agent.created_by;
    }
  }

  if (userRole === 'super_admin') {
    const subscription = await Subscription.findOne({
      user_id: effectiveUserId,
      deleted_at: null,
      status: { $in: ['active', 'trial'] },
      current_period_end: { $gte: new Date() },
    })
      .populate('plan_id')
      .lean();

    return {
      is_subscribed: !!subscription,
      subscription: subscription || null,
      is_free_trial: false,
      free_trial_days_remaining: 0,
      plan: subscription?.plan_id || null
    };
  }

  const subscription = await Subscription.findOne({
    user_id: effectiveUserId,
    deleted_at: null,
    status: { $in: ['active', 'trial'] }
  })
    .populate('plan_id')
    .lean();

  if (subscription && subscription.plan_id) {
    return {
      is_subscribed: true,
      subscription: subscription,
      plan: subscription.plan_id,
      is_free_trial: false,
      free_trial_days_remaining: 0,
    };
  }

  const adminSettings = await Setting.findOne()
    .select('free_trial_enabled free_trial_days')
    .lean();
    console.log("adminSettings", adminSettings?.free_trial_enabled);
  if (adminSettings?.free_trial_enabled && adminSettings?.free_trial_days > 0) {
    const user = await User.findById(effectiveUserId)
      .select('created_at')
      .lean();

    if (user?.created_at) {
      const daysSinceRegistration = Math.floor(
        (Date.now() - new Date(user.created_at).getTime()) /
        (1000 * 60 * 60 * 24)
      );
      console.log("daysSinceRegistration", daysSinceRegistration);
      if (daysSinceRegistration <= adminSettings.free_trial_days) {
        return {
          is_subscribed: true,
          is_free_trial: true,
          free_trial_days_remaining: Math.max(
            0,
            adminSettings.free_trial_days - daysSinceRegistration
          ),
          subscription: null,
          plan: null
        };
      }
    }
  }

  return {
    is_subscribed: false,
    subscription: null,
    is_free_trial: false,
    free_trial_days_remaining: 0,
    plan: null
  };
};


export const getUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    let userSettings = await UserSetting.findOne({ user_id: userId });

    if (!userSettings) {
      userSettings = await UserSetting.create({
        user_id: userId,
        ai_model: null,
        api_key: null
      });
    }

    const subscriptionStatus = await checkUserSubscriptionStatus(userId, req.user?.role);

    res.status(200).json({
      success: true,
      data: {
        ai_model: userSettings.ai_model,
        is_show_phone_no: userSettings.is_show_phone_no,
        api_key: userSettings.api_key,
        is_subscribed: subscriptionStatus.is_subscribed,
        // is_subscribed: true,
        is_free_trial: subscriptionStatus.is_free_trial,
        free_trial_days_remaining: subscriptionStatus.free_trial_days_remaining,
        features: subscriptionStatus.plan?.features || null,
      },
    });
  } catch (error) {
    console.error('Error getting user settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user settings',
      details: error.message
    });
  }
};


export const updateUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ai_model, api_key, is_show_phone_no } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let userSettings = await UserSetting.findOne({ user_id: userId });

    const normalizedAiModel =
      ai_model === '' || ai_model === undefined ? undefined : ai_model;

    if (userSettings) {
      if (normalizedAiModel !== undefined) userSettings.ai_model = normalizedAiModel;
      if (api_key !== undefined) userSettings.api_key = api_key;
      if (is_show_phone_no !== undefined)
        userSettings.is_show_phone_no = is_show_phone_no;

      await userSettings.save();
    } else {
      userSettings = await UserSetting.create({
        user_id: userId,
        ai_model: normalizedAiModel ?? null,
        api_key: api_key ?? null,
        is_show_phone_no: is_show_phone_no ?? false
      });
    }

    const subscriptionStatus = await checkUserSubscriptionStatus(
      userId,
      req.user?.role
    );

    res.status(200).json({
      success: true,
      message: 'User settings updated successfully',
      data: {
        ai_model: userSettings.ai_model ?? null,
        api_key: userSettings.api_key ?? null,
        is_subscribed: subscriptionStatus.is_subscribed,
        is_free_trial: subscriptionStatus.is_free_trial,
        free_trial_days_remaining:
          subscriptionStatus.free_trial_days_remaining
      }
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user settings',
      details: error.message
    });
  }
};

export default {
  getUserSettings,
  updateUserSettings
};
