const dbPoolMock = require('../__mocks__/db.mock').default;
const { getMake } = require('../../src/modules/make');
const mockLogger = require('../__mocks__/logger.mock').default;

describe('Module: GetMake', () => {
    test('GetMake: When fetching makes, will return expected mock', async () => {
        const mockQueryData = [{
            test: "test"
        }];
        const _mockDb = dbPoolMock({
            mockQueryValues: {
                mockReturn: mockQueryData
            }
        })
        const actual = await getMake({
            logger: mockLogger,
            db: _mockDb
        });
        expect(actual).toEqual(mockQueryData)
    })

    test('GetMake: When DB returns empty array, return empty array', async () => {
        const mockQueryData = [];
        const _mockDb = dbPoolMock({
            mockQueryValues: {
                mockReturn: mockQueryData
            }
        })
        const actual = await getMake({
            logger: mockLogger,
            db: _mockDb
        });
        expect(actual).toEqual(mockQueryData)
    })
})
