# 工具箱 - 基于浏览器 API 制作

一个小工具箱，多功能集成，后续遇到新功能会继续集成

# 当前功能

- 任务定时器
- 图片压缩
- 图片转 base64
- 图片剪裁

# 如何使用

当前只上架了 Microsoft Edge 扩展商店：[点击跳转至 Microsoft Edge 扩展商店](https://microsoftedge.microsoft.com/addons/detail/adghdebcjdnllphndeljpdghfemgbpjp)

下载扩展直接用
浏览器 => 设置 => 扩展程序 => 打开开发人员模式 => 加载已解压的扩展程序 => 选择下载的压缩包 => 添加

<img alt='popup展示' src='https://github.com/lhf6623/BrowserPlugin/raw/main/public/popup.jpg' width='500' />

<img alt='popup设置页面' src='https://github.com/lhf6623/BrowserPlugin/raw/main/public/popup_setting.jpg' width='500' />

<img alt='图片压缩' src='https://github.com/lhf6623/BrowserPlugin/raw/main/public/img_compress.jpg' width='500' />

<img alt='图片剪裁' src='https://github.com/lhf6623/BrowserPlugin/raw/main/public/img_cut_out.jpg' width='500' />

# 框架介绍

基于[React 18](https://react.docschina.org) + [Vite](https://cn.vitejs.dev)
构建，使用了[CRXJS Vite Plugin](https://github.com/crxjs/chrome-extension-tools/blob/main/packages/vite-plugin/README.md)
用来快速开发

# 快速开始

#### 开发环境

- [NodeJs](https://nodejs.org/zh-cn) 版本 >= 18

- 推荐用 [pnpm](https://www.pnpm.cn/installation) 作为包管理器
- 版本管理工具 [Git](https://git-scm.com/downloads)

#### 运行调试开发

- 克隆项目 `git clone https://github.com/lhf6623/BrowserPlugin.git`
- 安装依赖 `pnpm install`

- 运行开发环境 `pnpm dev`
- 打包生产环境 `pnpm build`
- 打包生产环境(跳过 TypeScript 检查) `pnpm build:test`
