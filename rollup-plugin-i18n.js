import { pathToFileURL } from "url";
import { join, resolve } from "path";

/**
 * Rollup 插件：在构建时将英文文案替换为中文
 * 这个插件不会修改源代码，只在打包输出时进行替换
 */
export default function i18nPlugin(options = {}) {
  const {
    translationsPath = "./translations.js",
    include = ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
  } = options;

  let translations = {};

  return {
    name: "rollup-plugin-i18n",

    async buildStart() {
      try {
        // 解析绝对路径
        const absolutePath = resolve(translationsPath);
        // 转换为文件 URL
        const fileUrl = pathToFileURL(absolutePath).href;

        // 动态导入翻译模块
        const module = await import(fileUrl);
        translations = module.default || module;

        console.log(`[i18n] 已加载 ${Object.keys(translations).length} 条翻译`);
      } catch (error) {
        console.error("[i18n] 无法加载翻译文件:", error.message);
        translations = {};
      }
    },

    transform(code, id) {
      // 跳过 node_modules 和翻译文件本身
      if (id.includes("node_modules") || id.includes("translations.")) {
        return null;
      }

      // 检查文件扩展名是否匹配
      const ext = id.split(".").pop();
      const validExts = ["js", "jsx", "ts", "tsx"];
      if (!validExts.includes(ext)) {
        return null;
      }

      let transformedCode = code;
      let hasChanges = false;

      // 对每个翻译条目进行替换
      for (const [english, chinese] of Object.entries(translations)) {
        // 处理不同的字符串格式
        const patterns = [
          // 双引号字符串: "text"
          {
            regex: new RegExp(`"${escapeRegex(english)}"`, "g"),
            replacement: `"${chinese}"`,
          },
          // 单引号字符串: 'text'
          {
            regex: new RegExp(`'${escapeRegex(english)}'`, "g"),
            replacement: `'${chinese}'`,
          },
          // 模板字符串: `text`
          {
            regex: new RegExp("`" + escapeRegex(english) + "`", "g"),
            replacement: "`" + chinese + "`",
          },
          // JSX 文本节点: >text<
          {
            regex: new RegExp(`>${escapeRegex(english)}<`, "g"),
            replacement: `>${chinese}<`,
          },
        ];

        patterns.forEach(({ regex, replacement }) => {
          if (regex.test(transformedCode)) {
            transformedCode = transformedCode.replace(regex, replacement);
            hasChanges = true;
          }
        });
      }

      if (hasChanges) {
        return {
          code: transformedCode,
          map: null, // 如果需要 source map，这里可以生成
        };
      }

      return null;
    },
  };
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
