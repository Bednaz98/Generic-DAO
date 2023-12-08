import { DAOConfig, getDAO } from '../src'
import { MemoryDAO } from '../src/DAO';


describe('testing Local DAO', () => {
    const DAO = getDAO({}) as MemoryDAO;
    const tableName = 'user'
    const testPrefix = "test-"

    it('testing saving items', () => {
        for (let i = 0; i < 10; i++) {
            expect(DAO.saveData(tableName, `${testPrefix}${i}`, { number: i, boolCheck: !!(i % 2), stringCheck: `Q-${i}` })).toBeTruthy()
        }
    })
    it('test retrieving items', () => {
        for (let i = 0; i < 10; i++) {
            expect(DAO.getDataByID(tableName, `${testPrefix}${i}`)).toBeTruthy()
        }
        for (let i = 11; i < 20; i++) {
            expect(DAO.getDataByID(tableName, `${testPrefix}${i}`)).toBeFalsy()
        }
    })
    it('test get all data', () => {
        expect((DAO.getAllData(tableName)).length).toBeGreaterThanOrEqual(10)
    })
    it('test getting ids', () => {
        const result = DAO.getAllIDs(tableName)
        expect(result.length).toBeGreaterThanOrEqual(10)
        result.forEach((e, i) => {
            expect(typeof e === "string").toBeTruthy()
            expect(e).toBe(`${testPrefix}${i}`)
        });
    })
    it('test filtering', () => {
        expect((DAO.getFilteredData(tableName,
            (e: any) => (e.stringCheck === 'Q-8')
        )).length).toBe(1);
        expect((DAO.getFilteredData(tableName,
            (e: any) => (e.boolCheck)
        )).length).toBe(5);
        expect((DAO.getFilteredData(tableName,
            (e: any) => (e.number > 4)
        )).length).toBe(5);
    })
    it("test local write", async () => {
        const config: DAOConfig = {
            filePath: './testingDAO',
            fileName: "DEFAULT",
        }
        const DAO = getDAO(config) as MemoryDAO;
        for (let i = 0; i < 10; i++) {
            DAO.saveData(tableName, `${testPrefix}${i}`, { number: i, boolCheck: !!(i % 2), stringCheck: `Q-${i}` })
        }
        await DAO.writeLocal().then(async () => {
            const currentData = JSON.stringify(DAO.getCachedData())
            DAO.clearAllData()
            await DAO.loadLocal().then(async () => {
                expect(currentData).toEqual(JSON.stringify(DAO.getCachedData()));
                await DAO.deleteLocalData()
            })
        })
    })

    //test locally for prisma
    // it("test prisma write", async () => {
    //     const config: DAOConfig = {
    //         databaseURL: process.env["GENERIC_DATABASE_DATABASE_URL"]
    //     }
    //     const DAOWrite = getDAO(config) as MemoryDAO;
    //     for (let i = 0; i < 10; i++) {
    //         DAOWrite.saveData(tableName, `${testPrefix}${i}`, { number: i, boolCheck: !!(i % 2), stringCheck: `Q-${i}` })
    //     }
    //     const initData = DAOWrite.getCachedData();
    //     const pushData = async () => {
    //         await DAOWrite.pushPrisma();
    //         return true;

    //     }
    //     const clearData = async () => { DAOWrite.clearAllData(); return true };
    //     const loadData = async () => await DAOWrite.loadPrisma([tableName]);
    //     const verifyData = () => {
    //         const loadData = DAOWrite.getCachedData();
    //         expect(JSON.stringify(loadData)).toEqual(JSON.stringify(initData));
    //     }
    //     const pushResult = await pushData()
    //     if (pushResult) {
    //         const resultClear = await clearData()
    //         if (resultClear) {
    //             expect(DAOWrite.getCachedData()).toEqual({});
    //             const loadResult = await loadData();
    //             if (loadResult) {
    //                 verifyData();
    //                 DAOWrite.clearPrisma([tableName])
    //                 return;
    //             }

    //         }
    //     };
    //     //failed condition
    //     expect(false).toBe(true);
    // });
})