import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import config from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = process.env.NODE_ENV || 'development';
const envConfig = config[env];

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || envConfig.mongoUri;
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

import User from './user.model.js';
import OTPLog from './otp-log.model.js';
import Session from './session.model.js';
import Setting from './setting.model.js';
import Faq from './faq.model.js';
import ContactInquiry from './contact-inquiries.model.js';
import Testimonial from './testimonial.model.js';
import Message from './message.model.js';
import ContactTag from './contact-tag.model.js';
import ChatNote from './chat-note.model.js';
import Plan from './plan.model.js';
import Subscription from './subscription.model.js';
import { PaymentHistory } from './payment-history.model.js';
import AIModel from './ai-model.model.js';
import WhatsappConnection from './whatsapp-connections.model.js';
import WhatsappWaba from './whatsapp-waba.model.js';
import WhatsappPhoneNumber from './whatsapp-phone-number.model.js';
import AgentTask from './agent-task.model.js';
import AutomationFlow from './automation-flow.model.js';
import AutomationExecution from './automation-execution.model.js';
import ChatAssignment from './chat-assignment.model.js';
import Template from './template.model.js';
import Webhook from './webhook.model.js';
import Contact from './contact.model.js';
import CustomField from './custom-field.model.js';
import Tag from './tag.model.js';
import Attachment from './attachment.model.js';
import Campaign from './campaign.model.js';
import UserSetting from './user-setting.model.js';
import EcommerceCatalog from './ecommerce-catalog.model.js';
import EcommerceProduct from './ecommerce-product.model.js';
import EcommerceOrder from './ecommerce-order.model.js';
import EcommerceOrderStatusTemplate from './ecommerce-order-status-template.model.js';
import LandingPage from './landing-page.model.js';
import ApiKey from './api-key.model.js';
import Widget from './widget.model.js';
import ShortLink from './short-link.model.js';
import ImportJob from './import-job.model.js';
import ReplyMaterial from './reply-material.model.js';
import WorkingHours from './working-hours.model.js';
import Workspace from './workspace.model.js';
import Sequence from './sequence.model.js';
import SequenceStep from './sequence-step.model.js';
import WabaConfiguration from './waba-configuration.model.js';
import Chatbot from './chatbot.model.js';
import MessageBot from './message-bot.model.js';



const db = {
  User,
  OTPLog,
  Session,
  Setting,
  Faq,
  ContactInquiry,
  Testimonial,
  Message,
  ContactTag,
  ChatNote,
  WhatsappConnection,
  WhatsappWaba,
  WhatsappPhoneNumber,
  Plan,
  Subscription,
  PaymentHistory,
  AIModel,
  AgentTask,
  AutomationFlow,
  AutomationExecution,
  ChatAssignment,
  Template,
  Webhook,
  Contact,
  CustomField,
  Tag,
  Attachment,
  Campaign,
  UserSetting,
  EcommerceCatalog,
  EcommerceProduct,
  EcommerceOrder,
  EcommerceOrderStatusTemplate,
  LandingPage,
  ApiKey,
  Widget,
  ShortLink,
  ImportJob,
  ReplyMaterial,
  WorkingHours,
  Workspace,
  Sequence,
  SequenceStep,
  WabaConfiguration,
  Chatbot,
  MessageBot,
  mongoose,


  connectDB
};

export default db;
export {
  User, OTPLog, Session, Setting, Faq, ContactInquiry, Testimonial, Message, ContactTag, ChatNote, WhatsappConnection,
  WhatsappWaba,
  WhatsappPhoneNumber,
  Chatbot,
  MessageBot,
  Plan, Template, Webhook, Subscription, PaymentHistory, AIModel, AgentTask, AutomationFlow, AutomationExecution, ChatAssignment, Contact, CustomField, Tag, Attachment, Campaign, UserSetting, EcommerceCatalog, EcommerceProduct, EcommerceOrder, EcommerceOrderStatusTemplate, LandingPage, ApiKey, Widget, ShortLink, ImportJob, ReplyMaterial, WorkingHours, Workspace, Sequence, SequenceStep, WabaConfiguration, connectDB


};
