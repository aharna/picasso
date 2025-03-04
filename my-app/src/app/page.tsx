"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [thePrompt, setThePrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState("");

  const generateImage = async () => {
    // Make sure we have a prompt to work with
    if (!thePrompt) return;
  
    // Start the loading indicator
    setIsLoading(true);
  
    try {
      const response = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({ prompt: thePrompt }),
      });
  
      if (response.ok) {
        console.log("Image generated successfully");
  
        // Grab the response from the backend as a blob (binary object)
        // and convert it to an image object URL
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
  
        // Set the image URL state variable
        setApiResponse(imageUrl);
      } else {
        console.error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error occurred during API call:", error);
    }
  
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen bg-gray-900 flex-col items-center justify-between px-24 py-12">
      <h1 className=" text-5xl mb-4">Imagenerator</h1>
      <div className="mb-4">
        This is a project that uses Stable Diffusion to generate images from text
        prompts
      </div>
      <div>
        <input
          type="text"
          className="border p-1 text-black rounded-sm border-gray-600"
          value={thePrompt}
          onChange={(event) => {
            setThePrompt(event.target.value);
          }}
        />
  
        <button
          className="bg-blue-600 px-5 py-1 ml-2 h-max rounded-sm disabled:cursor-not-allowed disabled:bg-blue-900 transition-colors"
          onClick={generateImage}
          disabled={isLoading || !thePrompt}
        >
          Go!{" "}
        </button>
      </div>
      <div className="w-80 h-80 relative">
        {apiResponse ? <img src={apiResponse} /> : ""}
      </div>
    </main>
  );
}