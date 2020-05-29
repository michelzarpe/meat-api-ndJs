export const enviroment = {
    server: { port:process.env.SERVER_PORT || 3000},
    security : {
        saltRounds: process.env.SALT_ROUND || 10,
        apiSecret:process.env.API_SECRET || 'meat-api-secret',
        enableHTTP:process.env.ENABLE_HTTPS || false,
        certificate: process.env.CERTI_FILE || 'src/security/keys/cert.pem',
        key: process.env.CERT_KEY_FILE || 'src/security/keys/key.pem'
    },
    db: {url: process.env.DB_URL || 'mongodb://localhost/meat-api'},
    log : {
        level:process.env.LOG_LEVEL || 'debug',
        name: 'meat-api-logger'
    }
   
}