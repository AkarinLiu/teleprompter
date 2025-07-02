# 提词器

一个简单的提词器应用，支持流畅且可自定义的脚本阅读体验。

## 功能特性

- 可调节滚动速度
- 可自定义字体大小和颜色
- 支持暂停、恢复和重置控制
- 简单易用的界面

## 安装

1. 克隆本仓库：
    ```bash
    git clone https://github.com/AkarinLiu/teleprompter.git
    ```
2. 进入项目目录：
    ```bash
    cd teleprompter
    ```
3. 安装依赖：
    ```bash
    yarn
    ```

## 构建

### 构建桌面应用

```bash
yarn tauri build
```

### 构建移动端应用

```bash
yarn tauri android build
```

## 贡献

欢迎贡献！请提交 issue 或 pull request。