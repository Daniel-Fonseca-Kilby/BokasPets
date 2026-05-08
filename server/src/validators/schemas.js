const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string().optional(),
  address: z.string().optional()
});

const dogSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  breed: z.string().min(2, 'Breed must be at least 2 characters long'),
  ageYears: z.number().nonnegative().max(25, 'Age cannot exceed 25 years'),
  ageMonths: z.number().nonnegative().max(11).optional().default(0),
  weightKg: z.number().positive().max(120, 'Weight cannot exceed 120kg'),
  activityLevel: z.enum(['bajo', 'moderado', 'alto']),
  allergies: z.array(z.string()).optional()
});

const orderSchema = z.object({
  items: z.array(z.object({
    name: z.string().min(1),
    price: z.number().positive(),
    qty: z.number().positive()
  })),
  totalPrice: z.number().positive()
});

module.exports = {
  registerSchema,
  dogSchema,
  orderSchema
};
