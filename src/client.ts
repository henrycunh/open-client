import axios from 'axios'
import type { AxiosResponse, AxiosRequestConfig, CreateAxiosDefaults } from 'axios'

type paths = { __PLACEHOLDER__: '' }

type APIPaths = keyof paths
type PathMethods<P extends APIPaths> = keyof paths[P]
type PathResponses<P extends APIPaths, M extends PathMethods<P>> = paths[P][M] extends { responses: infer R } ? R : null | undefined
type InferSuccessfulResponse<P extends APIPaths, M extends PathMethods<P>> = PathResponses<P, M> extends { 200: infer R } 
    ? R extends { content: { 'application/json': infer C } } ? C : unknown 
    : unknown

type QueryParametersFromPath<P extends APIPaths, M extends PathMethods<P>> = paths[P][M] extends { parameters: infer R } ? (R extends { query: infer Q } ? Q : undefined) : undefined
type PathParameterFromPath<P extends APIPaths, M extends PathMethods<P>> = paths[P][M] extends { parameters: infer R } ? (R extends { path: infer PA } ? PA : undefined) : undefined
type RequestBodyFromPath<P extends APIPaths, M extends PathMethods<P>> = paths[P][M] extends { requestBody: infer R }
    ? (
        R extends { content: { 'application/json': infer C } } ? C : undefined
    )
    : paths[P][M] extends {
        parameters: infer R;
    } ? (R extends {
        body: infer B;
    } ? B : undefined) : undefined;

type IsOptional<T> = T extends object 
    ? Partial<T> extends T ? true : false 
    : false;

type IsObjectEmpty<T> = T extends object ? keyof T extends never ? true : false : false

type RequestOptions<P extends APIPaths, M extends PathMethods<P>> = (
    QueryParametersFromPath<P, M> extends undefined ? {} : 
        IsOptional<QueryParametersFromPath<P, M>> extends true ? { query?: QueryParametersFromPath<P, M> } : { query: QueryParametersFromPath<P, M> }
) & (
    PathParameterFromPath<P, M> extends undefined ? {} : { path: PathParameterFromPath<P, M> }
) & (
    RequestBodyFromPath<P, M> extends undefined ? {} : { body: RequestBodyFromPath<P, M> }
)

export const defineClient = (options?: CreateAxiosDefaults & {
    onRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
    onRequestError?: (error: any) => any
    onResponse?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
    onResponseError?: (error: any) => any
}) => {
    return <T extends APIPaths, U extends PathMethods<T>>(path: T, method: U) => {
        type RequestResponse = InferSuccessfulResponse<T, U>

        const { 
            onRequest, 
            onRequestError, 
            onResponse, 
            onResponseError, 
            ...configuration 
        } = options || {}

        const http = axios.create(configuration)
        http.interceptors.request.use
        if (onRequest || onRequestError) {
            http.interceptors.request.use(onRequest, onRequestError)
        }
        if (onResponse || onResponseError) {
            http.interceptors.response.use(onResponse, onResponseError)
        }
        
        return (
            ...options: IsObjectEmpty<RequestOptions<T, U>> extends true ? [] : 
                IsOptional<RequestOptions<T, U>> extends true ? [RequestOptions<T, U>?] :
                [RequestOptions<T, U>]
        ) => {
            let transformedPath = path as string
    
            // Make sure the `path` parameter is provided if the path has a path parameter
            function hasOption <O extends 'path' | 'body' | 'query'>(option: O, options: RequestOptions<T, U> | undefined): options is RequestOptions<T, U> & { [key in O]: any } {
                return option in (options || {})
            }
            
            if (hasOption('path', options)) {
                transformedPath = path.replace(/{([^}]+)}/g, (_, p) => (options.path as any)[p])
            }
    
            if (method === 'get') {
                return http.get<RequestResponse>(
                    `${transformedPath}`, 
                    { 
                        params: hasOption('query', options) ? options.query : undefined, 
                    }
                )
            }
            else if (method === 'post') {
                return http.post<RequestResponse>(
                    `${transformedPath}`, 
                    hasOption('body', options) ? options.body : undefined, 
                    { 
                        params: hasOption('query', options) ? options.query : undefined,
                    }
                )
            }
            else if (method === 'put') {
                return http.put<RequestResponse>(
                    `${transformedPath}`, 
                    hasOption('body', options) ? options.body : undefined, 
                    { 
                        params: hasOption('query', options) ? options.query : undefined,
                    }
                )
            }
            else if (method === 'delete') {
                return http.delete<RequestResponse>(
                    `${transformedPath}`, 
                    { 
                        params: hasOption('query', options) ? options.query : undefined, 
                    }
                )
            }
            else if (method === 'patch') {
                return http.patch<RequestResponse>(
                    `${transformedPath}`, 
                    hasOption('body', options) ? options.body : undefined, 
                    { 
                        params: hasOption('query', options) ? options.query : undefined,
                    }
                )
            }
        }
    }
}
