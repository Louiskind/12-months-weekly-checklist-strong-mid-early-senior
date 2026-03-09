import vine, { SimpleMessagesProvider } from '@vinejs/vine'
 
export const createUserValidator = vine.compile(
  vine.object({
    userName: vine.string().trim().unique({ table: 'users', column: 'user_name'}),
    email: vine.string().email().normalizeEmail().unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8).maxLength(32),
    avatarUrl: vine.string().optional()
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    username: vine.string().optional(),
    email: vine.string().email().optional(),
    password: vine.string().optional(),
    avatarUrl: vine.string().optional(),
  })
)

const messages = {
  // Applicable for all fields
  'required': 'The {{ field }} field is required',
  'string': 'The value of {{ field }} field must be a string',
  'email': 'The value is not a valid email address',

  // Error message for the username field
  'username.required': 'Please choose a username for your account',
}

const fields = {
  username: 'user name',
  email: 'email',
  password: 'password'
}

vine.messagesProvider = new SimpleMessagesProvider(messages, fields)
