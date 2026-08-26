import { json } from '@sveltejs/kit';
import { connectToDatabase } from '../../../lib/server/db/mongo.ts';

export async function GET() {
	try {
		const db = await connectToDatabase();

		const collection = db.collection('connection_test');

		const result = await collection.insertOne({
			message: 'Hello from SvelteKit',
			createdAt: new Date()
		});

		return json({
			success: true,
			message: 'Successfully connected and inserted document',
			insertedId: result.insertedId
		});
	} catch (error) {
		console.error('MongoDB error:', error);

		return json(
			{
				success: false,
				message: 'MongoDB operation failed'
			},
			{ status: 500 }
		);
	}
}