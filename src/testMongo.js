require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI não está definida no .env');
    process.exit(1);
}

const client = new MongoClient(uri);

async function testConnection() {
    try {
        await client.connect();
        console.log('Conectado ao MongoDB com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
    } finally {
        await client.close();
    }
}

testConnection();
