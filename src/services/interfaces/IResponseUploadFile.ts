export interface IResponseUploadFile {
    "@odata.context": string
    "@microsoft.graph.downloadUrl": string
    createdDateTime: string
    eTag: string
    id: string
    lastModifiedDateTime: string
    name: string
    webUrl: string
    cTag: string
    size: number
    createdBy: CreatedBy
    lastModifiedBy: LastModifiedBy
    parentReference: ParentReference
    file: File
    fileSystemInfo: FileSystemInfo
    shared: Shared
}

export interface CreatedBy {
    application: Application
    user: User
}

export interface Application {
    id: string
    displayName: string
}

export interface User {
    displayName: string
}

export interface LastModifiedBy {
    application: Application2
    user: User2
}

export interface Application2 {
    id: string
    displayName: string
}

export interface User2 {
    displayName: string
}

export interface ParentReference {
    driveType: string
    driveId: string
    id: string
    name: string
    path: string
    siteId: string
}

export interface File {
    mimeType: string
    hashes: Hashes
}

export interface Hashes {
    quickXorHash: string
}

export interface FileSystemInfo {
    createdDateTime: string
    lastModifiedDateTime: string
}

export interface Shared {
    scope: string
}
