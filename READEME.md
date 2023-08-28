# Axios 实现简介

这个项目是一个简化版的 Axios，目标是帮助理解 Axios 的工作原理。它可以用于在浏览器中发送异步网络请求，并提供了请求和响应拦截器、GET 和 POST 方法等功能。

## 用法

### 创建 Axios 实例

你可以使用以下方式创建一个 Axios 实例：

```javascript
import createInstance from "axios.js";

const axiosInstance = createInstance({
  // 在这里配置默认选项，例如 method、url 等。
});
```

### 发起 GET 请求

使用 get 方法发起 GET 请求：

```javascript
axiosInstance
  .get({
    url: "https://api.example.com/data",
  })
  .then((response) => {
    // 处理响应数据
  })
  .catch((error) => {
    // 处理请求错误
  });
```

### 请求拦截器和响应拦截器

你可以添加请求拦截器和响应拦截器来在请求和响应之前进行处理：

```javascript
axiosInstance.interceptors.request.use(
  (config) => {
    // 在请求发送前进行处理
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // 在收到响应后进行处理
    return response;
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error);
  }
);
```

## 架构

- `Axios`构造函数：用于创建 Axios 实例，并管理默认配置选项以及拦截器。
- `InterceptorManager` 构造函数：用于创建请求和响应拦截器管理器，允许添加拦截器函数。
- `xhrAdapt` 函数：用于执行 XMLHttpRequest 请求，将其适配为 Promise。
- `createInstance` 函数：用于创建 Axios 实例，并将其与请求方法绑定，以便直接使用。

## 注意事项

- 这个实现是一个简化版的 Axios，并且仅支持基本的 GET 和 POST 请求。
- 此代码示例中使用了 ES6 模块导出，你可能需要根据你的项目配置进行调整。
- 在实际项目中，应该根据需要添加更多功能和错误处理。

## 贡献

如果你发现了问题或者想要改进此简化版的 Axios，请随时提出 issue 或提交 pull request。我们欢迎你的贡献！

## 许可证

这个项目基于 MIT 许可证开源。详情请参阅 LICENSE 文件。
