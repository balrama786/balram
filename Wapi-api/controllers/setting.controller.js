import Stripe from 'stripe';
import Razorpay from 'razorpay';
import path from 'path';
import nodemailer from 'nodemailer';
import Setting from '../models/setting.model.js';
import { updateEnvFile } from '../utils/env-file.js';

const STRIPE_WEBHOOK_EVENTS = [
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.subscription.trial_will_end',
  'checkout.session.completed'
];

const getAllSettings = async (req, res) => {
  const settings = await Setting.findOne();
  if (!settings) {
    return res.status(200).json({});
  }
  const out = settings.toObject ? settings.toObject() : { ...settings };

  const logoFields = ['favicon_url', 'logo_light_url', 'logo_dark_url', 'sidebar_light_logo_url', 'sidebar_dark_logo_url'];
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;

  for (const field of logoFields) {
    if (out[field] && out[field].startsWith('/uploads/') && !isValidUrl(out[field])) {
      out[field] = `${baseUrl}${out[field]}`;
    }
  }

  if (settings.whatsapp_webhook_url) {
    out.whatsapp_webhook_url = settings.whatsapp_webhook_url;
  }

  out.whatsapp_verify_token = process.env.WHATSAPP_VERIFY_TOKEN || '';
  out.smtp_host = process.env.SMTP_HOST || '';
  out.smtp_port = process.env.SMTP_PORT || '';
  out.smtp_user = process.env.SMTP_USER || '';
  out.smtp_pass_set = !!process.env.SMTP_PASS;
  out.mail_from_name = process.env.MAIL_FROM_NAME || '';
  out.mail_from_email = process.env.MAIL_FROM_EMAIL || '';
  out.support_email = process.env.SUPPORT_EMAIL || '';
  out.maintenance_mode = process.env.MAINTENANCE_MODE === 'true';

  delete out.stripe_secret_key;
  delete out.stripe_webhook_secret;
  delete out.razorpay_key_secret;
  delete out.razorpay_webhook_secret;
  res.status(200).json(out);
};

