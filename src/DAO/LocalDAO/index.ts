import fs, { ensureDir } from "fs-extra"
import { MemoryDAO } from "../MemoryDAO";
import { DAO, genericDataObject } from "../../types";
import { deleteFile, getAllFileNames, getAllFiles, getFileData, writeLocalFile } from "./localDao-Utilties";

export class LocalDAO implements DAO {
    private filePath: string;
    private cache: MemoryDAO;
    constructor(filePath: string) {
        this.filePath = filePath;
        console.debug('Local DAO created');
        this.cache = new MemoryDAO(filePath)
    }
    async pushData() {
        try {
            const data = this.cache.getCachedData()
            const tableWrite = Object.keys(data).map(async (t) => {
                await ensureDir(t);
                const tableDataData = Object.keys(data[t]).map((e) => writeLocalFile(this.filePath, t, e, data[t][e]))
                return Promise.all(tableDataData);
            })
            await Promise.all(tableWrite)
        } catch (error) {
            console.error(error)
        }
    };
    public async saveData<T = any>(tableName: string, id: string, data: genericDataObject | Awaited<T>): Promise<boolean> {
        return await this.cache.saveData(tableName, id, data) as unknown as Promise<boolean>
    };
    public async getDataByID<T = genericDataObject>(tableName: string, id: string): Promise<T | null> {
        const cachedData = await this.cache.getDataByID<T>(tableName, id);
        if (!!cachedData) return cachedData
        const fetchDAta = await getFileData<T>(this.filePath, tableName, id);
        if (!(!!fetchDAta)) return null;
        await this.cache.saveData<T>(tableName, id, fetchDAta);
        return fetchDAta;

    };
    public async getAllData<T = genericDataObject>(tableName: string): Promise<T[]> {
        const cachedData = await this.cache.getAllData<T>(tableName)
        if (cachedData.length > 0) return cachedData;
        const fileNames = await this.getAllIDs(tableName)
        const files = await getAllFiles<T>(this.filePath, tableName, fileNames);
        //@ts-ignore
        const result = files.map((e: T) => this.cache.saveData(tableName, e.id, e));
        await Promise.all(result);
        return files;

    };
    public async getAllIDs(tableName: string): Promise<string[]> {
        const cached = await this.cache.getAllIDs(tableName)
        if (cached.length > 1) return cached;
        return await getAllFileNames(this.filePath, tableName);
    }
    public async getFilteredData<T = genericDataObject>(tableName: string, filterObject: (e: any) => boolean): Promise<T[]> {
        return (await this.getAllData<T>(tableName)).filter(filterObject)
    };
    public async deleteValues(tableName: string, id: string): Promise<boolean> {
        try {
            await this.cache.deleteValues(tableName, id)
            await deleteFile(this.filePath, tableName, id)
            return true
        } catch (error) {
            return false
        }
    };
    public async clearTable(tableName: string): Promise<boolean> {
        try {
            await this.cache.clearTable(tableName)
            await fs.remove(`${this.filePath}/${tableName}`)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    };
    public getCache() { return this.cache }

}