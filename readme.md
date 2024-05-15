# Generic DAO

This project creates a DAO (Database access object) that can be extended and use for multiple projects. The root design resolves around an object that holds data in memory. When needed, a push function can be called to commit the current data in memory to the database. Currently, this project on supports writing to a local file in a json format. In the future, this will be expected to include the option to use Prisma to write the data in memory to any datable supported by prisma.

The DAO interface is designed to connect SQL concepts to the function calls. The DAO tries to cache data in memory similar to a SQL table. In Memory the object created has a top level key that relates to the table that would be present in a SQL database. from there all rows are stored as key value pairs in one large nested object. The data structure looks as follows:

```JavaScript
{
    "tableName":{
        "row0":{/*nested data*/},
        "row2":{/*nested data*/},
        "row3":{/*nested data*/},
        //...
        "rowN":{/*nested data*/},
    }
}
```


## Usage

Initialization in project

``` TypeScript
import {MemoryDAO} from "@jabz/generic-dao";
const dao = new MemoryDAO();

const tableName = "tablename"
const id ="rowId"
const saveData = {/*any data object*/}
dao.saveData(tableName, id, saveData)

```


The following interface is supported:
``` TypeScript
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
```