import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
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
                console.log("[ UploadFileRoute ] - START")

                const { fileId: filePath } = request.params as { fileId: string }
                const uploadedFile = await request.body as Buffer;
                if (!uploadedFile) {
                    return reply.status(400).send('No file uploaded')
                }

                let pathWithBucket = filePath.split('/')

                const bucket = pathWithBucket.shift()
                if (!bucket) return reply.status(400).send('Bucket invalid!')

                const path = pathWithBucket.join('/')
                if (!path) return reply.status(400).send('File name invalid!')

                await minioIntegration.sendFile(bucket, path, uploadedFile).then((res) => {
                    console.log("[ UploadFileRoute ] - File uploaded")

                    return reply.status(200).send()
                }).catch((err) => {
                    console.log(err)
                    return reply.status(400).send()
                })

            }
            catch (error) {
                console.log("[ UploadFileRoute ] - ERROR", error)
                return reply.status(404).send('')
            }
        }
    )
}