import vine from '@vinejs/vine'

export const updateUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().optional(),
    email: vine.string().email().trim().toCamelCase().optional(),
    password: vine.string().trim().optional(),
    avatarUrl: vine.string().trim().optional(),
  })
)