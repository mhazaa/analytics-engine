# Analytics Engine

https://www.npmjs.com/package/@mhazaa/analytics-engine/

Analytics engine for Express and MongoDB

Example:

import dotenv from 'dotenv';
import { AnalyticsEngine } from 'analytics-engine';
import DB, { Config } from 'db';
dotenv.config();

const config: Config = {
	DBUSERNAME: process.env.DB_USERNAME || '',
	DBPASSWORD: process.env.DB_PASSWORD || '',
	DBNAME: process.env.DB_NAME || '',
	DBCLUSTERNAME: process.env.DB_CLUSTER_NAME || ''
};

const start = async () => {
	const db = new DB(config);
	await db.connect();
	const analyticsCollection = db.collection(process.env.ANALYTICS_COLLECTION || 'analytics');
	AnalyticsEngine.connect(analyticsCollection);
	AnalyticsEngine.routes(app);
}

start();

Data Schema:

const analyticsData = {
	totalViews: n,
	totalUniqueVisitors: n,
	metrics: {
		metricName: n
	},
	users: {
		userId: {
			totalViews: n,
			metrics: {
				metricName: n
			}
		}
	}
};
