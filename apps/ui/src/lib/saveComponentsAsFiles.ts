import { JSX_FRAMEWORKS } from "@shared/lib";
import type { FrameworkEnum, IComponent, IGenOptions } from "@shared/types";
import JSZip from "jszip";

interface IOpts {
	components: IComponent[];
	genOptions: IGenOptions;
	framework: FrameworkEnum;
}

export const saveComponentsAsFiles = async ({
	components,
	genOptions,
	framework,
}: IOpts) => {
	return new Promise<void>((resolve) => {
		let extension = "svg";

		if (JSX_FRAMEWORKS.includes(framework)) {
			extension = `${genOptions.typescript ? "t" : "j"}sx`;
		}

		if (components.length === 1) {
			const comp = components[0];
			downloadBlob(
				new Blob([comp.code]),
				`components/${comp.fileName}.${extension}`,
			);
			return resolve();
		}

		const zip = new JSZip();
		const usedFileNames = new Map<string, number>();
		const exportStatements: string[] = [
			"export * from './types'", // Export types
		];
		const iconMappings: string[] = [];

		const componentsFolder = zip.folder("components");

		for (const comp of components) {
			const blob = new Blob([comp.code]);

			let fileName = comp.fileName;
			const usedTimes = usedFileNames.get(fileName) ?? 0;
			if (usedTimes > 0) {
				fileName = `${fileName} (${usedTimes})`;
			}
			usedFileNames.set(comp.fileName, usedTimes + 1);

			exportStatements.push(`export * from './components/${fileName}';`);

			iconMappings.push(`  '${comp.nodeName}': ${fileName}`);

			componentsFolder.file(`${fileName}.${extension}`, blob, {
				base64: true,
			});
		}

		const indexExtension = genOptions.typescript ? "ts" : "js";
		const indexContent = exportStatements.join("\n");
		zip.file(`index.${indexExtension}`, indexContent);

		const typesContent = `import {
${components.map((c) => `  ${c.fileName},`).join("\n")}
} from './index';

export type IconName =
${components.map((c) => `  | '${c.nodeName}'`).join("\n")};

import { SVGProps } from 'react';
interface IProps extends SVGProps<SVGSVGElement> {}
export const iconComponents: Record<IconName, React.FC<IProps>> = {
${components
	.map((c) => {
		// Wenn der Name Leerzeichen enthält, verwenden wir die String-Notation
		return c.nodeName.includes(" ") || c.nodeName.includes("-")
			? `  '${c.nodeName}': ${c.fileName},`
			: `  ${c.nodeName}: ${c.fileName},`;
	})
	.join("\n")}
} as const;

export const iconNames: IconName[] = [
${components.map((c) => `  '${c.nodeName}'`).join(",\n")}
] as const;`;

		zip.file(`types.${indexExtension}`, typesContent);

		zip.generateAsync({ type: "blob" }).then((blob: Blob) => {
			downloadBlob(blob, "generated_svgs.zip");
			resolve();
		});
	});
};

const downloadBlob = (blob: Blob, fileName: string) => {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.setAttribute("download", fileName);
	a.click();
	URL.revokeObjectURL(url);
};
