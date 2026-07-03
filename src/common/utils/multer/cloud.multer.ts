import multer from 'multer'
import { Request } from 'express'
import { randomUUID } from 'node:crypto'
import { resolve } from "node:path";
import { existsSync, mkdirSync } from 'node:fs'
import {Express} from 'multer'
import { fileFilter1 } from './multer.validation'
export enum StorageApproachEnum {
    Memory,
    Disk
}
export const fileFieldValidation={
    Image: ['image/jpeg','image/jpg','image/png']
    ,video:['video/mp4']
}
export const cloudFileUpload = function ({ 
    storageApproach = StorageApproachEnum.Memory,
    validation,
    maxSize = 2,
    folderName = "",
  }: { storageApproach?: StorageApproachEnum, validation?: string[] ,maxSize?:number, folderName?: string}) {
    const uploadPath = folderName
      ? resolve(process.cwd(), 'uploads', folderName)
      : resolve(process.cwd(), 'uploads');

    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true })
    }

    const storage = storageApproach === StorageApproachEnum.Memory ? multer.memoryStorage() : multer.diskStorage({
      destination: function (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) {
        callback(null, uploadPath)
      },
      filename: function (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) {

        const fileName = `${randomUUID()}__${file.originalname}`;
        callback(null, fileName)
      }
    })

    return multer({ fileFilter: fileFilter1(validation), storage, limits: { fileSize: 1024 * 1024 * maxSize } })
} 