import deckyPlugin from "@decky/rollup";
import i18nPlugin from "./rollup-plugin-i18n.js";

const config = deckyPlugin({
  // Add your extra Rollup options here
});

// 添加 i18n 插件到插件列表
if (Array.isArray(config.plugins)) {
  config.plugins.push(
    i18nPlugin({
      translationsPath: "./translations.js",
    })
  );
} else {
  config.plugins = [
    i18nPlugin({
      translationsPath: "./translations.js",
    }),
  ];
}

export default config;
