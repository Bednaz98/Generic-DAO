import fs from "fs-extra"
import { LocalDAO } from "./index";
import { genericDataObject } from "../types";

export function ensureDir(path: string) {
    return fs.ensureDirSync(path)
}

export async function writeLocalFile(path: string, tableName: string, id: string, data: genericDataObject): Promise<boolean> {
    try {
        const dir = `${path}/${tableName}`
        return await fs.ensureDir(dir).then(async () => {
            try {
                await fs.writeFile(`${dir}/${id}.json`, JSON.stringify(data));
                return true
            } catch (error) {
                //console.warn(error)
                return false
            }
        })

    } catch (error) {
        //console.warn(error)
        return false
    }
};

export async function getFileData<T = genericDataObject>(path: string, tableName: string, id: string): Promise<T | null> {
    try {
        return await fs.readJSON(`${path}/${tableName}/${id.replaceAll('.json', "")}.json`);
    } catch (error) {
        //console.warn(error)
        return null
    }
}


export async function getAllFiles<T = genericDataObject>(path: string, tableName: string, fileNames: string[]): Promise<T[]> {
    try {
        if (fileNames.length < 1) return [];
        const readFile = (e: string) => fs.readJSON(`${path}/${tableName}/${e.replaceAll('.json', "")}.json`)
        const writeFile = () => fileNames.map(readFile)
        const dataTemp = await fs.ensureDir(`${path}/${tableName}/`).then(writeFile)
        const resolveData = await Promise.all(dataTemp)
        return resolveData;
    } catch (error) {
        //console.warn(error)
        return []
    }
}

export async function getAllFileNames(path: string, tableName: string) {
    return (await fs.readdir(`${path}/${tableName}`)).map((e) => e.replaceAll(".json", ""))
}

export async function deleteFile(path: string, tableName: string, id: string) {
    return await fs.remove(`${path}/${tableName}/${id.replaceAll(".json", "")}.json`)
}
