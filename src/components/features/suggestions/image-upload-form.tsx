"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, UploadCloud, Image as ImageIcon, AlertCircle, Sparkles } from "lucide-react";
import { suggestActionsFromPhoto, type SuggestActionsFromPhotoOutput } from "@/ai/flows/suggest-actions-from-photo";
import NextImage from "next/image"; // Renamed to avoid conflict with Lucide icon

export function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestActionsFromPhotoOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File is too large. Please upload an image under 5MB.");
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setSuggestions(null);
      setError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Please select an image file.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const photoDataUri = reader.result as string;
        if (!photoDataUri.startsWith('data:image/')) {
          setError("Invalid file type. Please upload an image (e.g., PNG, JPG).");
          setIsLoading(false);
          return;
        }
        const result = await suggestActionsFromPhoto({ photoDataUri });
        setSuggestions(result);
      };
      reader.onerror = () => {
        setError("Failed to read the file. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? `AI Error: ${err.message}` : "An unknown error occurred while fetching suggestions.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-xl mx-auto shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Get Smart Suggestions
          </CardTitle>
          <CardDescription>Upload a photo of an object, and our AI will suggest eco-friendly actions you can take.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image-upload" className="text-sm font-medium">Upload Image</Label>
              <Input 
                id="image-upload" 
                type="file" 
                accept="image/png, image/jpeg, image/webp, image/gif" 
                onChange={handleFileChange} 
                className="file:text-primary file:font-semibold file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:bg-primary/10 hover:file:bg-primary/20 transition-colors" 
              />
              <p className="text-xs text-muted-foreground">Max file size: 5MB. Supported formats: PNG, JPG, WEBP, GIF.</p>
            </div>
            {previewUrl && (
              <div className="mt-4 p-4 border rounded-md bg-muted/30">
                <p className="text-sm font-medium mb-2 text-foreground flex items-center gap-2"><ImageIcon className="w-4 h-4" />Image Preview:</p>
                <NextImage src={previewUrl} alt="Preview" width={200} height={200} className="rounded-md object-contain max-h-48 w-auto mx-auto shadow-md" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button type="submit" disabled={isLoading || !file} size="lg" className="shadow-sm">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-5 w-5" />
                  Get Suggestions
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive" className="max-w-xl mx-auto shadow">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Oops! Something went wrong.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestions && (
        <Card className="max-w-xl mx-auto shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              Eco-Actions Suggested
            </CardTitle>
          </CardHeader>
          <CardContent>
            {suggestions.actions.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5 text-foreground">
                {suggestions.actions.map((action, index) => (
                  <li key={index} className="text-sm leading-relaxed">{action}</li>
                ))}
              </ul>
            ) : (
               <p className="text-sm text-muted-foreground">The AI couldn't identify specific actions for this image, or no specific eco-actions apply. Try uploading a different photo of a common object!</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
