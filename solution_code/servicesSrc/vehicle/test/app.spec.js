const { createApp } = require('../src/app');
const dbPoolMock = require('./__mocks__/db.mock').default;
const { mockGetMake, mockGetModels } = require('./__mocks__/modules.mock');
const request = require('supertest');
const mockLogger = require('./__mocks__/logger.mock').default;

// used in bad unit test example
// const sinon = require('sinon');
// const axios = require('axios');

describe('CreateApp', () => {
    test('Did createApp succeed with listen function', async () => {
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    getMake: mockGetMake,
                    getModels: mockGetModels 
                }
            });
        };
        const app = await createApp(mockDependencyService);
        expect(typeof app.listen).toEqual('function')
    })
})

// describe('How not to write a unit test: Vehicle service', () => {
//     /**
//      * This is a typical example of writing unit tests after you've written your code. You are
//      * tempted to account for all external concerns such at external http requests and database queries
//      * all in the same test, even though you were only looking to test just the routes on your service,
//      * we basically created a messy functional test when we really wanted a unit test.  
//      *  */ 
//     test('GET: model/get returns 200', async () => {
//         const mockQueryData = [{
//             test: "test"
//         }];
//         const _mockDb = dbPoolMock({
//             mockQueryValues: {
//                 mockReturn: mockQueryData
//             },
//             mockExecuteValues: {
//                 mockReturn: mockQueryData
//             }
//         })
//         const axiosMock = sinon.stub(axios, "get").resolves({
//             data: {
//                 Results: [
//                     { Make_ID: 1, Make_Name: 'test make', Model_ID: 1, Model_Name: 'test model' },
//                     { Make_ID: 474, Make_Name: 'test make', Model_ID: 2, Model_Name: 'test model' }]
//             }
//         });

//         const body  = {
//             Make_ID: ['474'] // honda's makeId
//         };
//         const mockDependencyService = () => {
//             return Object.freeze({
//                 logger: mockLogger,
//                 db: _mockDb
//             });
//         };
//         const app = await createApp(mockDependencyService);

//         const res = await request(app)
//             .post('/api/vehicle/model/get')
//             .set('Content-type', 'application/json')
//             .send(body);
//         expect(res.statusCode).toEqual(200);
//         expect(res.body.Results).toEqual(mockQueryData);
//         expect(res.body.Count).toEqual(mockQueryData.length);
//     })
// })



describe('Vehicle service Routes', () => {

    test('GET: make/get returns 200', async () => {
        const mockGetMakeData = [{
            "make_id": 440,
            "make_name": "ASTON MARTIN"
        }];
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    getMake: mockGetMake(mockGetMakeData)
                }
            });
        };
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/vehicle/make/get')
            .set('Content-type', 'application/json');
        expect(res.statusCode).toEqual(200);
        expect(res.body.Results).toEqual(mockGetMakeData);
        expect(res.body.Count).toEqual(mockGetMakeData.length);
    });

    test('GET: make/get returns 401 with no results', async () => {
        const mockGetMakeData = [];
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    getMake: mockGetMake(mockGetMakeData)
                }
            });
        };
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/vehicle/make/get')
            .set('Content-type', 'application/json');
        expect(res.statusCode).toEqual(401);
        expect(res.body.Results).toEqual([]);
        expect(res.body.Count).toEqual(0);
    });

    test('GET: model/get returns 200', async () => {
        const mockGetModelData = [
            { Make_ID: 1, Make_Name: 'test make', Model_ID: 1, Model_Name: 'test model' }
        ];
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    getModels: mockGetModels(mockGetModelData)
                }
            });
        };
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/vehicle/model/get')
            .set('Content-type', 'application/json')
            .send()
        expect(res.statusCode).toEqual(200);
        expect(res.body.Results).toEqual(mockGetModelData);
        expect(res.body.Count).toEqual(mockGetModelData.length);
    });

    test('GET: model/get returns 401 with no results', async () => {
        const mockGetModelData = [
            { Make_ID: 1, Make_Name: 'test make', Model_ID: 1, Model_Name: 'test model' }
        ];
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    getModels: mockGetModels(mockGetModelData)
                }
            });
        };
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/vehicle/model/get')
            .set('Content-type', 'application/json')
            .send()
        expect(res.statusCode).toEqual(200);
        expect(res.body.Results).toEqual(mockGetModelData);
        expect(res.body.Count).toEqual(mockGetModelData.length);
    });
})
