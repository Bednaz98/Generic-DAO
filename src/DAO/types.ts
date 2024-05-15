export interface genericDataObject {
    //@ts-ignore
    id: string;
    [key: string]: string | number | boolean;
}

export interface DAO {
    /** caches data in memory for future use*/
    saveData: <T = any>(tableName: string, id: string, data: genericDataObject | Awaited<T>) => boolean
    /** use an ID to get the data*/
    getDataByID: <T = genericDataObject>(tableName: string, id: string) => T | null
    /** returns all the data for a given table cached in memory*/
    getAllIDs: (tableName: string) => string[]
    /** returns all the data for a given table cached in memory*/
    getAllData: <T = genericDataObject> (tableName: string) => T[]
    /** returns all the data for a given table cached in memory while including a filter function*/
    getFilteredData: <T = genericDataObject> (tableName: string, filterFunction: (e: any) => boolean) => T[]
    /** delete an object in memory using an id*/
    deleteValues: (tableName: string, id: string) => boolean
    /** clears a tables memory*/
    clearTable: (tableName: string) => boolean
    /**  write the cache to a local file*/
    writeLocal: () => Promise<boolean>
    /** loads data from a local file*/
    loadLocal: () => Promise<Boolean>
    /** push data to prisma DB @todo */
    pushPrisma: () => Promise<boolean>
    /** loads data from prisma DB @todo */
    loadPrisma: (tableNames: string[]) => Promise<boolean>
}