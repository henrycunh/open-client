import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: [
        process.env.BUILD_TEMPLATES ? {
            input: 'src/client.ts',
            name: 'client'
        } : {
            input: 'src/index',
        }
    ],
    outDir: process.env.BUILD_TEMPLATES ? 'src/templates' : 'dist',
    declaration: true,
    failOnWarn: false
})