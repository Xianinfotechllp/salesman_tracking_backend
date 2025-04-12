const Joi = require("joi");

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(10).required(),
  confirmPassword: Joi.ref("password"), //matchpassword.
  address: {
    state: Joi.string().length(2).required(),
  },
});

const noteSchema = Joi.object({
  salesman: Joi.string().optional(),
  title: Joi.string().required(),
  note: Joi.string().required(),
});

const taskSchema = Joi.object({
  salesman: Joi.string().required(),
  taskDescription: Joi.string().required(),
  dueDate: Joi.date().required(),
  status: Joi.string()
    .valid("pending", "in-progress", "completed")
    .default("pending"),
});

const clientSchema = Joi.object({
  name: Joi.string().required(),
  companyName: Joi.string().required(),
  email: Joi.string().email().required(),
  contact: Joi.string().required(),
  address: Joi.string().required(),
  outstandingDue: Joi.number().optional(),
  ordersPlaced: Joi.number().optional(),
  salesmanId: Joi.string().required(),
  branches: Joi.array()
    .items(
      Joi.object({
        branchName: Joi.string().required(),
        location: Joi.object({
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
        }).required(),
      })
    )
    .optional(),
});

const attendanceValidationSchema = Joi.object({
  salesman: Joi.string().required(),
  // checkInTime: Joi.date().required(),
  // checkOutTime: Joi.date().optional(),
  location: Joi.string().required(),
  image: Joi.string().optional(),
});

const notificationsSchema = Joi.object({
  recipient: Joi.string().required(),
  recipientType: Joi.string().valid("user-stas", "testadmin").required(),
  message: Joi.string().trim().max(500).required(),
  isRead: Joi.boolean(),
});

const productValidationSchema = Joi.object({
  name: Joi.string().required().min(3).messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  price: Joi.number().required().greater(0).messages({
    "number.base": "Price must be a number",
    "number.greater": "Price must be greater than 0",
    "any.required": "Price is required",
  }),
  stock: Joi.number().required().integer().greater(0).messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.greater": "Stock must be greater than 0",
    "any.required": "Stock is required",
  }),
  image: Joi.string().optional(),
});

const collectionSchema = Joi.object({
  client: Joi.string().required(),
  salesman: Joi.string().required(),
  amount: Joi.number().required().min(0),
  outstandingDue: Joi.number().optional().min(1),
  date: Joi.date().required(),
});

const validateOrderSchema = Joi.object({
  salesmanId: Joi.string().required(),
  clientName: Joi.string().required(),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().required(),
      })
    )
    .required(),
  totalAmount: Joi.number().required(),
  status: Joi.string().valid("pending", "completed", "cancelled"),
});

const meetingValidationSchema = Joi.object({
  title: Joi.string().required(),
  salesman: Joi.string().required(),
  client: Joi.string().required(),
  dateTime: Joi.date().required(),
  locationType: Joi.string().valid("On-Site", "Virtual").required(),
  locationDetails: Joi.string().max(255).required(),
  fieldStaff: Joi.string().required(),
  agenda: Joi.string().max(500).required(),
  notes: Joi.string().max(500).optional(),
  attachment: Joi.string().optional(),
  repeatFrequency: Joi.string().optional(),
  followUpReminder: Joi.string().optional(),
});

const expenseSchema = Joi.object({
  salesman: Joi.string().required(),
  expenseType: Joi.string().required(),
  amount: Joi.number().required(),
  notes: Joi.string().required(),
  receiptURL: Joi.string().required(),
  status: Joi.string()
    .valid("pending", "cancelled", "completed")
    .default("pending"),
});

const updateExpenseSchema = expenseSchema.fork(
  ["expenseType", "amount", "notes", "receiptURL", "status"],
  (schema) => schema.optional()
);

const returnValidationSchema = Joi.object({
  salesman: Joi.string().required(),
  client: Joi.string().required(),
  product: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  reason: Joi.string(),
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),
});

const rewardsValidationSchema = Joi.object({
  rewardName: Joi.string().required(),
  description: Joi.string().optional(),
  pointsRequired: Joi.number().required().min(5),
  quantityAvailable: Joi.number().required().min(1),
  rewardImageURL: Joi.string().required(),
});

const redemptionSchema = Joi.object({
  userId: Joi.string().required(),
  rewardId: Joi.string().required(),
  pointsUsed: Joi.number().min(1).required(),
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),
});

const fieldStaffApiSchema = Joi.object({
  name: Joi.string().required().min(3),
  location: Joi.string().required(),
  email: Joi.string().required(),
  contact: Joi.number().required(),
});

exports.validateSignup = validator(signupSchema);
exports.validateNote = validator(noteSchema);
exports.validateTaskSchema = validator(taskSchema);
exports.validateClientSchema = validator(clientSchema);
exports.validateAttendanceSchema = validator(attendanceValidationSchema);
exports.validateNotificationSchema = validator(notificationsSchema);
exports.validationProductSchema = validator(productValidationSchema);
exports.validateCollectionSchema = validator(collectionSchema);
exports.validateOrderSchema = validator(validateOrderSchema);
exports.validateMeetingSchema = validator(meetingValidationSchema);
//expense
exports.validateExpenseSchema = validator(expenseSchema);
exports.validateUpdateExpenseSchema = validator(updateExpenseSchema);
//return
exports.validateReturnSchema = validator(returnValidationSchema);
//reward
exports.validateRewardsSchema = validator(rewardsValidationSchema);
exports.validateRewardRedemption = validator(redemptionSchema);
//fieldStaff
exports.validateFieldStaffSchema = validator(fieldStaffApiSchema);
