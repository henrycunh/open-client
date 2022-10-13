
import fs from 'fs'
import OpenApiTS from 'openapi-typescript'
import axios from 'axios'
import path from 'path'

const isSpecUrl = (url: string) => url.startsWith('http')

const getSpecContent = async (url: string) => {
    if (isSpecUrl(url)) {
        const { data } = await axios.get(url)
        return data
    }
    return fs.readFileSync(
        path.resolve(process.cwd(), url),
        'utf-8'
    )
}

const getDefinitionFromSpec = async (specContent: string) => {
    return (await OpenApiTS(specContent, {}))
        .replace(/export /g, '')
}

export const generateTypes = async (url: string, moduleName: string) => {
    const specificationContent = await getSpecContent(url)
    const output = await getDefinitionFromSpec(specificationContent)

    // Read the file `client-types.d.ts` relative to the current file
    const clientTypes = fs.readFileSync(
        path.join(__dirname, './templates/client.d.ts'),
        'utf-8'
    )

    const APISchemaType = 'export type APISchema<T extends keyof definitions> = definitions[T];'

    // Generate the `open-client.d.ts` file
    const types = [
        '/// <reference types="axios" />',
        '/// <reference types="vite/client" />',
        '',
        output,
        '',
        clientTypes
            .replace(/{{ module-name }}/, 'api:' + moduleName)
            .replace(/interface paths \{[^\}]*\}/, '')
            .replace(/"__PLACEHOLDER__"/, 'keyof paths')
            .replace(/declare /g, '')
            .replace(/type paths \= \{[^\}]*\};/g, '')
            .replace(/import \{[^\}]*\} from '[^\}]*';/g, '')
            .replace(/(const[^]*)/, [
                `declare module 'api:${moduleName}' {`,
                '',
                '$1',
                '',
                APISchemaType,
                '',
                '}',
            ].join('\n'))
    ].join('\n')

    // Write the types to the `open-client.d.ts` file
    fs.writeFileSync(
        path.resolve(process.cwd(), 'open-client.d.ts'),
        types
    )
}

export const generateClient = async (): Promise<string> => {
    // Read the file `client.ts` relative to the current file
    const client = fs.readFileSync(
        path.join(__dirname, './templates/client.mjs'),
        'utf-8'
    )

    // Add the imports to the top of the generated file
    return client
}