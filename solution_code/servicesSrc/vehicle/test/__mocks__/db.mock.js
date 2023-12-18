import { jest } from '@jest/globals';

const dbPoolMock = ({mockQueryValues, mockExecuteValues}) => {
    const mockQuery = () => {
        return new Promise((resolve, reject) => {
            if (mockQueryValues.mockError) {
                reject(mockQueryValues.mockError)
            } else {
                resolve([mockQueryValues.mockReturn])
            }
        })
    }

    const mockExecute = () => {
        return new Promise((resolve, reject) => {
            if (mockExecuteValues.mockError) {
                reject(mockExecuteValues.mockError)
            } else {
                resolve([mockExecuteValues.mockReturn])
            }
        })
    }

    return {
        query: mockQuery,
        execute: mockExecute
    }
}

export default dbPoolMock;
