import { LocalDAO } from "./DAO/LocalDAO"
import { MemoryDAO } from "./DAO/MemoryDAO";
import { DAO } from "./types"






export enum DAOMode {
    memory,
    Local,
    GenericCache
}

export const getDAO = (filePath: string, mode: DAOMode): DAO => {
    let dao: DAO;
    switch (mode) {
        case DAOMode.memory: {
            dao = new MemoryDAO(filePath)
            break;
        }
        default: { dao = new LocalDAO(filePath); break }
    }
    return dao
}


export * from './types'