# Memes Mini App Frontend 技术文档

## 1. 项目概述

这是一个基于现代前端技术栈构建的 Telegram Mini App 项目，主要用于表情包分享和管理。项目采用了 React + TypeScript + Vite 的技术组合，并集成了多个高质量的第三方库。

## 2. 技术栈

### 2.1 核心框架和库
- React 18.3.1：用于构建用户界面的 JavaScript 库
- TypeScript：添加了静态类型系统的 JavaScript 超集
- Vite：新一代前端构建工具
- Redux Toolkit：状态管理工具
- React Router：路由管理

### 2.2 UI 组件库
- Ant Design Mobile：移动端 UI 组件库
- Ant Design：桌面端 UI 组件库

### 2.3 工具库
- Axios：HTTP 客户端
- i18next：国际化解决方案
- Lottie-web：动画效果库
- Pako：压缩算法库

### 2.4 开发工具
- ESLint：代码质量检查工具
- Tailwind CSS：原子化 CSS 框架
- PostCSS：CSS 处理工具

## 3. 项目结构

```
src/
├── api/          # API 接口定义和网络请求
├── assets/       # 静态资源文件
├── components/   # 可复用组件
├── config/       # 配置文件
├── hooks/        # 自定义 React Hooks
├── i18n/         # 国际化配置
├── interface/    # TypeScript 接口定义
├── providers/    # 上下文提供者
├── router/       # 路由配置
├── store/        # Redux 状态管理
├── style/        # 全局样式
├── util/         # 工具函数
├── view/         # 页面组件
├── App.tsx       # 应用程序入口组件
└── main.tsx      # 应用程序入口文件
```

## 4. 主要功能模块

### 4.1 Telegram 集成
- 项目通过 `@telegram-apps/sdk-react` 实现与 Telegram 平台的集成
- 使用 TelegramProvider 组件提供 Telegram 相关功能

### 4.2 状态管理
- 使用 Redux Toolkit 进行全局状态管理
- 实现了模块化的状态管理架构

### 4.3 国际化
- 使用 i18next 实现多语言支持
- 支持自动检测用户语言

### 4.4 路由系统
- 使用 React Router 实现 SPA 路由
- 支持路由懒加载

## 5. 环境配置

项目包含两个环境配置文件：
- `.env.development`：开发环境配置
- `.env.production`：生产环境配置

## 6. 构建和部署

### 6.1 开发环境
```bash
npm run dev     # 启动开发服务器
```

### 6.2 生产环境
```bash
npm run build   # 构建生产版本
npm run preview # 预览生产版本
```

### 6.3 代码检查
```bash
npm run lint    # 运行 ESLint 检查
```

## 7. 性能优化

- 使用 React.lazy 实现代码分割
- 使用 Vite 的构建优化功能
- 集成了 cssnano 进行 CSS 优化
- 使用 autoprefixer 自动添加 CSS 前缀

## 8. 开发规范

### 8.1 代码规范
- 使用 ESLint 进行代码质量控制
- 使用 TypeScript 强类型检查
- 采用模块化的开发方式

### 8.2 提交规范
- 使用语义化的提交信息
- 提交前进行代码检查

## 9. 注意事项

1. 确保正确配置环境变量
2. 开发时注意 Telegram Mini App 的限制条件
3. 遵循 React 最佳实践
4. 注意移动端适配和性能优化

## 10. 常见问题

1. 环境变量配置问题
2. 构建优化相关问题
3. Telegram API 集成问题

## 11. 维护和更新

- 定期更新依赖包
- 关注安全更新
- 保持文档的同步更新

## 12. 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交变更
4. 发起 Pull Request

## 13. 版本历史

当前版本：0.0.0

## 14. 许可证

私有项目，未指定开源许可证
