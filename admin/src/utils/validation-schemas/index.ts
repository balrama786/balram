import * as Yup from "yup";

export const languageSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  code: Yup.string().required("Code is required"),
  status: Yup.boolean(),
});

export const aiModelSchema = Yup.object().shape({
  displayName: Yup.string().required("Display name is required"),
  provider: Yup.string().required("Provider is required"),
  modelId: Yup.string().required("Model name is required"),
  apiEndpoint: Yup.string().url("Invalid URL"),
  description: Yup.string(),
  is_default: Yup.boolean(),
  responsePath: Yup.string().when("provider", {
    is: "custom",
    then: (schema) => schema.required("Response path is required for custom provider"),
    otherwise: (schema) => schema.optional(),
  }),
});
