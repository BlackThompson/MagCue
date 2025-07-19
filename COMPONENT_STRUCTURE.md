# CHAT App Component Structure

## 文件结构

```
src/
├── components/
│   ├── chat/
│   │   ├── ContactList.jsx      # 联系人列表组件
│   │   └── ChatWindow.jsx       # 聊天窗口组件
│   ├── sidebar/
│   │   └── Sidebar.jsx          # 侧边栏组件
│   ├── modals/
│   │   ├── CallModal.jsx        # 通话模态框组件
│   │   └── MoodModal.jsx        # 心情模态框组件
│   ├── ui/                      # UI组件库
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   └── slider.jsx
│   ├── ChatApp.jsx              # 原始单文件组件（保留）
│   ├── ChatAppNew.jsx           # 新的拆分后主组件
│   └── MagCueSimulator.jsx      # 其他组件
├── data/
│   ├── statusOptions.js         # 状态选项配置
│   └── contactsData.js          # 联系人数据配置
├── utils/
│   └── energyUtils.js           # 社交能量工具函数
├── App.jsx                      # 主应用组件
└── main.jsx                     # 应用入口
```

## 组件拆分说明

### 1. 数据层 (`src/data/`)
- **`statusOptions.js`**: 用户状态配置，包含所有状态选项的定义
- **`contactsData.js`**: 联系人初始数据，包含所有联系人的信息和消息

### 2. 工具函数 (`src/utils/`)
- **`energyUtils.js`**: 社交能量相关的工具函数，包括颜色、表情、标签等计算函数

### 3. 组件层 (`src/components/`)

#### 聊天相关组件 (`src/components/chat/`)
- **`ContactList.jsx`**: 联系人列表显示，包含头像、状态、社交能量等信息
- **`ChatWindow.jsx`**: 聊天窗口，包含消息显示、输入框、通话按钮等

#### 侧边栏组件 (`src/components/sidebar/`)
- **`Sidebar.jsx`**: 左侧边栏，包含CHAT logo、用户头像、导航图标、设置面板

#### 模态框组件 (`src/components/modals/`)
- **`CallModal.jsx`**: 通话模态框，显示通话状态和动画
- **`MoodModal.jsx`**: 心情查看模态框，显示联系人的心情状态

#### 主组件
- **`ChatAppNew.jsx`**: 新的主组件，整合所有拆分后的组件，管理全局状态

## 优势

### 1. 代码组织更清晰
- 每个组件职责单一，便于维护
- 数据配置独立，便于修改
- 工具函数复用性强

### 2. 开发效率提升
- 组件可以独立开发和测试
- 代码复用性更高
- 团队协作更容易

### 3. 性能优化
- 组件拆分后，只有变化的组件会重新渲染
- 代码分割更合理

### 4. 可维护性
- 文件结构清晰，便于查找和修改
- 组件职责明确，降低耦合度

## 使用方式

应用现在使用 `ChatAppNew.jsx` 作为主组件，通过 `App.jsx` 引入。所有功能保持不变，但代码结构更加清晰和模块化。

## 迁移说明

- 原始的单文件 `ChatApp.jsx` 保留作为参考
- 新的拆分版本 `ChatAppNew.jsx` 作为主要实现
- 所有功能完全一致，只是代码组织更优 