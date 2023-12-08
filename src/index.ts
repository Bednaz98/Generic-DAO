
import { MemoryDAO } from "./DAO";
import { DAO } from "./DAO/types"

export * from './DAO/types';
export enum DAOMode {
    memory,
    Local,
    Prisma,
}
export interface DAOConfig {
    filePath?: string,
    fileName?: string | undefined,
    databaseURL?: string
}
export const getDAO = (config: DAOConfig): DAO => {
    return new MemoryDAO(config.filePath, config.fileName, config.databaseURL)
}
