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
                consumes: ['application/octet-stream'],
                tags: ['uploads'],
                params: z.object({ fileId: z.string() }),
            },

        },
        async (request, reply) => {
            try {
                console.log("[ FOI ] - uploadFileRoute")
                console.log(request)
                const { fileId } = request.params as { fileId: string }
                const uploadedFile = await request.body as Buffer;
                if (!uploadedFile) {
                    return reply.status(400).send('No file uploaded')
                }

                // const split = uploadedFile.filename.split('.')
                // const fileName = `${fileId}.${split[split.length - 1]}`
                // console.log(fileName)
                const fileName = `${fileId}.docx`

                await minioIntegration.sendFile('collabora', fileName, uploadedFile).then((res) => {
                    console.log(res)

                    return reply.status(200).send()
                }).catch((err) => {
                    console.log(err)
                    return reply.status(400).send()
                })

            }
            catch (error) {
                console.log(error)
            }
        }
    )
}