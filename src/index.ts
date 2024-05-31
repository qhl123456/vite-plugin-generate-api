import fs from 'fs';
import type { Plugin } from 'vite';
import type { IPluginConfig } from './type.ts';

/**
 * @method 更新Api.d.ts内容
 * @description 生成Api类型后挂载到proxy上获取proxy?.$api.xxx代码提示
 */
function updateApiDeclaration(config: IPluginConfig) {
  const { fileName, folderName } = config;
  const moduleFiles = fs.readdirSync(folderName);
  const apiContent = generateApiDeclaration(moduleFiles);
  fs.writeFileSync(fileName, apiContent);
}

/**
 * @method 根据api/module文件名生成Api.d.ts内容
 * @param {string[]}  moduleFiles 文件名
 */
function generateApiDeclaration(moduleFiles: string[]) {
  const interfaceEntries = moduleFiles
    .map(
      filename =>
        `  ${filename.replace('.ts', '')}: typeof import('@/api/module/${filename.replace('.ts', '')}')`
    )
    .join('\n  ');
  return `declare namespace GlobalApi {
  interface Api {
  ${interfaceEntries}
  }
}
`;
}

/**
 * @method 使用fs观察module文件夹变动
 * @description 观察到文件夹内的文件变动后重新生成Api.d.ts文件
 */
export default function watchFolderChange(pluginConfig: IPluginConfig): Plugin {
  return {
    name: 'watch-folder-plugin',
    config(_config, { mode }) {
      if (mode === 'development') {
        fs.watch(pluginConfig.folderName, eventType => {
          if (['change', 'rename'].includes(eventType)) {
            updateApiDeclaration(pluginConfig);
          }
        });
      }
    },
  };
}
