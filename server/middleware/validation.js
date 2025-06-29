import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^05\d{8}$/).required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const updateSchema = Joi.object({
  Full_Name: Joi.string().min(2).optional(),
  Email: Joi.string().email().optional(),
  Is_Manager: Joi.boolean().optional(),
});

export const deleteSchema = Joi.object({
  userId: Joi.number().integer().required(),
});

export const addOrderSchema = Joi.object({
  ccNumber: Joi.string().creditCard().required(),
  validity: Joi.string()
    .pattern(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)
    .required(),
  cvv: Joi.string().pattern(/^\d{3,4}$/).required(),
  date: Joi.date().required(),
  orderedBookIds: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
  total: Joi.number().positive().required(),
});

export const createCheckoutSessionSchema = Joi.object({
  orderedBookIds: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
});

export const addSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  email: Joi.string().email().required(),
  orderedBookIds: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
  stripeSessionId: Joi.string().required(),
  date: Joi.date().optional(),
});

export const updateOrderSchema = Joi.object({
  ccNumber: Joi.string().creditCard().optional(),
  validity: Joi.string()
    .pattern(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)
    .optional(),
  cvv: Joi.string().pattern(/^\d{3,4}$/).optional(),
  date: Joi.date().optional(),
}).min(1);

export const searchOrdersSchema = Joi.object({
  filterBy: Joi.string().valid("date", "total", "status").required(),
  value: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
});

export const getByUserIdSchema = Joi.object({
  User_Id: Joi.number().integer().positive().required()
});

export const getByUserIdAndBookIdSchema = Joi.object({
  bookId: Joi.number().integer().positive().required()
});

export const getBookPageImageSchema = Joi.object({
  bookId: Joi.number().integer().positive().required(),
  pageNum: Joi.number().integer().min(1).required()
});

export const addToLibrarySchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  orderId: Joi.number().integer().positive().required(),
  orderedBookIds: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
  Bookmark_On_Page: Joi.number().integer().min(0).required(),
});

export const updateLibrarySchema = Joi.object({
  User_Id: Joi.number().integer().positive().required(),
  Book_Id: Joi.number().integer().positive().required(),
  Purchase_Date: Joi.date().optional(),
  Bookmark_On_Page: Joi.number().integer().min(0).optional(),
});

export const deleteLibrarySchema = Joi.object({
  bookId: Joi.number().integer().positive().required(),
});

export const bookIdParamSchema = Joi.object({
  bookId: Joi.number().integer().positive().required(),
});

export const statusParamSchema = Joi.object({
  Status: Joi.string().valid('offered', 'approved', 'available', 'sold').required()
});

export const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
});

export const addBookSchema = Joi.object({
  Book_Name: Joi.string().min(2).required(),
  author: Joi.string().min(2).required(),
  number_Of_Page: Joi.number().integer().min(1).required(),
  Price: Joi.number().positive().required(),
  Category: Joi.string().min(2).required(),
  Note: Joi.string().allow('').optional(),
  Status: Joi.string().valid('offered', 'approved', 'available', 'sold').required(),
  Seller_Id: Joi.number().integer().positive().required(),
  Editing_Date: Joi.date().optional(),
});

export const updateBookSchema = Joi.object({
  Book_Name: Joi.string().min(2).optional(),
  author: Joi.string().min(2).optional(),
  number_Of_Page: Joi.number().integer().min(1).optional(),
  Price: Joi.number().positive().optional(),
  Category: Joi.string().min(2).optional(),
  Note: Joi.string().allow('').optional(),
  Status: Joi.string().valid('offered', 'approved', 'available', 'sold').optional(),
  Seller_Id: Joi.number().integer().positive().optional(),
  Editing_Date: Joi.date().optional(),
}).min(1);

export const commentIdParamSchema = Joi.object({
  commentId: Joi.number().integer().positive().required(),
});

export const bookIdParamSchemaForComments = Joi.object({
  bookId: Joi.number().integer().positive().required(),
});

export const addCommentSchema = Joi.object({
  bookId: Joi.number().integer().positive().required(),
  userId: Joi.number().integer().positive().required(),
  title: Joi.string().min(1).required(),
  content: Joi.string().min(1).required(),
  Created_At: Joi.date().optional(),
});

export const updateCommentSchema = Joi.object({
  comment_Name: Joi.string().optional(),
  author: Joi.string().optional(),
  number_Of_Page: Joi.number().integer().optional(),
  Price: Joi.number().optional(),
  Category: Joi.string().optional(),
  Note: Joi.string().optional(),
  Status: Joi.string().valid('offered', 'approved', 'available', 'sold').optional(),
  Seller_Id: Joi.number().integer().positive().optional(),
  Editing_Date: Joi.date().optional(),
}).min(1);