const updateSetting = async (req, res) => {
  try {
    let setting = await Setting.findOne();

    const processedBody = { ...req.body };

    const logoFields = ['favicon_url', 'logo_light_url', 'logo_dark_url', 'sidebar_light_logo_url', 'sidebar_dark_logo_url'];

    for (const field of logoFields) {
      const uploadedFile = req.files && req.files[field] ? req.files[field] : null;

      if (uploadedFile) {
        const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
        if (file) {
          processedBody[field] = `/${file.path}`;
        }
      }
      else if (req.body[field] && isValidUrl(req.body[field])) {
        processedBody[field] = req.body[field];
      }
      else if (req.body[field] === '' || req.body[field] === null) {
        processedBody[field] = '';
      }
    }

    const envVars = {};

    if (req.body.whatsapp_verify_token !== undefined) {
      envVars.WHATSAPP_VERIFY_TOKEN = req.body.whatsapp_verify_token;
      delete processedBody.whatsapp_verify_token;
    }

    if (req.body.smtp_host !== undefined) {
      envVars.SMTP_HOST = req.body.smtp_host;
      delete processedBody.smtp_host;
    }
    if (req.body.smtp_port !== undefined) {
      envVars.SMTP_PORT = req.body.smtp_port;
      delete processedBody.smtp_port;
    }
    if (req.body.smtp_user !== undefined) {
      envVars.SMTP_USER = req.body.smtp_user;
      delete processedBody.smtp_user;
    }
    if (req.body.smtp_pass !== undefined) {
      envVars.SMTP_PASS = req.body.smtp_pass;
      delete processedBody.smtp_pass;
    }
    if (req.body.mail_from_name !== undefined) {
      envVars.MAIL_FROM_NAME = req.body.mail_from_name;
      delete processedBody.mail_from_name;
    }
    if (req.body.mail_from_email !== undefined) {
      envVars.MAIL_FROM_EMAIL = req.body.mail_from_email;
      delete processedBody.mail_from_email;
    }
    if (req.body.support_email !== undefined) {
      envVars.SUPPORT_EMAIL = req.body.support_email;
      delete processedBody.support_email;
    }

    if (req.body.maintenance_mode !== undefined) {
      envVars.MAINTENANCE_MODE = String(req.body.maintenance_mode);
      processedBody.maintenance_mode = req.body.maintenance_mode === true || req.body.maintenance_mode === 'true';
    }

    if (req.body.maintenance_allowed_ips !== undefined) {
      if (typeof req.body.maintenance_allowed_ips === 'string') {
        try {
          processedBody.maintenance_allowed_ips = JSON.parse(req.body.maintenance_allowed_ips);
        } catch {
          processedBody.maintenance_allowed_ips = req.body.maintenance_allowed_ips
            .split(',')
            .map(item => item.trim())
            .filter(item => item);
        }
      } else {
        processedBody.maintenance_allowed_ips = req.body.maintenance_allowed_ips;
      }
    }

    if (req.body.allowed_file_upload_types !== undefined) {
      if (typeof req.body.allowed_file_upload_types === 'string') {
        try {
          processedBody.allowed_file_upload_types = JSON.parse(req.body.allowed_file_upload_types);
        } catch {
          processedBody.allowed_file_upload_types = req.body.allowed_file_upload_types
            .split(',')
            .map(item => item.trim())
            .filter(item => item);
        }
      } else {
        processedBody.allowed_file_upload_types = req.body.allowed_file_upload_types;
      }
    }

    if (setting) {
      const updatedSetting = await Setting.findByIdAndUpdate(setting._id, processedBody, {
        new: true,
        runValidators: true,
      });
      setting = updatedSetting;
    } else {
      setting = await Setting.create(processedBody);
    }

    if (Object.keys(envVars).length > 0) {
      for (const [key, value] of Object.entries(envVars)) {
        process.env[key] = value;
      }

      await updateEnvFile(envVars);
    }

    res.status(200).json(setting);
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}


const testMail = async (req, res) => {
  try {
    const {
      to,
      smtp_host,
      smtp_port,
      smtp_user,
      smtp_pass,
      mail_from_name,
      mail_from_email
    } = req.body;

    if (!to || typeof to !== 'string' || !to.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email (to) is required'
      });
    }

    const toEmail = to.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipient email address'
      });
    }

    const host = (smtp_host != null && String(smtp_host).trim()) ? String(smtp_host).trim() : (process.env.SMTP_HOST || '');
    const port = (smtp_port != null && smtp_port !== '') ? parseInt(smtp_port, 10) : (parseInt(process.env.SMTP_PORT, 10) || 587);
    const user = (smtp_user != null && String(smtp_user).trim()) ? String(smtp_user).trim() : (process.env.SMTP_USER || '');
    const pass = (smtp_pass != null) ? String(smtp_pass) : (process.env.SMTP_PASS || '');
    const fromName = (mail_from_name != null && String(mail_from_name).trim()) ? String(mail_from_name).trim() : (process.env.MAIL_FROM_NAME || 'WhatsDesk');
    const fromEmail = (mail_from_email != null && String(mail_from_email).trim()) ? String(mail_from_email).trim() : (process.env.MAIL_FROM_EMAIL || user);

    if (!host || !user || !pass) {
      return res.status(400).json({
        success: false,
        message: 'SMTP host, user, and password are required (from request body or existing settings)'
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number.isNaN(port) ? 587 : port,
      secure: port === 465,
      auth: { user, pass }
    });

    const from = `${fromName} <${fromEmail}>`;
    await transporter.sendMail({
      from,
      to: toEmail,
      subject: 'WhatsDesk – Test email',
      html: '<p>This is a test email from your WhatsDesk mail settings. If you received this, your SMTP configuration is working.</p>'
    });

    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      data: { to: toEmail }
    });
  } catch (err) {
    console.error('Error sending test mail:', err);
    const message = err.code === 'EAUTH' ? 'SMTP authentication failed. Check host, port, user and password.' : (err.message || 'Failed to send test email');
    return res.status(400).json({
      success: false,
      message
    });
  }
};


