import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { minioIntegration } from '../services/minio-service'
import { S3Error } from 'minio'
export const getFileRoute: FastifyPluginAsyncZod = async server => {
    server.get(
        '/wopi/files/:fileId/contents',
        {
            schema: {
                summary: 'Get files',
                tags: ['uploads'],
                params: z.object({ fileId: z.string() }),
            },
        },
        async (request, reply) => {
            try {
                console.log("[ GetFileRoute ] - START")

                const { fileId } = request.params

                const fileName = `${fileId}.docx`


                const file = await minioIntegration.getFile('collabora', fileName)

                await new Promise((resolve, reject) => {
                    let chunks: Buffer[] = []
                    file.on('data', (chunk) => chunks.push(chunk))

                    file.on('end', async () => {
                        const concat = await Buffer.concat(chunks)

                        resolve(concat)
                        return reply.type("application/octet-stream").status(200).send(concat)
                    })

                    file.on('error', (err) => {
                        console.log(err)
                        reject()
                        return reply.status(400)
                    })
                })

            }
            catch (error) {
                console.log("[ GetFileRoute ] - ERROR", error)
                return reply.status(404).send('')
            }
        }
    )
}