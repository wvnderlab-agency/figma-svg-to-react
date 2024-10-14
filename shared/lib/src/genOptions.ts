import {
	type DeepPartial,
	FrameworkEnum,
	type IFrameworkGenOptions,
	type IGenOptions,
	type IGenOptionsKeys,
	type IGenOptionsMeta,
	type IGenOptionsMetaKeys,
} from "../../types";

export const OPTIONS_VERSION = "1";

const ALL_FRAMEWORKS = Object.values(FrameworkEnum);
export const REACT_FRAMEWORKS = [
	FrameworkEnum.REACT,
	FrameworkEnum.REACT_NATIVE,
];
export const JSX_FRAMEWORKS = [...REACT_FRAMEWORKS, FrameworkEnum.SOLID];

export const GEN_OPTIONS_METADATA: IGenOptionsMeta = {
	importAllAsReact: {
		displayName: "Add: import * as React",
		defaultValue: false,
		requiredSettings: [],
		frameworks: REACT_FRAMEWORKS,
	},
	typescript: {
		displayName: "Typescript",
		defaultValue: true,
		requiredSettings: [],
		frameworks: JSX_FRAMEWORKS,
	},
	props: {
		displayName: "With props",
		defaultValue: true,
		requiredSettings: [],
		frameworks: JSX_FRAMEWORKS,
	},
	spreadProps: {
		displayName: "Spread props",
		defaultValue: true,
		requiredSettings: [{ optionKey: "props", value: true }],
		frameworks: JSX_FRAMEWORKS,
	},
	propsInterface: {
		displayName: "Props interface",
		defaultValue: true,
		requiredSettings: [
			{ optionKey: "typescript", value: true },
			{ optionKey: "props", value: true },
		],
		frameworks: JSX_FRAMEWORKS,
	},
	removeWidth: {
		displayName: "Remove svg width",
		defaultValue: false,
		requiredSettings: [],
		frameworks: ALL_FRAMEWORKS,
	},
	removeHeight: {
		displayName: "Remove svg height",
		defaultValue: false,
		requiredSettings: [],
		frameworks: ALL_FRAMEWORKS,
	},
	removeViewbox: {
		displayName: "Remove viewbox",
		defaultValue: false,
		requiredSettings: [],
		frameworks: ALL_FRAMEWORKS,
	},
	namedExport: {
		displayName: "Named export",
		defaultValue: true,
		requiredSettings: [],
		frameworks: JSX_FRAMEWORKS,
	},
	removeAllFillAttributes: {
		displayName: "Remove all 'fill' attributes",
		defaultValue: false,
		requiredSettings: [],
		frameworks: ALL_FRAMEWORKS,
	},
	removeAllStrokeAttributes: {
		displayName: "Remove all 'stroke' attributes",
		defaultValue: false,
		requiredSettings: [],
		frameworks: ALL_FRAMEWORKS,
	},
	removeTitle: {
		displayName: "Remove <title>",
		defaultValue: false,
		requiredSettings: [],
		frameworks: ALL_FRAMEWORKS,
	},
	forwardRef: {
		displayName: "Forward ref",
		defaultValue: false,
		requiredSettings: [
			{
				optionKey: "props",
				value: true,
				framework: FrameworkEnum.SOLID,
			},
			{
				optionKey: "spreadProps",
				value: false,
				framework: FrameworkEnum.SOLID,
			},
		],
		frameworks: JSX_FRAMEWORKS,
	},
};

export const makeDefaultGenOptions = (): IGenOptions => {
	const obj: Partial<IGenOptions> = {};
	for (const k in GEN_OPTIONS_METADATA) {
		const key = k as IGenOptionsMetaKeys;
		obj[key] = GEN_OPTIONS_METADATA[key].defaultValue;
	}
	return obj as IGenOptions;
};

export const makeFrameworkGenOptions = (): IFrameworkGenOptions => {
	const obj: Partial<IFrameworkGenOptions> = {};
	for (const key of Object.values(FrameworkEnum)) {
		obj[key] = {
			...makeDefaultGenOptions(),
		};
	}
	return obj as IFrameworkGenOptions;
};
export const mergeFrameworkGenOptions = (
	base: IFrameworkGenOptions,
	toMerge: DeepPartial<IFrameworkGenOptions>,
) => {
	const mergedOpts: DeepPartial<IFrameworkGenOptions> = {};
	for (const key in base) {
		const framework = key as FrameworkEnum;
		mergedOpts[framework] = {
			...base[framework],
		};

		if (Object.hasOwn(toMerge, framework) && toMerge[framework]) {
			for (const _optKey in mergedOpts[framework]) {
				const optKey = _optKey as IGenOptionsKeys;
				if (
					Object.hasOwn(toMerge[framework], optKey) &&
					toMerge[framework][optKey] != null
				) {
					mergedOpts[framework][optKey] = toMerge[framework][optKey];
				}
			}
		}
	}
	return mergedOpts as IFrameworkGenOptions;
};