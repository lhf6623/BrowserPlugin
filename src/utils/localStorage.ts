import { getKey } from "@/utils";

const { storage } = chrome;
const { local } = storage;

class Cache {
	baseKey: string;
	storage = storage;
	constructor(key: string) {
		this.baseKey = key;
		// console.log('clear')
		// local.clear();
		// storage.onChanged.addListener((a) => {
		// 	console.log("storage.onChanged", a[this.baseKey].newValue);
		// });
	}
	async getAllLocal() {
		const data = await local.get(this.baseKey);
		return data[this.baseKey] || {};
	}
	async getItem<T>(key: string, defaultData?: any): Promise<T> {
		if (!key) {
			throw new Error(`请传入键值`);
		}
		const data = await this.getAllLocal();
		return data[key] || defaultData;
	}
	async setItem<T>(key: string, value: T){
		if (!key) {
			throw new Error(`请传入键值`);
		}
		const data = await this.getAllLocal();
		const _data = {
			[this.baseKey]: {
				...data,
				[key]: value,
			},
		};
		local.set(_data);
	}
	removeItem(key: string) {
		if (!key) {
			throw new Error(`请传入键值`);
		}
		local.remove(key);
	}
	clear() {
		local.clear();
	}
}

export default new Cache(getKey("cache"));
