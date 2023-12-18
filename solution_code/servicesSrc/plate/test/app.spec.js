const { createApp } = require('../src/app');
const dbPoolMock = require('./__mocks__/db.mock').default;
const { mockValidatePlate,
    mockGetByDriverIds,
    mockGetByPlateIds,
    mockUpdate,
    mockAdd,
    mockRemove } = require('./__mocks__/modules.mock');
const request = require('supertest');
const mockLogger = require('./__mocks__/logger.mock').default;

// universal mock responses
const mockValidationError = 'some place error';

describe('CreateApp', () => {
    test('Did createApp succeed with listen function', async () => {
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    validatePlate: mockValidatePlate,
                    getByPlateIds: mockGetByPlateIds,
                    getByDriverIds: mockGetByDriverIds,
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

describe('Plate service Routes', () => {
    const mockAddRequest = {
        vin: "JH4NA21683T088489",
        Make_Id: "8359",
        Model_Id: 139,
        plateText: "TYUC0RP",
        driver_id: 86
    };
    // ADD route tests
    test('Add: plate/add should allow addition of valid plate', async () => {
        const mockValidatePlateData = [
            true
        ];
        const mockAddPlateData = [
            1, 12
        ]
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    validatePlate: mockValidatePlate(mockValidatePlateData),
                    add: mockAdd(mockAddPlateData),
                }
            });
        };
        // we expect one new plate added with the new ID passed back from addPlate mock(12)
        const expected = {
            Count: 1,
            Message: "Response returned successfully",
            SearchCriteria: null,
            Results: {
                id: 12
            }
        }
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/add')
            .set('Content-type', 'application/json')
            .send(mockAddRequest);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expected);
    })

    test('Add: plate/add should not allow addition of invalid plate', async () => {
        const mockValidatePlateData = [
            false,
            mockValidationError
        ];
        const mockAddPlateData = [
            1, 12
        ]
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    validatePlate: mockValidatePlate(mockValidatePlateData),
                    add: mockAdd(mockAddPlateData),
                }
            });
        };
        const expected = {
            Count: 0,
            Message: mockValidationError,
            SearchCriteria: null,
            Results: null
        }
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/add')
            .set('Content-type', 'application/json')
            .send(mockAddRequest);
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual(expected);
    })

    test('Add: plate/add should not allow addition of empty plate', async () => {
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock
            });
        };
        const expected = {
            Count: 0,
            Message: 'No Request Submitted',
            SearchCriteria: null,
            Results: null
        }
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/add')
            .set('Content-type', 'application/json')
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual(expected);
    })

    // Get route tests
    test('Get: plate/get should return plate information for driver', async () => {
        const mockGetByDriverIdsData = {
            2: [{
                driver_id: 2,
                id: 50,
                Make_Id: '678',
                Model_Id: 1234,
                planeText: 'someplate',
                vin: 'somevin'
            }],
            3: [{
                driver_id: 3,
                id: 51,
                Make_Id: '678',
                Model_Id: 1234,
                planeText: 'someplate',
                vin: 'somevin'
            },
            {
                driver_id: 3,
                id: 52,
                Make_Id: '679',
                Model_Id: 1244,
                planeText: 'someplate',
                vin: 'somevin'
            }]
        };
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    getByDriverIds: mockGetByDriverIds(mockGetByDriverIdsData)
                }
            });
        };
        // we expect one new plate added with the new ID passed back from addPlate mock(12)
        const expected = {
            Count: 3,
            Message: "Response returned successfully",
            SearchCriteria: null,
            Results: mockGetByDriverIdsData
        }
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/get')
            .set('Content-type', 'application/json')
            .send({
                driver_ids: [2, 3]
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expected);
    })

    test('Get: plate/get should return error if invalid plate data', async () => {
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    getByDriverIds: mockGetByDriverIds(null)
                }
            });
        };
        // we expect one new plate added with the new ID passed back from addPlate mock(12)
        const expected = {
            Count: 0,
            Message: "Invalid make requests",
            SearchCriteria: null,
            Results: null
        }
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/get')
            .set('Content-type', 'application/json')
            .send({
                driver_ids: [2, 3]
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expected);
    })

    test('Get: plate/get should return error if invalid driver data submitted', async () => {
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    getByDriverIds: mockGetByDriverIds(null)
                }
            });
        };
        // we expect one new plate added with the new ID passed back from addPlate mock(12)
        const expected = {
            Count: 0,
            Message: "No Driver ID's submitted or invalid submission",
            SearchCriteria: null,
            Results: null
        }
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/get')
            .set('Content-type', 'application/json')
            .send({
                driver_ids: null
            });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual(expected);
    })

    test('Get: plate/get should throw error is not driver data passed', async () => {
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock
            });
        };
        const expected = {
            Count: 0,
            Message: 'No Request Submitted',
            SearchCriteria: null,
            Results: null
        }
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/get')
            .set('Content-type', 'application/json')
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual(expected);
    })

    // Update route tests
    test('Get: plate/update should update plate if valid', async () => {
        const mockValidatePlateData = [
            true
        ];
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    validatePlate: mockValidatePlate(mockValidatePlateData),
                    update: mockUpdate(1)
                }
            });
        };
        const expected = {
            Count: 1,
            Message: 'Response returned successfully',
            SearchCriteria: null,
            Results: ""
        }
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/update')
            .set('Content-type', 'application/json')
            .send({
                Action: 'UPDATE',
                Plate: {
                    "id": 5,
                    "vin": "JH4NA21683T088489",
                    "Make_Id": "8359",
                    "Model_Id": 139,
                    "plateText": "TYUC0RP",
                    "driver_id": 86
                }
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expected);
    })

    test('Get: plate/update should remove plate if valid', async () => {
        const mockValidatePlateData = [
            true
        ];
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    validatePlate: mockValidatePlate(mockValidatePlateData),
                    remove: mockRemove(1)
                }
            });
        };
        const expected = {
            Count: 1,
            Message: 'Response returned successfully',
            SearchCriteria: null,
            Results: ""
        }
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/update')
            .set('Content-type', 'application/json')
            .send({
                Action: 'DELETE',
                Plate: {
                    "id": 5,
                    "vin": "JH4NA21683T088489",
                    "Make_Id": "8359",
                    "Model_Id": 139,
                    "plateText": "TYUC0RP",
                    "driver_id": 86
                }
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expected);
    })

    test('Get: plate/update should throw error is no action data passed', async () => {
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock
            });
        };
        const expected = {
            Count: 0,
            Message: 'No Action Submitted',
            SearchCriteria: null,
            Results: null
        }
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/update')
            .set('Content-type', 'application/json')
            .send({
                Plate: null
            });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual(expected);
    })

    test('Get: plate/update should throw error is no plate data passed', async () => {
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock
            });
        };
        const expected = {
            Count: 0,
            Message: 'Missing Plate Information',
            SearchCriteria: null,
            Results: null
        }
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/update')
            .set('Content-type', 'application/json')
            .send({
                Action: 'UPDATE'
            });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual(expected);
    })

    test('Get: plate/update should throw error if Delete and missing plate Id', async () => {
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock
            });
        };
        const expected = {
            Count: 0,
            Message: 'Missing Plate ID',
            SearchCriteria: null,
            Results: null
        }
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/update')
            .set('Content-type', 'application/json')
            .send({
                Action: 'DELETE',
                Plate: {
                    vin: 'testing no plate id'
                }
            });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual(expected);
    })

    test('Get: plate/update should throw error if invalid plate data', async () => {
        const mockValidatePlateData = [
            false,
            mockValidationError
        ];
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock,
                module: {
                    validatePlate: mockValidatePlate(mockValidatePlateData)
                }
            });
        };
        const expected = {
            Count: 0,
            Message: mockValidationError,
            SearchCriteria: null,
            Results: null
        };
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/update')
            .set('Content-type', 'application/json')
            .send({
                Action: 'UPDATE',
                Plate: {
                    id: '12'
                }
            });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual(expected);
    })

    test('Get: plate/update should throw error not update data provided', async () => {
        const mockDependencyService = () => {
            return Object.freeze({
                logger: mockLogger,
                db: dbPoolMock
            });
        };
        const expected = {
            Count: 0,
            Message: 'No Request Submitted',
            SearchCriteria: null,
            Results: null
        }
        const app = await createApp(mockDependencyService);

        const res = await request(app)
            .post('/api/plate/update')
            .set('Content-type', 'application/json')
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual(expected);
    })
})
