import { CreateAxiosDefaults, AxiosRequestConfig, AxiosResponse } from 'axios';

declare type paths = {
    __PLACEHOLDER__: '';
};
declare type APIPaths = keyof paths;
declare type PathMethods<P extends APIPaths> = keyof paths[P];
declare type PathResponses<P extends APIPaths, M extends PathMethods<P>> = paths[P][M] extends {
    responses: infer R;
} ? R : null | undefined;
declare type InferSuccessfulResponse<P extends APIPaths, M extends PathMethods<P>> = PathResponses<P, M> extends {
    200: infer R;
} ? R extends {
    content: {
        'application/json': infer C;
    };
} ? C : unknown : unknown;
declare type QueryParametersFromPath<P extends APIPaths, M extends PathMethods<P>> = paths[P][M] extends {
    parameters: infer R;
} ? (R extends {
    query: infer Q;
} ? Q : undefined) : undefined;
declare type PathParameterFromPath<P extends APIPaths, M extends PathMethods<P>> = paths[P][M] extends {
    parameters: infer R;
} ? (R extends {
    path: infer PA;
} ? PA : undefined) : undefined;
declare type RequestBodyFromPath<P extends APIPaths, M extends PathMethods<P>> = paths[P][M] extends {
    requestBody: infer R;
} ? (R extends {
    content: {
        'application/json': infer C;
    };
} ? C : undefined) : paths[P][M] extends {
    parameters: infer R;
} ? (R extends {
    body: infer B;
} ? B : undefined) : undefined;
declare type IsOptional<T> = T extends object ? Partial<T> extends T ? true : false : false;
declare type IsObjectEmpty<T> = T extends object ? keyof T extends never ? true : false : false;
declare type RequestOptions<P extends APIPaths, M extends PathMethods<P>> = (QueryParametersFromPath<P, M> extends undefined ? {} : IsOptional<QueryParametersFromPath<P, M>> extends true ? {
    query?: QueryParametersFromPath<P, M>;
} : {
    query: QueryParametersFromPath<P, M>;
}) & (PathParameterFromPath<P, M> extends undefined ? {} : {
    path: PathParameterFromPath<P, M>;
}) & (RequestBodyFromPath<P, M> extends undefined ? {} : {
    body: RequestBodyFromPath<P, M>;
});
declare const defineClient: (options?: (CreateAxiosDefaults<any> & {
    onRequest?: ((config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>) | undefined;
    onRequestError?: ((error: any) => any) | undefined;
    onResponse?: ((response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>) | undefined;
    onResponseError?: ((error: any) => any) | undefined;
}) | undefined) => <T extends "__PLACEHOLDER__", U extends keyof paths[T]>(path: T, method: U) => (...options: IsObjectEmpty<RequestOptions<T, U>> extends true ? [] : IsOptional<RequestOptions<T, U>> extends true ? [(RequestOptions<T, U> | undefined)?] : [RequestOptions<T, U>]) => Promise<AxiosResponse<InferSuccessfulResponse<T, U>, any>> | undefined;

export { defineClient };
