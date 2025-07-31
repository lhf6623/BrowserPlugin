# 工具箱 - 基于浏览器 API 制作

一个小工具箱，多功能集成，后续遇到新功能会继续集成

## 当前功能

任务定时器，图片压缩，图片剪裁，Tauri 图标图片各个尺寸制作，base64和图片互转

## 如何使用

Microsoft Edge浏览器：[点击跳转至 Microsoft Edge 扩展商店](https://microsoftedge.microsoft.com/addons/detail/adghdebcjdnllphndeljpdghfemgbpjp)

下载地址：[点击跳转至 GitHub Releases](https://github.com/lhf6623/BrowserPlugin/releases)

## 自己开发

#### 开发环境

- 版本管理工具 [Git](https://git-scm.com/downloads)

- [NodeJs](https://nodejs.org/zh-cn) 版本 >= 18

- 推荐用 [pnpm](https://www.pnpm.cn/installation) 作为包管理器 `npm i -g pnpm`

#### 运行调试开发

- 克隆项目 `git clone https://github.com/lhf6623/BrowserPlugin.git`
- 安装依赖 `pnpm install`

- 运行开发环境 `pnpm dev`
- 打包生产环境 `pnpm build`
- 打包生产环境(跳过 TypeScript 检查) `pnpm build:test`
- CI/CD 自动部署，需要配置 TOKEN 环境变量
