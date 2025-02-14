import { z } from "zod"
import { Readable } from "node:stream"
import { Either, makeLeft, makeRight } from "../utils/either"
import { InvalidFileFormat } from "./errors/invalid-file-format"
import { minioIntegration } from "../services/minio-service"


const uploadFileInput = z.object({
    fileName: z.string(),
    contentType: z.string(),
    contentStream: z.instanceof(Readable),
})
export type UploadFileInput = z.input<typeof uploadFileInput>

const allowedMimeTypes = ['application/pdf'];

export async function uploadFile(input: UploadFileInput): Promise<Either<Error, { path: string, url: string }>> {
    const { contentStream, contentType, fileName } = uploadFileInput.parse(input)

    // if (!allowedMimeTypes.includes(contentType)) {
    //     return makeLeft(new InvalidFileFormat())
    // }
    const path = `files/${fileName}`
    const { url } = await minioIntegration.sendFile('collabora', path, contentStream)


    return makeRight({
        url,
        path: ''
    })
}