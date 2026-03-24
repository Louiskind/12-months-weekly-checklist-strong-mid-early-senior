import vine, { SimpleMessagesProvider } from '@vinejs/vine'
 
export const createUserValidator = vine.compile(
  vine.object({
    userName: vine.string().trim().unique({ table: 'users', column: 'user_name'}).trim(),
    email: vine.string().email().normalizeEmail().unique({ table: 'users', column: 'email' }).trim().toCamelCase(),
    password: vine.string().minLength(8).maxLength(32).trim(),
    avatarUrl: vine.string().trim().optional()
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
