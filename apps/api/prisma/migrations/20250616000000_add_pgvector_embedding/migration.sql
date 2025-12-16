-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to Business table (768 dimensions for Google text-embedding-004)
ALTER TABLE "public"."Business" ADD COLUMN "embedding" vector(768);

-- Create index for faster similarity search
CREATE INDEX "Business_embedding_idx" ON "public"."Business" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);
