// 创建 Axios 实例的构造函数。
function Axios(config) {
  // 存储默认配置选项。
  this.default = config;

  // 创建请求和响应的拦截器管理器。
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager(),
  };
}

// 将 'request' 方法添加到 Axios.prototype 上。
Axios.prototype.request = function (config) {
  // 使用提供的配置创建一个 Promise。
  let promise = Promise.resolve(config);

  // 创建请求拦截器的处理链。
  let chain = [dispatchRequest, undefined];

  // 将请求拦截器添加到处理链的开头。
  this.interceptors.request.handlers.forEach((item) => {
    chain.unshift(item.fulfilled, item.rejected);
  });

  // 将响应拦截器添加到处理链的末尾。
  this.interceptors.response.handlers.forEach((item) => {
    chain.push(item.fulfilled, item.rejected);
  });

  // 依次执行拦截器处理链。
  while (chain.length > 0) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  // 返回最终的 Promise。
  return promise;
};

// 为 Axios.prototype 添加 'get' 方法，用于发起 GET 请求。
Axios.prototype.get = function (config) {
  return this.request({ method: "GET", ...config });
};

// 为 Axios.prototype 添加 'post' 方法，用于发起 POST 请求。
Axios.prototype.post = function (config) {
  return this.request({ method: "POST", ...config });
};

// 创建拦截器管理器的构造函数。
function InterceptorManager() {
  this.handlers = [];
}

// 为拦截器管理器添加 'use' 方法，用于添加拦截器。
InterceptorManager.prototype.use = function (fulfilled, rejected) {
  this.handlers.push({
    fulfilled,
    rejected,
  });
};

// 创建用于创建 Axios 实例的函数。
const createInstance = function (config) {
  // 使用提供的配置创建一个新的 Axios 实例。
  const context = new Axios(config);

  // 创建一个与 Axios 实例的 'request' 方法绑定的实例。
  const instance = Axios.prototype.request.bind(context);

  // 复制属性从 Axios 实例到新的实例。
  for (const key in context) {
    instance[key] = context[key];
  }

  // 返回新的实例。
  return instance;
};

// 创建用于使用 XMLHttpRequest 发送请求的函数。
const dispatchRequest = function (config) {
  return xhrAdapt(config).then((response) => {
    return response;
  });
};

// 创建用于执行 XMLHttpRequest 的函数。
const xhrAdapt = function (config) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(config.method, config.url);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            config: config,
            status: xhr.status,
            statusText: xhr.statusText,
            data: xhr.response,
            headers: xhr.getAllResponseHeaders(),
            request: xhr,
          });
        } else {
          reject(new Error("请求失败，请求状态码为" + xhr.status));
        }
      }
    };
  });
};

// 将 createInstance 函数作为默认导出。
export default createInstance;
