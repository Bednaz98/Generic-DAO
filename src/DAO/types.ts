export interface genericDataObject {
    //@ts-ignore
    id: string;
    [key: string]: string | number | boolean;
}

export interface DAO {
    saveData: <T = any>(tableName: string, id: string, data: genericDataObject | Awaited<T>) => Promise<boolean>
    getDataByID: <T = genericDataObject>(tableName: string, id: string) => Promise<T | null | Awaited<T>>
    getAllIDs: (tableName: string) => Promise<string[]>
    getAllData: <T = genericDataObject> (tableName: string) => Promise<T[] | Awaited<T>[]>
    getFilteredData: <T = genericDataObject> (tableName: string, filterFunction: (e: any) => boolean) => Promise<T[] | Awaited<T>[]>
    pushData: () => Promise<void>
    deleteValues: (tableName: string, id: string) => Promise<boolean>
    clearTable: (tableName: string) => Promise<boolean>
    getSaveDir?: () => string
}