const { Client } = require('pg');
const { conn } = require('./../common/dbUtils');

jest.mock('pg');

Client.prototype.connect = jest.fn().mockReturnValue(Promise.resolve(true));

describe('test conn', () => {
    test('should return client', () => {
        const connectionString = 'test_string'
        const result = conn(connectionString);
        expect(Client).toHaveBeenCalledWith({ connectionString: connectionString })
        expect(result).toBeInstanceOf(Client)
    })
})
