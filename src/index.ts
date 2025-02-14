import { fastifyCors } from '@fastify/cors'
import { fastifyMultipart } from '@fastify/multipart'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
    hasZodFastifySchemaValidationErrors,
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod'
import { transformSwaggerSchema } from './utils/transform-swagger-schema'
import { uploadFileRoute } from './routes/upload-file'
import { getFileRoute } from './routes/get-file'
import { getVerifyFileRoute } from './routes/get-verify-file'
// import { getUploadsRoute } from './routes/get-uploads'
// import { exportUploadsRoute } from './routes/export-uploads'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)
server.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
        return reply.status(400).send({
            message: 'Validation error',
            issues: error.validation,
        })
    }

    console.error(error)
    return reply.status(500).send({ message: 'Internal server error.' })
})
server.register(fastifyCors, { origin: '*' })

server.register(fastifyMultipart)
server.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Upload Server',
            version: '1.0.0',
        },
    },
    transform: transformSwaggerSchema,
})
server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})


server.register(uploadFileRoute)
server.register(getFileRoute)
server.register(getVerifyFileRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log('HTTP Server running!')
    console.log('Swagger UI available at http://localhost:3333/docs')
})