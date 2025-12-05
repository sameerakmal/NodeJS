
const URI = "mongodb+srv://sameerakmal:N3kgijA5SGxKBr6x@nnode.hpqsagr.mongodb.net/?appName=NNode";

const {MongoClient} = require("mongodb");

const url = 'mongodb+srv://sameerakmal:N3kgijA5SGxKBr6x@nnode.hpqsagr.mongodb.net/?appName=NNode';
const client = new MongoClient(url);

const dbname = 'HelloWorld';

async function main(){
    await client.connect();
    console.log('Connected succesfully to server');
    const db = client.db(dbname);
    const collection = db.collection('Users');

    const data = [
        { firstName: "Syed", lastName: "Rayhan" },
        { firstName: "Sameer", lastName: "Akmal" },
        { firstName: "Hassan", lastName: "Khan" }
    ];

    const insertResult = await collection.insertMany(data);
    console.log("Inserted documents =>", insertResult);

    // const findResult = await collection.find({}).toArray();
    // console.log('Found documents =>', findResult);

    // const updateResult = await collection.updateMany({lastName : "Muntaz"}, {$set: {lastName : "Rayhan"}});
    // console.log('Updated documents =>', updateResult);
    
    // const deleteResult = await collection.deleteMany({firstName : {$in:["Syed", "Sameer", "Hassan"]}});
    // console.log('Deleted documents =>', deleteResult);
    
    return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());