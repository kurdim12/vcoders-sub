"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  language?: string;
}

export function VoiceInput({ onTranscript, disabled = false, language = "en-US" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        
        if (event.results[event.results.length - 1].isFinal) {
          onTranscript(transcript);
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          setPermissionDenied(true);
          setError("Microphone permission denied. Please allow microphone access in your browser settings.");
        } else if (event.error === "no-speech") {
          setError("No speech detected. Please try again.");
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
        
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError("Speech recognition is not supported in your browser. Try Chrome, Edge, or Safari.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTranscript]);

  const startListening = () => {
    if (!isSupported || disabled) return;
    
    try {
      setError(null);
      setPermissionDenied(false);
      setIsListening(true);
      recognitionRef.current?.start();
    } catch (err: any) {
      console.error("Failed to start recognition:", err);
      if (err.name === "NotAllowedError" || err.message?.includes("permission")) {
        setPermissionDenied(true);
        setError("Microphone permission denied. Please allow microphone access.");
      } else {
        setError("Failed to start voice input");
      }
      setIsListening(false);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  if (!isSupported) {
    return null; // Don't show if not supported
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        onClick={isListening ? stopListening : startListening}
        disabled={disabled || permissionDenied}
        className="h-9 w-9 shrink-0"
        title={isListening ? "Stop recording" : "Start voice input"}
      >
        {isListening ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : permissionDenied ? (
          <AlertCircle className="h-4 w-4 text-destructive" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      {isListening && (
        <span className="text-xs text-muted-foreground animate-pulse whitespace-nowrap">Listening...</span>
      )}
      {error && !isListening && (
        <div className="max-w-xs">
          <Alert variant="destructive" className="py-1 px-2">
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}

