# 外包接口模板（Fastify v5 + Sequelize + MySQL8，JS）

> 一个可复用的 **外单/外包项目**后端模板（非咖啡专用），主打：**高性能、快速交付、易扩展**。  
> 技术栈：Fastify v5、Sequelize（MySQL 8，`mysql2` 驱动）、JWT、CORS/Helmet、Swagger。

---

## ✨ 特性总览
- **高性能**：Fastify v5、Pino 结构化日志、Gzip/Brotli 压缩（可配阈值）、连接池默认开启  
- **多租户可选**：所有核心表支持 `tenantId`，支持“租户内唯一”（单租户场景可关闭）  
- **鉴权与分权**：JWT（短期）+ 角色（admin/user）守卫；示例提供常见保护路由  
- **接口规范**：AJV JSON-Schema 校验、统一错误结构、OpenAPI 3.1 文档（`/docs`）  
- **工程化**：ESM、分环境 `.env`、Dockerfile & Compose、即插即用模块（测试模型 / 电商骨架）  
- **可扩展**：可加 Redis、队列、Prometheus、OpenTelemetry，不影响现有接口

> 目标：**拿来即用**，一天内可交付可运行的最小后端，并可持续迭代到企业级。

---

## 🚀 快速开始
> 依赖：**Node.js ≥ 20**、**MySQL 8**

```bash
git clone <your-repo-url>.git
cd <your-repo-folder>

cp .env.example .env
npm i

# 开发期可用 docker 启 MySQL
docker compose up -d mysql

# 启动（启用文件监听）
npm run dev
# 打开 http://localhost:3000/docs 查看 OpenAPI
```

**Windows 清理安装：**
```bat
del package-lock.json
rmdir /s /q node_modules
npm i && npm run dev
```

---

## ⚙️ 环境变量（.env）
```ini
NODE_ENV=development
HOST=0.0.0.0
PORT=3000
LOG_LEVEL=info
BODY_LIMIT=1048576

# 数据库（MySQL8）
DATABASE_URL=mysql://root:rootpassword@localhost:3306/appdb

# CORS & 压缩
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
COMPRESSION_THRESHOLD=1024

# JWT
JWT_SECRET=dev_secret_change_me
JWT_TTL=30m

# 速率限制
RATE_LIMIT_MAX=400
RATE_LIMIT_WINDOW=1 minute

# Swagger
SWAGGER_ENABLED=true

# Sequelize 同步策略（开发：alter；生产：none）
DB_SYNC=alter   # alter | force | none
```

---

## 📦 目录结构（核心）
```
src/
  app.js                 # 装配 Fastify 插件
  server.js              # 启动 & 优雅退出
  lib/
    db.js                # Sequelize 初始化
  models/
    tenant.js            # 租户（可选）
    user.js              # 用户（admin/user）
    index.js             # 注册模型与关联
  plugins/
    config.js            # .env -> app.config
    security.js          # helmet / cors / jwt 守卫
    perf.js              # compress / rate-limit
    swagger.js           # /docs 文档
  routes/
    v1/
      health.js          # /v1/health /v1/ready
      auth.js            # 注册 / 登录 / whoami
      users.js           # 用户 CRUD（admin）
# 可选模块（根据需要添加）：
# controllers/test.controller.js、routes/v1/tests.js、routes/v1/tests.schemas.js、models/test.js 等
```

---

## 🔐 认证与多租户
- 注册：`POST /v1/auth/register` → 创建租户 + 管理员，返回 `{ tenantId, userId, accessToken }`
- 登录：`POST /v1/auth/login`
- 会话：`GET /v1/auth/whoami`（需要 `Authorization: Bearer <token>`）

**多租户约定**：后端从 `req.user.tenantId` 限定查询与写入，**不要从客户端接收 `tenantId`**；  
需要“租户内唯一”时加联合唯一（如 `UNIQUE(tenant_id, email)`）。单租户场景可移除/忽略 `tenantId` 字段。

---

## 🧰 常用接口
### 系统
- `GET /v1/health` → `{ status: "ok" }`
- `GET /v1/ready`  → DB 可用则 200，否则 503

### 用户（管理员）
- `GET /v1/users?offset=0&limit=20&role=admin&email=xx`
- `POST /v1/users`  
  ```json
  { "email":"user@demo.io","name":"张三","role":"user","password":"ChangeMe123!" }
  ```
- `PATCH /v1/users/:id` / `DELETE /v1/users/:id`

> 扩展：你可以复制 `users` 的写法，5 分钟内生成业务资源（如 `products`、`orders`、`articles`）。

---

## 🧪 测试模型模板（可选）
若需要“试水”资源，加入以下文件可获得 `Test` 资源：
- `models/test.js`、`controllers/test.controller.js`、`routes/v1/tests.js`、`routes/v1/tests.schemas.js`  
可直接提供：列表、创建、详情、更新、删除（登录/管理员保护可配置）。

---

## ☕ 业务骨架（可选）
可选的“小电商/咖啡”骨架：`product / cart / order` 三表与对应路由（菜单/购物车/下单），用于快速演示小程序或 H5 端。需要时把模块文件加入后 `DB_SYNC=alter` 自动建表即可。

---

## 🐳 Docker
开发（MySQL + 应用）：
```bash
docker compose up -d mysql
npm run dev
```
生产镜像（示例）：
```bash
docker build -t your-org/fastify-freelance-api:latest .
docker run -p 3000:3000 --env-file .env your-org/fastify-freelance-api:latest
```

---

## 📜 约定与最佳实践
- **代码风格**：ESM、明确文件后缀 `.js`、控制器/路由分层  
- **错误返回**：统一 `{ error: { code, message } }`，避免泄露内部细节  
- **分页**：轻量使用 `offset/limit`；高并发可切换“游标分页（id/时间戳）”  
- **索引**：常用过滤建立复合索引（如 `(tenant_id, status)`）  
- **安全**：`helmet`、严格 CORS 白名单、JWT TTL 合理、避免把敏感字段返回给前端  
- **配置**：`.env` 分环境维护，生产关闭 `DB_SYNC`、开启只读账号/最小权限

---

## 🧰 NPM Scripts
```bash
npm run dev      # 开发启动（node --watch）
npm start        # 生产模式（直接跑 src/server.js）
npm run openapi  # 导出 OpenAPI JSON（需 SWAGGER_ENABLED=true）
```
**压测建议**（健康检查为例）：
```bash
npx autocannon -c 100 -d 20 http://localhost:3000/v1/health
```

---

## 🛠️ 常见问题（FAQ）
- **装包失败 / 版本冲突**：请使用 Node ≥ 20；删除 `node_modules` 与 `package-lock.json` 后重装  
- **ESM 找不到文件**：确保 `import` 路径带 `.js` 后缀，文件名/大小写与目录一致  
- **/docs 打不开**：`.env` 中 `SWAGGER_ENABLED=true`  
- **连不上 DB**：`DATABASE_URL` 正确；Docker 场景使用服务名 `mysql` 而非 `localhost`  
- **字段/表不同步**：开发期 `DB_SYNC=alter`；生产环境请使用迁移并设 `DB_SYNC=none`

---

## 📄 许可
MIT（按你的业务自由修改与分发）

> 如需生成“带你项目名”的成品 README（自动替换标题、示例镜像名等），告诉我项目名即可。
