import { DAO, genericDataObject } from "../../types";


export class MemoryDAO implements DAO {

    private data: { [key: string]: { [key: string]: any } } = {}
    constructor(_filePath: string) {
        console.debug('Memory DAO created');
    }
    public getCachedData() { return this.data }
    async pushData() { };
    async saveData<T = any>(tableName: string, id: string, data: genericDataObject | Awaited<T>): Promise<boolean> {
        const tempData = this.data[tableName] ?? {}
        const tempAll = this.data
        this.data = { ...tempAll, [tableName]: { ...tempData, [id]: data } }
        return true
    };
    async getDataByID<T = genericDataObject>(tableName: string, id: string): Promise<T | null> {
        return this.data[tableName]?.[id] ?? null;
    };
    async getAllIDs(tableName: string): Promise<string[]> {
        return Object.keys(this.data[tableName] ?? {})
    };
    async getAllData<T = genericDataObject>(tableName: string): Promise<T[]> {
        return Object.values(this.data?.[tableName] ?? {}) as T[]
    };
    async getFilteredData<T = genericDataObject>(tableName: string, filterFunction: (e: any) => boolean): Promise<T[] | Awaited<T>[]> {
        return (await this.getAllData<T>(tableName)).filter(filterFunction)

    };
    async deleteValues(tableName: string, id: string): Promise<boolean> {
        const tempData = this.data[tableName]
        const result = Object.keys(tempData).filter((e) => e !== id).reduce((p, c) => ({ ...p, [c]: tempData[c] }), {} as any)
        this.data[tableName] = result
        return true;
    };
    async clearTable(tableName: string): Promise<boolean> {
        this.data[tableName] = {};
        return true;
    };

}