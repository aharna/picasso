import { NextRequest, NextResponse } from "next/server";

// Create a POST API Route
export async function POST(req:NextRequest, res:NextResponse) {
  // Extract the prompt from the request body
  const request = await req.json()
  const prompt = request.prompt as string;

  // Call Hugging Face with our API Key
  const response = await fetch(
    "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
    {
      headers: { Authorization: `Bearer ${process.env.HF_APIKEY}` },
      method: "POST",
      body: JSON.stringify(prompt),
    }
  );

  // Hugging Face will return us the generated image as a blob, forward it to our frontend
  const result = await response.blob();
  const finalResponse = new NextResponse(result)
  return finalResponse
}
