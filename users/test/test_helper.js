import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';


mongoose.Promise = global.Promise;
// NOTE: Variable for dev and production environments
mongoose.set('debug', true);

export function mongooseConnect( dbName = 'users_test' ) {
  // Load all models into mongoose
  const modelAndSchemaFiles = fs.readdirSync( path.resolve(__dirname, '../src') );
  modelAndSchemaFiles.forEach((file) => {
    require('../src/' + file);
  });

  return new Promise((resolve, reject) => {
    const connection = mongoose.connect(`mongodb://localhost/${dbName}`, {
      useMongoClient: true,
      promiseLibrary: global.Promise,

    })
    connection
      .then(() => {
        console.log('mongo startup ready');
        resolve(connection)
      })
      .catch((error) => {
        console.log('mongo startup error');
        console.log(error);
        reject(error)
      });
  });
}

export function mongooseDisconnect() {
  mongoose.disconnect();
}

export async function mongooseDropTestCollections() {
  const collectionNames = [
    'users',
    'comments',
    'blogposts',
  ];
  for ( const collectionName of collectionNames ) {
    try {
      await mongoose.connection.collections[collectionName].drop()
    }
    catch ( error ) {
      // INGORE_EXCEPTION
    }
  }
  return true;
}
