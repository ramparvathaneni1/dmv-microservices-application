import { jest } from '@jest/globals';

const mockGetMake = (mockResponse) => {
    return jest.fn().mockImplementation(() => (
        mockResponse
    ));
}


const mockGetModels = (mockResponse) => {
    return jest.fn().mockImplementation(() => (
        mockResponse
    ));
}

export { mockGetMake, mockGetModels };