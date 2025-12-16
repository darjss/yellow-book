'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { MessageSquare, ArrowLeft, Send, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import { Loader } from '@/components/ai-elements/loader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function AssistantPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: `${API_URL}/api/ai/chat`,
    }),
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const suggestedQuestions = [
    'What restaurants are open late?',
    'Find me a plumber nearby',
    'Which businesses offer delivery?',
    'What are the top-rated services?',
  ];

  // Helper to extract text from message parts
  const getMessageText = (message: (typeof messages)[0]): string => {
    return message.parts
      .filter(
        (part): part is { type: 'text'; text: string } => part.type === 'text'
      )
      .map((part) => part.text)
      .join('');
  };

  return (
    <div className="min-h-screen w-full bg-background relative flex flex-col">
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <header className="border-b-2 border-primary bg-card/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="vintage-subheading text-primary hover:bg-primary/10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Directory
                </Button>
              </Link>
              <div className="text-center flex-1">
                <h1 className="vintage-heading text-3xl md:text-4xl text-primary mb-1">
                  DIRECTORY ASSISTANT
                </h1>
                <p className="vintage-subheading text-sm text-muted-foreground">
                  Ask me about local businesses
                </p>
              </div>
              <div className="w-[140px]" /> {/* Spacer for centering */}
            </div>
            <div className="w-24 h-1 bg-secondary mx-auto mt-4"></div>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
          <Card className="flex-1 flex flex-col bg-card/50 border-2 border-border shadow-lg overflow-hidden min-h-[500px]">
            <Conversation className="flex-1">
              <ConversationContent className="p-6">
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    className="h-full"
                    icon={
                      <BookOpen className="h-16 w-16 text-primary opacity-60" />
                    }
                    title=""
                    description=""
                  >
                    <div className="flex flex-col items-center gap-6">
                      <div className="text-center">
                        <h3 className="vintage-heading text-2xl text-primary mb-2">
                          Welcome to the Directory Assistant
                        </h3>
                        <p className="vintage-body text-muted-foreground max-w-md">
                          I can help you find local businesses, answer questions
                          about their services, hours, and more. Just ask!
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                        {suggestedQuestions.map((question) => (
                          <button
                            key={question}
                            onClick={() => {
                              setInput(question);
                              textareaRef.current?.focus();
                            }}
                            className="p-3 text-left vintage-body text-sm border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                          >
                            <MessageSquare className="h-4 w-4 text-accent mb-1" />
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  </ConversationEmptyState>
                ) : (
                  <>
                    {messages.map((message) => (
                      <Message key={message.id} from={message.role}>
                        <MessageContent
                          className={
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }
                        >
                          {message.role === 'assistant' ? (
                            <MessageResponse className="vintage-body prose prose-sm max-w-none prose-headings:vintage-heading prose-headings:text-primary prose-p:text-foreground prose-strong:text-primary prose-ul:text-foreground prose-li:text-foreground">
                              {getMessageText(message)}
                            </MessageResponse>
                          ) : (
                            <span className="vintage-body">
                              {getMessageText(message)}
                            </span>
                          )}
                        </MessageContent>
                      </Message>
                    ))}

                    {status === 'submitted' && (
                      <Message from="assistant">
                        <MessageContent className="bg-muted">
                          <div className="flex items-center gap-2 vintage-body text-muted-foreground">
                            <Loader size={16} />
                            <span>Searching the directory...</span>
                          </div>
                        </MessageContent>
                      </Message>
                    )}
                  </>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            {/* Input Area */}
            <div className="border-t-2 border-border bg-card p-4">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      placeholder="Ask about local businesses..."
                      className="vintage-body w-full bg-input border-2 border-border focus:border-primary rounded-lg min-h-[60px] p-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="absolute bottom-3 right-3 bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 p-0"
                      size="icon"
                    >
                      {isLoading ? (
                        <Loader size={16} />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs vintage-body text-muted-foreground">
                      Press Enter to send, Shift+Enter for new line
                    </span>
                    {isLoading && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => stop()}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Stop generating
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
