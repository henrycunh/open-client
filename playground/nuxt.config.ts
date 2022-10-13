import OpenClient from 'vite-plugin-open-client'

export default defineNuxtConfig({
    vite: {
        plugins: [
            OpenClient({
                definition: 'https://petstore.swagger.io/v2/swagger.json',
                apiName: 'petstore'
            })
        ]
    }
})
