import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { isRight, unwrapEither } from '../utils/either'
import { uploadFile } from '../functions/upload-file'
import { minioIntegration } from '../services/minio-service'
export const uploadFileRoute: FastifyPluginAsyncZod = async server => {
    server.post(
        '/wopi/files/:fileId/contents',
        {
            schema: {
                summary: 'Upload files',
                consumes: ['multipart/form-data'],
                tags: ['uploads'],
                params: z.object({ fileId: z.string() }),
            },
        },
        async (request, reply) => {
            try {

                const { fileId } = request.params
                const uploadedFile = await request.file({
                    limits: {
                        fileSize: 1024 * 1024 * 20,

                    },
                })

                if (!uploadedFile) {
                    return reply.status(400)
                }

                const split = uploadedFile.filename.split('.')
                const fileName = `${fileId}.${split[split.length - 1]}`
                console.log(fileName)

                await minioIntegration.sendFile('collabora', fileName, uploadedFile.file).then((res) => {
                    reply.status(200)
                }).catch((err) => {
                    console.log(err)
                    reply.status(400)
                })

            }
            catch (error) {
                console.log(error)
            }
        }
    )
}