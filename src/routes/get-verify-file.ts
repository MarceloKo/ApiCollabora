import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { minioIntegration } from '../services/minio-service'
import { S3Error } from 'minio'
export const getVerifyFileRoute: FastifyPluginAsyncZod = async server => {
    server.get(
        '/wopi/files/:fileId',
        {
            schema: {
                summary: 'Get files',
                tags: ['uploads'],
                params: z.object({ fileId: z.string() }),
            },
        },
        async (request, reply) => {
            try {
                console.log("[ GetVerifyFileRoute ] - START")
                const { fileId: filePath } = request.params

                let pathWithBucket = filePath.split('/')

                const bucket = pathWithBucket.shift()
                if (!bucket) return reply.status(400).send('Bucket invalid!')

                const path = pathWithBucket.join('/')
                if (!path) return reply.status(400).send('File name invalid!')

                const file = await minioIntegration.statObject('bucket', path)
                if (!file) return reply.status(404).send('Arquivo não encontrado')

                return reply.status(200).send({
                    BaseFileName: path.split('/').pop(),
                    Size: file.size,
                    UserCanWrite: true,
                })
            }
            catch (error) {
                console.log("[ GetVerifyFileRoute ] - ERROR", error)
                return reply.status(404).send('')
            }
        }
    )
}