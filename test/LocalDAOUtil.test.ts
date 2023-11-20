
import fs from "fs-extra"
import { writeLocalFile, getFileData, getAllFiles, ensureDir } from "../src/DAO/LocalDAO/localDao-Utilties";


describe('testing utils', () => {

    const filePath = 'temp/DAOTest';
    const tableName = "testTable"

    afterAll(async () => {
        await fs.remove(`./${filePath}`)
    })
    it("writeLocalFile", async () => {
        for (let i = 0; i < 10; i++) {
            const testData = { id: `${i}`, "data": i }
            await writeLocalFile(filePath, tableName, `${i}`, testData).then(async () => {
                expect(await fs.exists(`${filePath}/${tableName}/${i}.json`)).toBeTruthy()
            })
        }

    })
    it("getFileData", async () => {
        for (let i = 0; i < 10; i++) {
            expect(!!(await getFileData(filePath, tableName, `${i}`))).toBeTruthy()
        }
        for (let i = 11; i < 20; i++) {
            expect(!!(await getFileData(filePath, tableName, `${i}`))).toBeFalsy()
        }


    })
    it('getAllFiles', async () => {
        const list = await getAllFiles(filePath, tableName, ["1.json", "2.json", "3.json", "4.json"])
        expect(list.length).toBeGreaterThanOrEqual(1)
    })
    it('ensureDir', () => {
        try {
            ensureDir("test")
        } catch (error) {

        }

    })

})