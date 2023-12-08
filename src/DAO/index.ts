import { DAO, genericDataObject } from "./types";
import { deleteData, loadData, writeLocalFile } from "./writeLocalFiles";
import { PrismaClient } from '@prisma/client'

export class MemoryDAO implements DAO {

    private data: { [key: string]: { [key: string]: any } } = {}
    private writePath: string | undefined
    private fileName: string | undefined
    private prisma: PrismaClient | undefined
    constructor(filePath?: string, fileName?: string, databaseURL?: string,) {
        this.writePath = filePath
        this.fileName = fileName
        if (databaseURL) this.prisma = new PrismaClient({
            datasources: {
                db: {
                    url: databaseURL,
                },
            },
        })
        console.debug('Memory DAO created');
    }

    getCachedData() { return this.data }
    clearAllData() { this.data = {} }

    saveData<T = genericDataObject>(tableName: string, id: string, data: T): boolean {
        const tempData = this.data[tableName] ?? {}
        const tempAll = this.data
        this.data = { ...tempAll, [tableName]: { ...tempData, [id]: { id, ...data } } }
        return true
    };
    getDataByID<T = genericDataObject>(tableName: string, id: string): T {
        return this.data[tableName]?.[id] ?? null;
    };
    getAllIDs(tableName: string): string[] {
        return Object.keys(this.data[tableName] ?? {})
    };
    getAllData<T = genericDataObject>(tableName: string): T[] {
        return Object.values(this.data?.[tableName] ?? {}) as T[]
    };
    getFilteredData<T = genericDataObject>(tableName: string, filterFunction: (e: any) => boolean): T[] {
        return this.getAllData<T>(tableName).filter(filterFunction)

    };
    deleteValues(tableName: string, id: string): boolean {
        const tempData = this.data[tableName]
        const result = Object.keys(tempData).filter((e) => e !== id).reduce((p, c) => ({ ...p, [c]: tempData[c] }), {} as any)
        this.data[tableName] = result
        return true;
    };
    clearTable(tableName: string): boolean {
        this.data[tableName] = {};
        return true;
    };
    async writeLocal() {
        return await writeLocalFile(this.writePath ?? './', this.fileName ?? "DEFAULT", this.data)
    };
    async loadLocal() {
        this.data = await loadData(this.writePath ?? './', this.fileName ?? "DEFAULT")
        return true
    };
    async deleteLocalData() {
        await deleteData(this.writePath ?? "", this.fileName ?? "")
    }
    async pushPrisma() {
        const prisma = this.prisma
        if (prisma) {
            const cachedData = this.data
            const tableName = Object.keys(cachedData)
            const result = tableName.map(table =>
                Object.values(cachedData[table]).map(e =>
                    prisma.user.upsert({
                        where: { id: e.id },
                        create: e,
                        update: e
                    }))
            );
            const transaction = result.reduce((p, c) => [...p, ...c], [])
            await prisma.$transaction(transaction)
        }
        return true
    };
    async loadPrisma(tableNames: string[]) {
        const prisma = this.prisma;
        if (prisma) {
            const result = tableNames.map(async tableName => {
                try {
                    //@ts-ignore
                    const tempData: genericDataObject[] = await prisma[tableName].findMany({})
                    const transformDAta: { [key: string]: any } = tempData.reduce((p, c) => ({ ...p, [c.id]: c }), {})
                    this.data = { ...this.data, [tableName]: transformDAta }
                } catch (error) { }
            })
            await Promise.all(result)
        }
        return true
    };

    async clearPrisma(tableNames: string[]) {
        const prisma = this.prisma;
        if (prisma) {
            const result = tableNames.map(async tableName => {
                try {
                    //@ts-ignore
                    await prisma[tableName].deleteMany({})
                } catch (error) { }
            })
            await Promise.all(result)
        }
        return true
    }


}