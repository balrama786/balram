import * as Yup from "yup";

export const registerSchema = Yup.object({
  fullName: Yup.string().min(2, "Name must be at least 2 characters").required("Full name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number")
    .required("Phone number is required"),
  country: Yup.string().min(2, "Country name must be at least 2 characters").required("Country is required"),
  country_code: Yup.string(),
  // password: Yup.string().min(8, "Password must be at least 8 characters").matches(/[a-z]/, "Password must contain at least one lowercase letter").matches(/[A-Z]/, "Password must contain at least one uppercase letter").matches(/[0-9]/, "Password must contain at least one number").required("Password is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const forgetPasswordSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

export const OTPVerificationSchema = Yup.object({
  otp: Yup.string().length(6, "OTP must be 6 digits").matches(/^\d+$/, "OTP must contain only numbers").required("OTP is required"),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const ManualConnectionSchema = Yup.object({
  phoneNumberId: Yup.string().required("Phone Number ID is required").matches(/^\d+$/, "Phone Number ID must contain only digits"),
  whatsappBusinessId: Yup.string().required("WhatsApp Business ID is required").matches(/^\d+$/, "WhatsApp Business ID must contain only digits"),
  appId: Yup.string().required("App ID is required").matches(/^\d+$/, "App ID must contain only digits"),
  registeredPhoneNumber: Yup.string()
    .required("Registered Phone Number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number with country code"),
  businessId: Yup.string().required("Business ID is required"),
  accessToken: Yup.string().required("Access Token is required"),
});

export const ColumnModalSchema = Yup.object().shape({
  label: Yup.string().required("Label is required"),
  type: Yup.string().required("Type is required"),
  options: Yup.array().when("type", {
    is: (val: string) => val?.toUpperCase() === "SELECT",
    then: (schema) => schema.min(1, "At least one option is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const ContactSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone_number: Yup.string()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email address").optional(),
  // assigned_to: Yup.string().optional(),
  status: Yup.string().optional(),
  tags: Yup.array().of(Yup.string()).optional(),
  allow_duplicate: Yup.boolean().optional(),
});

export const AgentSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().when("isEditing", {
    is: false,
    then: (schema) => schema.required("Password is required").min(6, "Password must be at least 6 characters"),
    otherwise: (schema) => schema.optional(),
  }),
  country_code: Yup.string().required("Country code is required"),
  phone: Yup.string().required("Phone is required"),
  note: Yup.string().optional(),
  status: Yup.boolean().default(true),
  is_phoneno_hide: Yup.boolean().default(false),
});
