export class InvalidFileFormat extends Error {
    constructor() {
        super('Formato de arquivo não suportado!')
    }
}