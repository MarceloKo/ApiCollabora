import * as Minio from 'minio'
import { Readable } from 'node:stream'
import { enviroments } from '../utils/enviroment-validate'

class MinioIntegration {
    private minioClient: Minio.Client

    constructor() {
        const data = {
            endPoint: enviroments.data.MINIO_ENDPOINT,
            useSSL: true,
            accessKey: enviroments.data.MINIO_ACCESS_KEY,
            secretKey: enviroments.data.MINIO_SECRET_KEY,
        }
        this.minioClient = new Minio.Client(data)



    }

    public async sendFile(bucket: string, objectName: string, file: Readable): Promise<{ url: string }> {
        if (!this.minioClient) throw new Error('Minio client not initialized')


        const sendedBuffer = await this.minioClient.putObject(bucket, objectName, file).catch(error => {
            console.error(error)
            return null
        })
        if (!sendedBuffer) throw new Error('Ocorreu um erro ao enviar arquivo.')
        console.log({ sendedBuffer })
        const url = `https://${enviroments.data.MINIO_ENDPOINT}/${bucket}/${objectName}`
        return { url }
    }

    public async getFile(bucket: string, objectName: string): Promise<Readable> {
        if (!this.minioClient) throw new Error('Minio client not initialized')
        return this.minioClient.getObject(bucket, objectName)
    }

    public async statObject(bucket: string, objectName: string): Promise<Minio.BucketItemStat> {
        if (!this.minioClient) throw new Error('Minio client not initialized')
        return this.minioClient.statObject(bucket, objectName)
    }
}

export const minioIntegration = new MinioIntegration()