const updateStripeSettings = async (req, res) => {
  try {
    const { stripe_publishable_key, stripe_secret_key } = req.body;

    if (!stripe_secret_key || typeof stripe_secret_key !== 'string' || !stripe_secret_key.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Stripe secret key is required'
      });
    }

    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const webhookUrl = `${baseUrl.replace(/\/$/, '')}/api/webhook/stripe`;

    const stripe = new Stripe(stripe_secret_key.trim());

    const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
    for (const ep of endpoints.data) {
      if (ep.url === webhookUrl) {
        await stripe.webhookEndpoints.del(ep.id);
      }
    }

    const endpoint = await stripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: STRIPE_WEBHOOK_EVENTS,
      description: 'WhatsDesk subscription and checkout events'
    });

    const webhookSecret = endpoint.secret;
    if (!webhookSecret) {
      return res.status(500).json({
        success: false,
        message: 'Stripe did not return a webhook signing secret'
      });
    }

    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }

    const update = {
      stripe_secret_key: stripe_secret_key.trim(),
      stripe_webhook_secret: webhookSecret,
      is_stripe_active: req.body.is_stripe_active,
      ...(stripe_publishable_key != null && stripe_publishable_key !== ''
        ? { stripe_publishable_key: stripe_publishable_key.trim() }
        : {})
    };

    const updatedSetting = await Setting.findByIdAndUpdate(
      setting._id,
      update,
      { new: true, runValidators: true }
    );

    process.env.STRIPE_SECRET_KEY = updatedSetting.stripe_secret_key;
    process.env.STRIPE_PUBLISHABLE_KEY = updatedSetting.stripe_publishable_key || '';
    process.env.STRIPE_WEBHOOK_SECRET = updatedSetting.stripe_webhook_secret;

    const envVars = {
      STRIPE_SECRET_KEY: updatedSetting.stripe_secret_key,
      STRIPE_PUBLISHABLE_KEY: updatedSetting.stripe_publishable_key || '',
      STRIPE_WEBHOOK_SECRET: updatedSetting.stripe_webhook_secret
    };
    await updateEnvFile(envVars);

    const response = updatedSetting.toObject();

    response.stripe_secret_key = stripe_secret_key.trim();

    response.stripe_webhook_secret = webhookSecret;
    response.webhook_url = webhookUrl;
    response.is_stripe_active = updatedSetting.is_stripe_active;
    return res.status(200).json({
      success: true,
      message: 'Stripe keys and webhook configured successfully',
      data: response
    });
  } catch (err) {
    console.error('Error updating Stripe settings:', err);
    const message = err.type === 'StripeInvalidRequestError'
      ? (err.message || 'Invalid Stripe key or request')
      : 'Failed to configure Stripe';
    return res.status(400).json({
      success: false,
      message
    });
  }
};


const getStripeSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne().select('stripe_publishable_key stripe_secret_key stripe_webhook_secret').lean();
    if (!setting) {
      return res.status(200).json({ data: null });
    }
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const webhookUrl = `${baseUrl.replace(/\/$/, '')}/api/webhook/stripe`;
    return res.status(200).json({
      data: {
        stripe_publishable_key: setting.stripe_publishable_key || null,
        stripe_secret_key: setting.stripe_secret_key,
        stripe_webhook_secret: setting.stripe_webhook_secret,
        is_stripe_active: (setting.is_stripe_active || false),
        webhook_url: webhookUrl
      }
    });
  } catch (err) {
    console.error('Error getting Stripe settings:', err);
    return res.status(500).json({ success: false, message: 'Failed to get Stripe settings' });
  }
};


