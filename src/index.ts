import { PluginOption } from 'vite'
import { generateClient, generateTypes } from './generate'
import { style } from 'kleur-template'

const plugin = (options: OpenClientOptions): PluginOption => {

    const virtualModuleId = 'api:' + options.apiName || 'client'
    const resolvedVirtualModuleId = '\0' + virtualModuleId

    return {
        name: 'open-client',
        enforce: 'pre',
        async buildStart () {
            console.log(
                style`[open-client](green.bold) Building client for [${options.apiName}](blue)...`,
            )
            await generateTypes(options.definition, options.apiName || 'client')
        },
        async load (id) {
            if (id === resolvedVirtualModuleId) {
                return generateClient()
            }
        },
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }
        },
    }
}

export default plugin

interface OpenClientOptions {
    // Either the path to the OpenAPI definition file or the URL to the OpenAPI definition file
    definition: string
    /**
     * The name of the generated client, this will define how you import the client in your code
     * For example, if you set this to `my-api`, you will import the client like this:
     * ```
     * import client from 'api:my-api'
     * ```
     */
    apiName?: string
}


