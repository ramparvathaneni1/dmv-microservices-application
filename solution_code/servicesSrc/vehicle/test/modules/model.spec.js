const dbPoolMock = require('../__mocks__/db.mock').default;
const { getModels } = require('../../src/modules/model');
const mockLogger = require('../__mocks__/logger.mock').default;

const sinon = require('sinon');
const axios = require('axios');

const mockQueryData = [{
    Make_ID: "474",
    Make_Name: "HONDA",
    Model_ID: 1861,
    Model_Name: "Accord"
},
{
    Make_ID: "474",
    Make_Name: "HONDA",
    Model_ID: 3420,
    Model_Name: "CBR250"
}];

describe('Module: GetModels', () => {

    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    test('GetModels: When fetching models by make will return 2 models', async () => {
        const _mockDb = dbPoolMock({
            mockQueryValues: {
                mockReturn: mockQueryData
            },
            mockExecuteValues: {
                mockReturn: mockQueryData
            }
        })
        const axiosMock = sandbox.stub(axios, "get").resolves({
            data: {
                Results: [
                    mockQueryData[0],
                    mockQueryData[1]
                ]
            }
        });

        const actual = await getModels(['474'], {
            logger: mockLogger,
            db: _mockDb
        })

        expect(actual).toEqual([
            mockQueryData[0],
            mockQueryData[1]
        ]);
        expect(axiosMock.calledOnce).toBeTruthy();
    })

    test('GetModels: When fetching model by make but no models returned from nhtsa, will return whats in database', async () => {
        const _mockDb = dbPoolMock({
            mockQueryValues: {
                mockReturn: mockQueryData
            },
            mockExecuteValues: {
                mockReturn: mockQueryData
            }
        })
        const axiosMock = sandbox.stub(axios, "get").resolves({
            data: {
                Results: []
            }
        });

        const actual = await getModels(['474'], {
            logger: mockLogger,
            db: _mockDb
        })

        expect(actual).toEqual([
            mockQueryData[0],
            mockQueryData[1]
        ]);
        expect(axiosMock.calledOnce).toBeTruthy();
    })

    test('GetModels: When fetching models by make that aren\'t in db, will fetch and add to db', async () => {
        const _mockDb = dbPoolMock({
            mockQueryValues: {
                mockReturn: mockQueryData
            },
            mockExecuteValues: {
                mockReturn: mockQueryData
            }
        })
        const axiosMock = sandbox.stub(axios, "get").resolves({
            data: {
                Results: [
                    mockQueryData[0],
                    mockQueryData[1]
                ]
            }
        });

        const actual = await getModels(['474'], {
            logger: mockLogger,
            db: _mockDb
        })

        expect(actual).toEqual([
            mockQueryData[0],
            mockQueryData[1]
        ]);
        expect(axiosMock.calledOnce).toBeTruthy();
    })
})
