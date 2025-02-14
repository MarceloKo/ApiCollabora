import { z } from "zod"
import { Readable } from "node:stream"
import { Either, makeLeft, makeRight } from "../utils/either"
import { InvalidFileFormat } from "./errors/invalid-file-format"
import { minioIntegration } from "../services/minio-service"




export async function getFile(path: string): Promise<Either<Error, null>> {


    // const path = `files/${fileName}`
    const file = await minioIntegration.getFile('collabora', path)
    console.log(file)

    return makeRight(null)
    // return makeRight({
    //     url,
    //     path: ''
    // })
}