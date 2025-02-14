import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { isRight, unwrapEither } from '../utils/either'
import { uploadFile } from '../functions/upload-file'
import { minioIntegration } from '../services/minio-service'
export const uploadFileRoute: FastifyPluginAsyncZod = async server => {
    server.post(
        '/wopi/files/:fileId/contents',
        // {
        //     schema: {
        //         summary: 'Upload files',
        //         tags: ['uploads'],
        //         params: z.object({ fileId: z.string() }),
        //     },
        // },
        async (request, reply) => {
            try {
                console.log("uploadFileRoute")
                const { fileId } = request.params as { fileId: string }
                const uploadedFile = await request.file()
                console.log(uploadedFile)
                if (!uploadedFile) {
                    return reply.status(400)
                }

                const split = uploadedFile.filename.split('.')
                const fileName = `${fileId}.${split[split.length - 1]}`
                console.log(fileName)

                await minioIntegration.sendFile('collabora', fileName, uploadedFile.file).then((res) => {
                    console.log(res)

                    return reply.status(200)
                }).catch((err) => {
                    console.log(err)
                    return reply.status(400)
                })

            }
            catch (error) {
                console.log(error)
            }
        }
    )
}