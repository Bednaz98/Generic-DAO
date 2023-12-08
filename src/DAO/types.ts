export interface genericDataObject {
    //@ts-ignore
    id: string;
    [key: string]: string | number | boolean;
}

export interface DAO {
    saveData: <T = any>(tableName: string, id: string, data: genericDataObject | Awaited<T>) => boolean
    getDataByID: <T = genericDataObject>(tableName: string, id: string) => T | null
    getAllIDs: (tableName: string) => string[]
    getAllData: <T = genericDataObject> (tableName: string) => T[]
    getFilteredData: <T = genericDataObject> (tableName: string, filterFunction: (e: any) => boolean) => T[]
    deleteValues: (tableName: string, id: string) => boolean
    clearTable: (tableName: string) => boolean
    writeLocal: () => Promise<boolean>
    pushPrisma: () => Promise<boolean>
    loadLocal: () => Promise<Boolean>
    loadPrisma: (tableNames: string[]) => Promise<boolean>
}