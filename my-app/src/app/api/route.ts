import { NextRequest, NextResponse } from "next/server";
//Important things to note:
//HuggingFace API is used here to generate images from text prompts.
//Ensure that write access is enabled for the API key.
//The API key is stored in the environment variable HF_APIKEY.
export async function POST(req: NextRequest) {
  console.log("checkpoint 1: API called");
  try {
    const request = await req.json();
    const prompt = request.prompt as string;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Check if API key is available
    const apiKey = process.env.HF_APIKEY;
    if (!apiKey) {
      console.error("Missing Hugging Face API key");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log(`Processing prompt: "${prompt}"`);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        headers: { 
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API error:", errorText);
      
      if (response.status === 403) {
        return NextResponse.json(
          { error: "Authentication failed. Please check your Hugging Face API key." },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: response.status }
      );
    }

    console.log("checkpoint 2: Image generated successfully");
    const imageBlob = await response.blob();
    return new NextResponse(imageBlob, {
      headers: {
        "Content-Type": imageBlob.type,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
