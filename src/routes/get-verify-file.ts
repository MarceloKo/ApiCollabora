import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { isRight, unwrapEither } from '../utils/either'
import { uploadFile } from '../functions/upload-file'
import { getFile } from '../functions/get-file'
import { minioIntegration } from '../services/minio-service'
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
                const { fileId } = request.params

                const fileName = `${fileId}.docx`
                const file = await minioIntegration.statObject('collabora', fileName)
                if (!file) return reply.status(404).send('')

                return reply.status(200).send({
                    BaseFileName: fileName,
                    Size: file.size,
                })
            }
            catch (error) {
                console.log(error)
            }
        }
    )
}