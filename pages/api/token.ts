import { NextResponse } from "next/server";

export const runtime = 'edge';

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_KV_TOKEN!;
const ACCOUNT_ID = process.env.ACCOUNT_ID
const NAMESPACE_ID = process.env.NAMESPACE_ID
const KV_API_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/token`;

export default async function GET(req: Request) {

    const response = await fetch(KV_API_URL, {
        method: "GET",
        headers:{
            "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        cache: "no-store"
    })

    const CurrentToken = await response.text(); // ここで一度 JSON に変換して返す

    try{
        return NextResponse.json({"token": CurrentToken})
    }catch(err){
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }

    
  }