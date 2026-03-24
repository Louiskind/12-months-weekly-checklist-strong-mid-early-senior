import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toCamelCase(),
    password: vine.string().minLength(8).maxLength(32).trim()
  })
)