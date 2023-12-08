import fs from "fs-extra"

export function ensureDir(path: string) {
    return fs.ensureDirSync(path)
}

export async function writeLocalFile(filePath: string, fileName: string, data: any): Promise<boolean> {
    const dir = `${filePath}/${fileName}.json`
    try {
        return await fs.ensureDir(filePath).then(async () => {
            try {
                await fs.writeFile(dir, JSON.stringify(data));
                return true
            } catch (error) {
                console.warn(error)
                return false
            }
        })
    } catch (error) {
        console.warn(error)
        return false
    }
};
export async function loadData(filePath: string, fileName: string) {
    const dir = `${filePath}/${fileName}.json`
    try {
        return await fs.readJSON(dir)
    } catch (error) {
        console.warn(error)
        return null
    }
}
export async function deleteData(filePath: string, fileName: string) {
    const dir = `${filePath}/${fileName}.json`
    try {

        return await fs.remove(dir)
    } catch (error) {
        console.warn(error)
        return null
    }

}