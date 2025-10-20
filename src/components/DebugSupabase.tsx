import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DebugSupabase = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>("Testing...");
  const [postsCount, setPostsCount] = useState<number>(0);
  const [publishedPostsCount, setPublishedPostsCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("🔍 Testing Supabase connection...");
        console.log("Environment variables:");
        console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
        console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "Present" : "Missing");
        console.log("VITE_SUPABASE_PUBLISHABLE_KEY:", import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "Present" : "Missing");
        console.log("Supabase client URL:", supabase.supabaseUrl);
        console.log("Supabase client key:", supabase.supabaseKey ? "Present" : "Missing");
        
        // Test basic connection
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .limit(5);
        
        if (error) {
          setError(error.message);
          setConnectionStatus("❌ Connection failed");
          console.error("❌ Supabase error:", error);
          return;
        }
        
        setConnectionStatus("✅ Connected");
        setPostsCount(data?.length || 0);
        console.log("✅ Connection successful, posts found:", data?.length || 0);
        
        // Test published posts
        const { data: publishedPosts, error: publishedError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true);
        
        if (publishedError) {
          console.error("❌ Error fetching published posts:", publishedError);
          return;
        }
        
        setPublishedPostsCount(publishedPosts?.length || 0);
        console.log("📰 Published posts:", publishedPosts?.length || 0);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setConnectionStatus("❌ Connection failed");
        console.error("❌ General error:", err);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">🔧 Supabase Debug</h3>
      <div className="text-xs space-y-1">
        <div>Status: {connectionStatus}</div>
        <div>Total posts: {postsCount}</div>
        <div>Published posts: {publishedPostsCount}</div>
        {error && <div className="text-red-500">Error: {error}</div>}
        <div className="text-gray-500">
          URL: {import.meta.env.VITE_SUPABASE_URL ? "✅" : "❌"}
        </div>
        <div className="text-gray-500">
          Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? "✅" : "❌"}
        </div>
      </div>
    </div>
  );
};

export default DebugSupabase;