const updateRazorpaySettings = async (req, res) => {
  try {
    const { razorpay_key_id, razorpay_key_secret, razorpay_webhook_secret } = req.body;

    if (!razorpay_key_id || typeof razorpay_key_id !== 'string' || !razorpay_key_id.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay key ID is required'
      });
    }
    if (!razorpay_key_secret || typeof razorpay_key_secret !== 'string' || !razorpay_key_secret.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay key secret is required'
      });
    }

    const rp = new Razorpay({
      key_id: razorpay_key_id.trim(),
      key_secret: razorpay_key_secret.trim()
    });
    try {
      await rp.plans.all({ count: 1 });
    } catch (apiErr) {
      const msg = apiErr.error?.description || apiErr.description || apiErr.message || 'Invalid Razorpay keys';
      return res.status(400).json({
        success: false,
        message: msg
      });
    }

    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const webhookUrl = `${baseUrl.replace(/\/$/, '')}/api/webhook/razorpay`;

    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }

    const update = {
      razorpay_key_id: razorpay_key_id.trim(),
      razorpay_key_secret: razorpay_key_secret.trim(),
      is_razorpay_active: req.body.is_razorpay_active,
      ...(razorpay_webhook_secret != null && razorpay_webhook_secret !== ''
        ? { razorpay_webhook_secret: razorpay_webhook_secret.trim() }
        : {})
    };

    const updatedSetting = await Setting.findByIdAndUpdate(
      setting._id,
      update,
      { new: true, runValidators: true }
    );

    process.env.RAZORPAY_KEY_ID = updatedSetting.razorpay_key_id;
    process.env.RAZORPAY_KEY_SECRET = updatedSetting.razorpay_key_secret;
    process.env.RAZORPAY_WEBHOOK_SECRET = updatedSetting.razorpay_webhook_secret || '';

    const envVars = {
      RAZORPAY_KEY_ID: updatedSetting.razorpay_key_id,
      RAZORPAY_KEY_SECRET: updatedSetting.razorpay_key_secret,
      RAZORPAY_WEBHOOK_SECRET: updatedSetting.razorpay_webhook_secret || ''
    };
    await updateEnvFile(envVars);

    const response = updatedSetting.toObject();
    delete response.razorpay_key_secret;
    delete response.razorpay_webhook_secret;
    response.razorpay_key_secret_set = true;
    response.razorpay_webhook_secret_set = !!(updatedSetting.razorpay_webhook_secret);
    response.webhook_url = webhookUrl;
    response.is_razorpay_active = updatedSetting.is_razorpay_active;

    return res.status(200).json({
      success: true,
      message: 'Razorpay keys configured successfully. Add the webhook URL in Razorpay Dashboard (Settings > Webhooks) and paste the Webhook Secret here if you have not already.',
      data: response
    });
  } catch (err) {
    console.error('Error updating Razorpay settings:', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'Failed to configure Razorpay'
    });
  }
};

const getRazorpaySettings = async (req, res) => {
  try {
    const setting = await Setting.findOne().select('razorpay_key_id razorpay_key_secret razorpay_webhook_secret').lean();
    if (!setting) {
      return res.status(200).json({ data: null });
    }
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const webhookUrl = `${baseUrl.replace(/\/$/, '')}/api/webhook/razorpay`;
    return res.status(200).json({
      data: {
        razorpay_key_id: setting.razorpay_key_id || null,
        razorpay_key_secret_set: setting.razorpay_key_secret,
        razorpay_webhook_secret_set: setting.razorpay_webhook_secret,
        is_razorpay_active: (setting.is_razorpay_active || false),
        webhook_url: webhookUrl
      }
    });
  } catch (err) {
    console.error('Error getting Razorpay settings:', err);
    return res.status(500).json({ success: false, message: 'Failed to get Razorpay settings' });
  }
};

export { getAllSettings, updateSetting, testMail, updateStripeSettings, getStripeSettings, updateRazorpaySettings, getRazorpaySettings };
