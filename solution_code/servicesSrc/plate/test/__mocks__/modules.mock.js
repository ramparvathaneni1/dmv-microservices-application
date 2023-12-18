import { jest } from '@jest/globals';

const mockValidatePlate = (mockResponse) => {
    return jest.fn().mockImplementation(() => (
        mockResponse
    ));
}


const mockGetByDriverIds = (mockResponse) => {
    return jest.fn().mockImplementation(() => (
        mockResponse
    ));
}

const mockGetByPlateIds = (mockResponse) => {
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
    mockValidatePlate, 
    mockGetByDriverIds,
    mockGetByPlateIds,
    mockUpdate,
    mockAdd,
    mockRemove
};