const Apis = [
    {
        id: 1,
        name: 'api-1',
        hostname: 'api-1-host',
        openapiFile: 'api/petstore.yml',
        //targetHost: '127.0.0.1',
        //targetPort: 8793,
        useStubServer: true,
        stubServerConfig: {
            handler: (req, res) => {

                res.writeHead(200)
                res.end('Hello from first api!')
                // test stub response
            }
        }
    }, 
    {
        id: 2,
        name: 'api-2',
        hostname: 'api-2-host',
        //targetHost: '127.0.0.1',
        //targetPort: 8794,
        useStubServer: true,
        stubServerConfig: {
            handler: (req, res) => {
                // test stub response
                res.writeHead(200)
                res.end('Hello from second api!')
            }
        }
    }
]


const Users = [
    {
        id: 1,
        email: 'some@email.com',
        apiKey: 'FIRST-USER'
    },
    {
        id: 2,
        email: 'another@email.com',
        apiKey: 'SECOND-USER'
    }
]

const UsersApisAccess = [
    { 
        userId:1, 
        apiId: 1
    },
    {
        userId: 1,
        apiId: 2
    }
]


module.exports = { 
    Apis, 
    Users, 
    UsersApisAccess 
}