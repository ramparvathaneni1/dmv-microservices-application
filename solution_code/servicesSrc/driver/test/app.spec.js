const { createApp } = require('../src/app');
const dbPoolMock = require('./__mocks__/db.mock').default;
const { mockGetList,
    mockGet,
    mockUpdate,
    mockAdd,
    mockRemove } = require('./__mocks__/modules.mock');
const request = require('supertest');
const mockLogger = require('./__mocks__/logger.mock').default;

describe('CreateApp', () => {
    test('Did createApp succeed with listen function', async () => {
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    getList: mockGetList,
                    get: mockGet,
                    update: mockUpdate,
                    add: mockAdd,
                    remove: mockRemove
                }
            });
        };
        const app = await createApp(mockDependencyService);
        expect(typeof app.listen).toEqual('function')
    })
})

// describe('Vehicle service Routes', () => {

//     test('GET: make/get returns 200', async () => {
//         const mockGetMakeData = [{
//             "make_id": 440,
//             "make_name": "ASTON MARTIN"
//         }];
//         const mockDependencyService = () => {
//             return Object.freeze({
//                 logger: mockLogger,
//                 db: dbPoolMock,
//                 module: {
//                     getMake: mockGetMake(mockGetMakeData)
//                 }
//             });
//         };
//         const app = await createApp(mockDependencyService);

//         const res = await request(app)
//             .post('/api/vehicle/make/get')
//             .set('Content-type', 'application/json');
//         expect(res.statusCode).toEqual(200);
//         expect(res.body.Results).toEqual(mockGetMakeData);
//         expect(res.body.Count).toEqual(mockGetMakeData.length);
//     });

//     test('GET: make/get returns 401 with no results', async () => {
//         const mockGetMakeData = [];
//         const mockDependencyService = () => {
//             return Object.freeze({
//                 logger: mockLogger,
//                 db: dbPoolMock,
//                 module: {
//                     getMake: mockGetMake(mockGetMakeData)
//                 }
//             });
//         };
//         const app = await createApp(mockDependencyService);

//         const res = await request(app)
//             .post('/api/vehicle/make/get')
//             .set('Content-type', 'application/json');
//         expect(res.statusCode).toEqual(401);
//         expect(res.body.Results).toEqual([]);
//         expect(res.body.Count).toEqual(0);
//     });

//     test('GET: model/get returns 200', async () => {
//         const mockGetModelData = [
//             { Make_ID: 1, Make_Name: 'test make', Model_ID: 1, Model_Name: 'test model' }
//         ];
//         const mockDependencyService = () => {
//             return Object.freeze({
//                 logger: mockLogger,
//                 db: dbPoolMock,
//                 module: {
//                     getModels: mockGetModels(mockGetModelData)
//                 }
//             });
//         };
//         const app = await createApp(mockDependencyService);

//         const res = await request(app)
//             .post('/api/vehicle/model/get')
//             .set('Content-type', 'application/json')
//             .send()
//         expect(res.statusCode).toEqual(200);
//         expect(res.body.Results).toEqual(mockGetModelData);
//         expect(res.body.Count).toEqual(mockGetModelData.length);
//     });

//     test('GET: model/get returns 401 with no results', async () => {
//         const mockGetModelData = [
//             { Make_ID: 1, Make_Name: 'test make', Model_ID: 1, Model_Name: 'test model' }
//         ];
//         const mockDependencyService = () => {
//             return Object.freeze({
//                 logger: mockLogger,
//                 db: dbPoolMock,
//                 module: {
//                     getModels: mockGetModels(mockGetModelData)
//                 }
//             });
//         };
//         const app = await createApp(mockDependencyService);

//         const res = await request(app)
//             .post('/api/vehicle/model/get')
//             .set('Content-type', 'application/json')
//             .send()
//         expect(res.statusCode).toEqual(200);
//         expect(res.body.Results).toEqual(mockGetModelData);
//         expect(res.body.Count).toEqual(mockGetModelData.length);
//     });
// })
