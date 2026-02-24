import url from 'node:url'
import path from 'node:path'
import env from '#start/env'

/**
 * https://packages.adonisjs.com/packages/autoswagger
 */
export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
  tagIndex: 1,
  info: {
    title: env.get('APP_NAME'),
    version: '1.0.0',
    description: '12 Months Learning Module API - ',
    contact: {
      name: 'API Support',
      email: 'louiskskillset@gmail.com',
    },
    license: {
      name: 'MIT',
    },
  },
  snakeCase: false,
  debug: false,
  ignore: ['/api/swagger', '/api/docs'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {
      search: [
        {
          in: 'query',
          name: 'search',
          description: 'Search query',
          schema: { type: 'string' },
        },
      ],
      paginate: [
        {
          in: 'query',
          name: 'page',
          description: 'Page number',
          schema: { type: 'integer', example: 1 },
        },
        {
          in: 'query',
          name: 'perPage',
          description: 'Results per page',
          schema: { type: 'integer', example: 50 },
        },
      ],
      sortDate: [
        {
          in: 'query',
          name: 'sortBy',
          description: 'Sort by field',
          schema: {
            type: 'string',
            enum: ['createdAt', 'updatedAt', 'name', 'email'],
          },
        },
        {
          in: 'query',
          name: 'sortOrder',
          description: 'Sort order',
          schema: { type: 'string', enum: ['asc', 'desc'] },
        },
      ],
    },
    headers: {},
  },
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter your JWT token',
    },
  },
  authMiddlewares: ['auth'],
  defaultSecurityScheme: 'bearerAuth',
  persistAuthorization: true,
  showFullPath: false,
}
