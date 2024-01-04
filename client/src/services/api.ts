import axios, {AxiosError} from 'axios'
import { parseCookies } from 'nookies'

export function setupAPIClient(ctx = undefined){
    let cookies = parseCookies(ctx)

    const api = axios.create({
        baseURL: 'http://localhost:3333',
    })

    api.interceptors.response.use(response => {
        return response
    }, (error: AxiosError) => {})

    return api
}