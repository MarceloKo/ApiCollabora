import { SafeParseSuccess, z } from "zod";

const enviromentValidate = z.object({
    MINIO_ENDPOINT: z.string(),
    MINIO_ACCESS_KEY: z.string(),
    MINIO_SECRET_KEY: z.string(),
})

type Enviroments = z.infer<typeof enviromentValidate>

const enviromentParse = enviromentValidate.safeParse(process.env)
if (!enviromentParse || !enviromentParse.success) { console.error('[🔥ERROR ENV ] Enviroment variables not valid', enviromentParse.error.message); process.exit(1) }

const enviroments = enviromentParse as SafeParseSuccess<Enviroments>
export { enviroments, enviromentValidate }