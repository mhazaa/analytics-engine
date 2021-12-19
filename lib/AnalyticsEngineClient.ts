import uniqid from 'uniqid';
import { PageLoadedData, SendMetricData } from './types';

const getCookie = (cookieName: string): string => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${cookieName}=`);
	if (parts.length === 2) return parts.pop()!.split(';').shift() || '';
	return '';
};

export default class AnalyticsEngineClient {
	private static connected = false;
	private static connectionCallbacks: { (): void; }[] = [];

	public static async connect () {
		const userId = AnalyticsEngineClient.getUserId() || AnalyticsEngineClient.setUserId(uniqid());
		const data: PageLoadedData = { userId };

		const res = await fetch('/pageLoaded', {
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(data)
		});
		console.log(res);
		AnalyticsEngineClient.connectionCallbacks.forEach(loadEvent => loadEvent());
		AnalyticsEngineClient.connected = true;
		console.log('Successfully connected to AnalyticsEngine');
	}
	
	public static onConnection (callback: () => void) {
		if (typeof callback !== 'function') throw new Error('Callback must be of type function');

		(AnalyticsEngineClient.connected)
			? callback()
			: AnalyticsEngineClient.connectionCallbacks.push(callback);
	}

	public static async sendMetric (metric: string, globalMetric = metric) {
		const sendMetric = async () => {
			const userId = AnalyticsEngineClient.getUserId();
			const data: SendMetricData = { userId, metric, globalMetric };
			const res = await fetch('/sendMetric', {
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: JSON.stringify(data)
			});
			console.log(res);
		};
		(!AnalyticsEngineClient.connected)
			? AnalyticsEngineClient.connectionCallbacks.push(sendMetric)
			: sendMetric();
	}

	private static getUserId (): string {
		return getCookie('userid');
	}
	
	private static setUserId (userId: string): string {
		document.cookie = `userid=${userId}`;
		return AnalyticsEngineClient.getUserId();
	}
}
