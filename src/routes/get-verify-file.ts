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
                const { fileId } = request.params

                const fileName = `${fileId}.docx`
                const file = await minioIntegration.statObject('collabora', fileName)
                if (!file) return reply.status(404).send('Arquivo não encontrado')

                return reply.status(200).send({
                    BaseFileName: fileName,
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