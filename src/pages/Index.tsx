import { MemeGenerator } from "@/components/MemeGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-meme p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4 pt-8">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground animate-fade-in">
            Meme-It
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Turn any idea into viral-ready memes with AI magic ✨
          </p>
        </header>

        {/* Meme Generator */}
        <MemeGenerator />

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-12 pb-6">
          <p>Powered by Lovable AI • Create unlimited memes</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
