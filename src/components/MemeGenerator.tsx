import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Download, Sparkles, Loader2 } from "lucide-react";

export const MemeGenerator = () => {
  const [topic, setTopic] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMeme = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic!");
      return;
    }

    setIsGenerating(true);
    setCaption("");
    setImageUrl("");

    try {
      // Generate caption
      const captionResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-caption`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ topic }),
        }
      );

      if (!captionResponse.ok) {
        const error = await captionResponse.json();
        throw new Error(error.error || "Failed to generate caption");
      }

      const { caption: generatedCaption } = await captionResponse.json();
      setCaption(generatedCaption);

      // Generate image
      const imageResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-meme-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ caption: generatedCaption, topic }),
        }
      );

      if (!imageResponse.ok) {
        const error = await imageResponse.json();
        throw new Error(error.error || "Failed to generate image");
      }

      const { imageUrl: generatedImageUrl } = await imageResponse.json();
      setImageUrl(generatedImageUrl);

      toast.success("Meme generated! 🎉");
    } catch (error) {
      console.error("Error generating meme:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate meme");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadMeme = () => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `meme-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Meme downloaded!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Input Section */}
      <Card className="p-8 backdrop-blur-sm bg-card/80 border-primary/20 shadow-glow-primary">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              What's your meme about?
            </label>
            <div className="flex gap-3">
              <Input
                placeholder="e.g., Monday mornings, programming bugs, cats..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isGenerating && generateMeme()}
                className="flex-1 bg-input/50 border-primary/20 focus:border-primary h-12 text-base"
                disabled={isGenerating}
              />
              <Button
                onClick={generateMeme}
                disabled={isGenerating || !topic.trim()}
                size="lg"
                className="bg-gradient-meme hover:opacity-90 transition-all shadow-glow-primary hover:shadow-glow-secondary min-w-[140px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Forging...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Meme Display */}
      {(caption || imageUrl || isGenerating) && (
        <Card className="p-8 backdrop-blur-sm bg-card/80 border-primary/20 shadow-glow-secondary overflow-hidden">
          <div className="space-y-6">
            {/* Caption */}
            {caption && (
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-primary">Your Meme Caption</h3>
                <p className="text-xl font-semibold text-foreground leading-relaxed px-4">
                  {caption}
                </p>
              </div>
            )}

            {/* Image */}
            <div className="relative rounded-xl overflow-hidden bg-muted/50 min-h-[400px] flex items-center justify-center">
              {isGenerating && !imageUrl && (
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  <p className="text-lg">Crafting your viral masterpiece...</p>
                </div>
              )}
              
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Generated meme"
                  className="w-full h-auto rounded-lg"
                />
              )}
            </div>

            {/* Download Button */}
            {imageUrl && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={downloadMeme}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 transition-all shadow-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Meme
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
