import { MongoClient, Db, type Document } from "mongodb";
import { MONGODB_URI } from "$env/static/private";

if(!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

const client = new MongoClient(MONGODB_URI);
let cachedDb: Db | null = null;

export async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }
    
    await client.connect();
    cachedDb = client.db("MealMateDB");
    return cachedDb;
}

export const COLLECTIONS = {
	users: 'users',
	recipes: 'recipes',
	favorites: 'favorites'
} as const;

export type CollectionName =
	(typeof COLLECTIONS)[keyof typeof COLLECTIONS];

export async function getCollection<T extends Document>(
	collectionName: CollectionName
) {
	const db = await connectToDatabase();

	return db.collection<T>(collectionName);
}