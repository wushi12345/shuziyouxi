# AI数字游戏

一个基于React和TypeScript开发的智能数字猜谜游戏，融合赛博朋克与未来科技风格。

## 功能特点

- 三种游戏模式：经典模式、极速模式和地狱模式
- 智能AI对战系统
- 可自定义数字范围（1-9999）
- 实时历史记录追踪
- 游戏成绩评级系统（SSS至S）
- 赛博朋克风格UI设计

## 技术栈

- React 19
- TypeScript
- Vite
- Material-UI
- Three.js
- GSAP
- Howler.js

## 安装说明

1. 克隆项目到本地：
```bash
git clone [你的仓库URL]
cd [项目目录]
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 构建生产版本：
```bash
npm run build
```

## 使用说明

1. 选择游戏模式：
   - 经典模式：标准二分法算法
   - 极速模式：预判跳跃算法
   - 地狱模式：随机猜测+延迟策略

2. 设置数字范围（可选）

3. 开始游戏，与AI进行对战

4. 查看历史记录和最终评级

## 贡献指南

欢迎提交Issue和Pull Request来帮助改进项目。

## 许可证

MIT License

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
