import vine from '@vinejs/vine'
 
export const createUserValidator = vine.compile(
  vine.object({
    username: vine.string(),
    email: vine.string().email(),
    password: vine.string(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    username: vine.string().optional(),
    email: vine.string().email().optional(),
    password: vine.string().optional(),
  })
)
