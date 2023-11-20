import { DAOMode, getDAO } from '../src'
import { LocalDAO } from '../src/DAO/LocalDAO';


describe('testing Local DAO', () => {
    const DAO = getDAO('./testingDAO', DAOMode.Local) as LocalDAO;
    const tableName = 'DAOTest'
    const testPrefix = "test-"

    // it('test clear data', async () => {
    //     expect(await DAO.clearTable(tableName)).toBeTruthy()
    // })

    it('testing saving items', async () => {
        for (let i = 0; i < 10; i++) {
            expect(await DAO.saveData(tableName, `${testPrefix}${i}`, { data: i, boolCheck: !!(i % 2), stringCheck: `Q-${i}` })).toBeTruthy()
        }
    })
    it('pushData data', async () => {
        await DAO.pushData();
        expect(true).toBeTruthy()
    })
    it('test retrieving items', async () => {
        for (let i = 0; i < 10; i++) {
            expect(await DAO.getDataByID(tableName, `${testPrefix}${i}`)).toBeTruthy()
        }
        for (let i = 11; i < 20; i++) {
            expect(await DAO.getDataByID(tableName, `${testPrefix}${i}`)).toBeFalsy()
        }
    })
    it('test get all data', async () => {
        expect((await DAO.getAllData(tableName)).length).toBeGreaterThanOrEqual(10)
    })

    it('test getting ids', async () => {
        const result = await DAO.getAllIDs(tableName)
        expect(result.length).toBeGreaterThanOrEqual(10)
        result.forEach((e, i) => {
            expect(typeof e === "string").toBeTruthy()
            expect(e).toBe(`${testPrefix}${i}`)
        });
    })
    it('test filtering', async () => {
        expect((await DAO.getFilteredData(tableName,
            (e: any) => (e.stringCheck === 'Q-8')
        )).length).toBe(1);
        expect((await DAO.getFilteredData(tableName,
            (e: any) => (e.boolCheck)
        )).length).toBe(5);
        expect((await DAO.getFilteredData(tableName,
            (e: any) => (e.data > 4)
        )).length).toBe(5);
    })
    describe('testing no cached', () => {
        beforeEach(async () => {
            await DAO.getCache().clearTable(tableName)
        })

        it('testing saving items', async () => {
            for (let i = 0; i < 10; i++) {
                expect(await DAO.saveData(tableName, `${testPrefix}${i}`, { data: i })).toBeTruthy()
            }
        })
        it('test retrieving items', async () => {
            for (let i = 0; i < 10; i++) {
                expect(await DAO.getDataByID(tableName, `${testPrefix}${i}`)).toBeTruthy()
            }
        })
        it('test get all data', async () => {
            const data = await DAO.getAllData(tableName)
            expect(data.length).toBeGreaterThanOrEqual(10)
        })
        it('test getting ids', async () => {
            const result = await DAO.getAllIDs(tableName)
            expect(result.length).toBeGreaterThanOrEqual(10)
            result.forEach((e, i) => {
                expect(typeof e === "string").toBeTruthy()
                expect(e).toBe(`${testPrefix}${i}`)
            })
        })
        it('test clear data', async () => {
            expect(await DAO.clearTable(tableName)).toBeTruthy()
        })
    })


})