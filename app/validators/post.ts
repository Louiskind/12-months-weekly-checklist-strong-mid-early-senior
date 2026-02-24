import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim()
  })
)

export const updatePostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().optional()
  })
)