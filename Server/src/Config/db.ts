import { Client } from "pg";

export const client = new Client({

     host:'localhost',
     port:5432,
     database:'usermanagment',
     user:'postgres',
     password:'ziya@1234'
,
})

export default async ()=> await client.connect()