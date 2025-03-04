import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest, res:NextResponse) {
 
  const request = await req.json()
  const prompt = request.prompt as string;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
    {
      headers: { Authorization: `Bearer ${process.env.HF_APIKEY}` },
      method: "POST",
      body: JSON.stringify(prompt),
    }
  );

  const result = await response.blob();
  const finalResponse = new NextResponse(result)
  return finalResponse
}
