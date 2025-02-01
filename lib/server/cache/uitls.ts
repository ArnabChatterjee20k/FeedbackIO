import {Redis} from "@upstash/redis"
import * as dotenv from "dotenv"
dotenv.configDotenv({path:".env"})
const REDIS_URI = process.env.UPSTASH_REDIS_REST_URL
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
export const ONE_HOUR_TTL = 3600
export function getCache(){
    return new Redis({
      url: REDIS_URI,
      token: TOKEN
    })
}