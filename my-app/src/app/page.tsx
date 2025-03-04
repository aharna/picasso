"use client";

import { useState } from "react";
import Image from "next/image";
//This is the frontend component that will be rendered in the browser.
// Two main sub components-> Input field and Image display
export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const generateImage = async () => {
    setIsLoading(true);
    setError("");
    
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      setIsLoading(false);
      return;
    }
    // This try-catch block is used to handle errors that may occur during the API call.
    // Hopefully, there is no error :)
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        console.log("Image generated successfully");
      } else {
        const errorData = await response.json().catch(() => ({ error: "Failed to generate image" }));
        setError(errorData.error || "Failed to generate image");
        console.error("API error:", errorData);
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Error occurred during API call:", error);
    } finally {
      setIsLoading(false);
    }
  };
//This is the main component that will be rendered in the browser.
  return (
    <main className="flex min-h-screen bg-gray-900 text-white flex-col items-center justify-between px-4 md:px-24 py-12">
      <div className="max-w-2xl w-full flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Picasso</h1>
        
        <p className="text-center mb-8 text-gray-300">
          This is a project that uses Stable Diffusion to generate images from text prompts
        </p>
        
        <div className="w-full mb-8">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="text"
              className="flex-grow border p-3 text-black rounded-md border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your image description..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading && prompt.trim()) {
                  generateImage();
                }
              }}
            />
            
            <button
              className="bg-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-700 
                disabled:cursor-not-allowed disabled:bg-blue-900 transition-colors"
              onClick={generateImage}
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>
          
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>
        
        <div className="w-full max-w-md aspect-square relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : imageUrl ? (
            
            <img 
              src={imageUrl} 
              alt={prompt}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center flex-col p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-center">
                Your generated image will appear here
              </p>
            </div>
          )}
        </div>
        
        {imageUrl && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400 mb-2">
              Prompt: "{prompt}"
            </p>
            <button
              onClick={() => {
                setPrompt("");
                setImageUrl("");
              }}
              className="text-blue-500 hover:text-blue-400 text-sm"
            >
              Generate another image
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
