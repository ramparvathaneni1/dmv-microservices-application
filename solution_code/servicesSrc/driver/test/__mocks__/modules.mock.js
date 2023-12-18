import { jest } from '@jest/globals';

const mockGetList = (mockResponse) => {
    return jest.fn().mockImplementation(() => (
        mockResponse
    ));
}


const mockGet = (mockResponse) => {
    return jest.fn().mockImplementation(() => (
        mockResponse
    ));
}

const mockUpdate = (mockResponse) => {
    return jest.fn().mockImplementation(() => (
        mockResponse
    ));
}

const mockAdd = (mockResponse) => {
    return jest.fn().mockImplementation(() => (
        mockResponse
    ));
}

const mockRemove = (mockResponse) => {
    return jest.fn().mockImplementation(() => (
        mockResponse
    ));
}

export {
    mockGetList, 
    mockGet,
    mockUpdate,
    mockAdd,
    mockRemove
};