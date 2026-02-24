import vine from '@vinejs/vine'

export const createCommentValidator = vine.compile(
  vine.object({
    content: vine.string().trim(),
    postId: vine.number()
  })
)

export const updateCommentValidator = vine.compile(
  vine.object({
    content: vine.string().trim().optional(),
    postId: vine.number().optional()
  })
)