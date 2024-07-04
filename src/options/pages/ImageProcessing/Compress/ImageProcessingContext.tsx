import {
	createContext,
	useContext,
	useReducer,
	ReactNode,
	Reducer,
	Dispatch,
} from "react";

const ImageListContext = createContext<{
	imageList: ImageListContextType[];
	imageListDispatch: Dispatch<ImageListContextAction>;
}>({
	imageList: [],
	imageListDispatch: () => {},
});

/** 压缩模式 */
export const CompressionMode: Record<
	"reduce" | "clearness" | "custom",
	ConfigType
> = {
	/** 缩小优先 */
	reduce: {
		type: "image/jpeg",
		quality: 0.5,
	},
	/** 清晰优先 */
	clearness: {
		type: "image/png",
		quality: 0.5,
	},
	/** 自定义 */
	custom: {
		type: "original",
		quality: 0.5,
	},
};

// 默认缩小优先
const initialConfig: ConfigType = CompressionMode["reduce"];
const ConfigContext = createContext<{
	config: ConfigType;
	configDispatch: Dispatch<ConfigAction>;
}>({
	config: initialConfig,
	configDispatch: () => {},
});

export function ImageProcessingProvider({ children }: { children: ReactNode }) {
	const [imageList, imageListDispatch] = useReducer(
		imageListReducer,
		initialImageList
	);
	const [config, configDispatch] = useReducer(configReducer, initialConfig);

	return (
		<ImageListContext.Provider value={{ imageList, imageListDispatch }}>
			<ConfigContext.Provider value={{ config, configDispatch }}>
				{children}
			</ConfigContext.Provider>
		</ImageListContext.Provider>
	);
}

export function useImageList() {
	return useContext(ImageListContext);
}

export function useConfig() {
	return useContext(ConfigContext);
}

interface ImageListContextAction {
	type: "add" | "remove" | "update";
	id?: string;
	payload: ImageListContextType | ImageListContextType[];
}

const imageListReducer: Reducer<
	ImageListContextType[],
	ImageListContextAction
> = (list, action) => {
	switch (action.type) {
		case "add":
			const _list = Array.isArray(action.payload)
				? action.payload
				: [action.payload];
			return [...list, ..._list];
		case "remove":
			return list.flatMap((item) => {
				if (item.id === action.id) {
					[];
				}
				return [item];
			});
		case "update":
			if (Array.isArray(action.payload)) {
				return action.payload;
			}
			return [action.payload];
		default:
			throw Error("type 为：" + action.type + "，没有对应的处理函数");
	}
};

export interface ImageListContextType {
	file: File;
	id: string;
}
const initialImageList: ImageListContextType[] = [];

const configReducer: Reducer<ConfigType, ConfigAction> = (state, action) => {
	switch (action.type) {
		case "update":
			return {
				...state,
				...action.payload,
			};
		default:
			throw Error("type 为：" + action.type + "，没有对应的处理函数");
	}
};

/**
 * {
 * 	type: image/png image/jpeg image/webp original: 原来的格式 如果不是前三个格式中的任意一个，则选择 jepg 格式压缩,
 * 	quality: number
 * }
 */

export interface ConfigType {
	type: "image/png" | "image/jpeg" | "image/webp" | "original";
	quality: number;
}
interface ConfigAction {
	type: "update";
	payload: ConfigType;
}
