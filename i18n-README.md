# 国际化（中文化）说明

## 概述

本项目实现了一个不修改源代码的中文化方案。所有的翻译都在构建时自动进行，源代码保持原样。

## 文件说明

### 1. `translations.js`
包含所有英文到中文的翻译映射。这是一个 JavaScript 模块文件，格式如下：

```javascript
export default {
  "English Text": "中文文本",
  "Another Text": "另一个文本"
};
```

### 2. `rollup-plugin-i18n.js`
自定义的 Rollup 插件，在构建时将代码中的英文文案替换为中文。

### 3. `rollup.config.js`
已配置使用 i18n 插件进行构建时翻译。

## 使用方法

### 构建项目

正常构建项目，插件会自动进行翻译：

```bash
# 开发构建（带监听）
npm run watch

# 生产构建
npm run build
```

### 添加新的翻译

如果需要添加或修改翻译，只需编辑 `translations.js` 文件：

1. 打开 `translations.js`
2. 添加或修改翻译条目
3. 保存文件
4. 重新构建项目

示例：
```javascript
export default {
  "Install": "安装",
  "Uninstall": "卸载",
  "New Feature": "新功能"
};
```

## 工作原理

1. **构建时替换**：插件在 Rollup 打包过程中拦截代码转换阶段
2. **模式匹配**：支持多种字符串格式：
   - 双引号字符串：`"text"`
   - 单引号字符串：`'text'`
   - 模板字符串：`` `text` ``
   - JSX 文本节点：`>text<`
3. **精确替换**：使用正则表达式精确匹配，避免误替换

## 优点

✅ **不修改源代码**：所有源文件保持英文，便于维护和同步上游更新  
✅ **构建时处理**：翻译在打包时进行，不影响运行时性能  
✅ **易于维护**：所有翻译集中在一个 JSON 文件中  
✅ **灵活性高**：可以轻松切换语言或添加新语言支持  

## 注意事项

⚠️ **字符串完全匹配**：翻译时会进行完全字符串匹配，确保翻译文件中的英文文本与代码中完全一致  
⚠️ **重新构建**：修改翻译后需要重新构建项目才能生效  
⚠️ **特殊字符**：包含特殊字符的文本会自动转义，无需手动处理  
⚠️ **智能引号**：对于包含智能引号（" "）的文本，在 JavaScript 文件中可以使用 Unicode 转义（\u201c 等）或计算属性名  

## 示例

### 源代码（不修改）
```tsx
<ButtonItem>Install LSFG-VK</ButtonItem>
```

### translations.js
```javascript
export default {
  "Install LSFG-VK": "安装 LSFG-VK"
};
```

### 构建后的代码
```tsx
<ButtonItem>安装 LSFG-VK</ButtonItem>
```

## 维护建议

1. **定期更新**：当源代码添加新文案时，及时更新 `translations.js`
2. **测试验证**：构建后测试插件功能，确保翻译正确显示
3. **备份翻译**：定期备份 `translations.js` 文件
4. **统一术语**：保持翻译术语的一致性

## 排查问题

如果某些文本没有被翻译：

1. 检查 `translations.js` 中是否有对应的条目
2. 确认英文文本与源代码中的**完全一致**（包括空格、标点、引号类型）
3. 查看构建日志，确认插件正常加载（应该显示"已加载 XX 条翻译"）
4. 尝试清除 dist 目录后重新构建

## 扩展支持

如果未来需要支持多语言切换，可以：

1. 创建多个翻译文件（如 `translations-zh.js`, `translations-ja.js`）
2. 通过环境变量或构建参数选择翻译文件
3. 修改 `rollup.config.js` 传入不同的翻译文件路径

示例：
```javascript
i18nPlugin({
  translationsPath: process.env.LANG === 'ja' 
    ? './translations-ja.js' 
    : './translations.js'
})
```

## 已知限制

- 翻译仅在构建时进行，不支持运行时切换语言
- 只替换字符串字面量，不替换变量名、函数名等标识符
- 某些动态构造的字符串可能无法被替换


