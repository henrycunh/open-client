import axios from 'axios';

const defineClient = (options) => {
  return (path, method) => {
    const {
      onRequest,
      onRequestError,
      onResponse,
      onResponseError,
      ...configuration
    } = options || {};
    const http = axios.create(configuration);
    http.interceptors.request.use;
    if (onRequest || onRequestError) {
      http.interceptors.request.use(onRequest, onRequestError);
    }
    if (onResponse || onResponseError) {
      http.interceptors.response.use(onResponse, onResponseError);
    }
    return (...options2) => {
      let transformedPath = path;
      function hasOption(option, options3) {
        return option in (options3 || {});
      }
      if (hasOption("path", options2)) {
        transformedPath = path.replace(/{([^}]+)}/g, (_, p) => options2.path[p]);
      }
      if (method === "get") {
        return http.get(
          `${transformedPath}`,
          {
            params: hasOption("query", options2) ? options2.query : void 0
          }
        );
      } else if (method === "post") {
        return http.post(
          `${transformedPath}`,
          hasOption("body", options2) ? options2.body : void 0,
          {
            params: hasOption("query", options2) ? options2.query : void 0
          }
        );
      } else if (method === "put") {
        return http.put(
          `${transformedPath}`,
          hasOption("body", options2) ? options2.body : void 0,
          {
            params: hasOption("query", options2) ? options2.query : void 0
          }
        );
      } else if (method === "delete") {
        return http.delete(
          `${transformedPath}`,
          {
            params: hasOption("query", options2) ? options2.query : void 0
          }
        );
      } else if (method === "patch") {
        return http.patch(
          `${transformedPath}`,
          hasOption("body", options2) ? options2.body : void 0,
          {
            params: hasOption("query", options2) ? options2.query : void 0
          }
        );
      }
    };
  };
};

export { defineClient };
