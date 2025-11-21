# Novel Analysis Frontend

Vue 3 + Vite + Element Plus 的网文创作展示终端。当前版本已切换为直连真实后端（JWT 认证），覆盖注册/登录、个人资料、作品上传与分析、角色设定、世界观设定等核心流程。

## 已对接的后端接口

- `POST /api/auth/register`、`POST /api/auth/login`：注册 / 登录，返回 JWT
- `GET /api/users/me`、`PUT /api/users/me`：获取与编辑当前用户资料（含密码校验）
- `POST /api/works`、`GET /api/works`、`DELETE /api/works/{id}`：作品上传、列表与删除
- `POST /api/analyze/text`、`POST /api/analyze/works/{id}`：上传文本/Docx 或对已存作品重新分析
- `GET /api/characters`、`POST/PUT /api/characters`、`DELETE /api/characters/{id}`：角色设定 CRUD
- `GET /api/worlds`、`POST/PUT /api/worlds`、`DELETE /api/worlds/{id}`：世界观设定 CRUD

## 目录

```
novel-analysis-frontend
├── src/
│   ├── services/api.js        # axios 封装，默认直连 http://localhost:8081/api
│   ├── stores/auth.js         # JWT 登录态（Pinia）
│   ├── views/
│   │   ├── HomeView.vue       # 首页
│   │   ├── UserManagementView.vue  # 个人资料 / 修改密码
│   │   ├── WorkManagementView.vue  # 作品上传、列表、重算
│   │   ├── AnalysisView.vue        # 文本/作品分析
│   │   └── CharacterView.vue       # 角色 & 世界观设置
│   └── App.vue                # 顶部导航 + 登录对话框
├── vite.config.js             # 支持 VITE_USE_MOCK 开关
└── mock/api.js                # 仍保留演示数据，可按需启用
```

## 环境变量

- `VITE_API_BASE`：后端网关，默认 `http://localhost:8081/api`
- `VITE_USE_MOCK`：设置为 `true` 时启用 vite-plugin-mock（默认关闭，直连后端）

## 本地运行

```bash
npm install
npm run dev        # 直连后端
# npm run dev -- --mode mock  # 如需临时使用 mock，可在 .env.mock 设置 VITE_USE_MOCK=true
npm run build
```

## 说明

- 顶栏“登录/注册”按钮会获取并缓存 JWT，后续请求均带上 `Authorization: Bearer <token>`
- 上传文本/Docx 会通过 `FormData` 直接转发至后端，大小限制取决于后端配置（默认 10MB）
- 列表页对分页结果做了容错，既支持数组也支持 Spring Page 的 `content` 结构
