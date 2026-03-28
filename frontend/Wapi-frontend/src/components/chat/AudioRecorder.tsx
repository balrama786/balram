"use client";

import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import { ArrowLeft, RotateCcw, Send, Square, Trash2 } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";
import MicErrorModal from "./MicErrorModal";

interface AudioRecorderProps {
  onSend: (blob: Blob) => void;
  onCancel: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSend, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorType, setErrorType] = useState<"no-device" | "permission-denied" | "unknown">("unknown");
  const [hasDetailedErrorShown, setHasDetailedErrorShown] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/ogg; codecs=opus" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      startTimer();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("Microphone not found.");
        setErrorType("no-device");
      } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Microphone permission denied.");
        setErrorType("permission-denied");
      } else {
        setError("Could not start recording.");
        setErrorType("unknown");
      }
      
      if (!hasDetailedErrorShown) {
        setShowErrorModal(true);
        setHasDetailedErrorShown(true);
      }
      setIsRecording(false);
    }
  }, [hasDetailedErrorShown, startTimer]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  }, [isRecording, stopTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSend = useCallback(() => {
    if (audioBlob) {
      onSend(audioBlob);
    }
  }, [audioBlob, onSend]);

  const handleDelete = useCallback(() => {
    setAudioBlob(null);
    setRecordingTime(0);
    setIsRecording(false);
  }, []);

  const restartRecording = useCallback(async () => {
    // Stop current if recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    stopTimer();
    setAudioBlob(null);
    setRecordingTime(0);
    setIsRecording(false);
    
    // Start fresh
    setTimeout(() => {
      startRecording();
    }, 100);
  }, [startRecording, stopTimer]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startRecording();
    return () => {
      stopTimer();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [startRecording, stopTimer]);

  return (
    <div className="flex items-center gap-2 p-2 px-4 h-18 w-full animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-1 group/back">
        <Button variant="ghost" size="icon" onClick={onCancel} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-(--table-hover) dark:text-gray-400 rounded-full transition-all">
          <ArrowLeft size={20} />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-between bg-slate-50 dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color) rounded-lg px-4 py-2 min-h-12 mx-2 shadow-sm relative overflow-hidden">
        {error ? (
          <div className="flex items-center gap-3 w-full">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-sm text-rose-500 font-medium">{error}</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 z-10">
              <div className={cn("w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]", isRecording && "animate-pulse")} />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 tabular-nums min-w-9">
                {formatTime(recordingTime)}
              </span>
            </div>

            <div className="flex-1 flex justify-center z-10">
              {isRecording ? (
                <div className="flex items-center gap-1 px-4">
                  {[1, 2, 3, 4, 5, 2, 4, 3, 1, 5, 2, 4, 3].map((h, i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-primary rounded-full animate-voice-wave"
                      style={{
                        height: `${h * 4}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <span className="text-sm text-slate-400 font-medium italic animate-in fade-in duration-500">
                  {audioBlob ? "Recording ready to send" : "Recording paused"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 z-10">
              {isRecording ? (
                <button 
                  onClick={stopRecording} 
                  className="p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95"
                  title="Stop recording"
                >
                  <Square size={18} fill="currentColor" />
                </button>
              ) : (
                audioBlob && (
                  <button 
                    onClick={handleDelete} 
                    className="p-2 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all active:scale-95"
                    title="Delete recording"
                  >
                    <Trash2 size={18} />
                  </button>
                )
              )}
              
              {(isRecording || audioBlob) && (
                <button 
                  onClick={restartRecording} 
                  className="p-2 rounded-full text-slate-400 hover:text-primary hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all active:scale-95"
                  title="Restart recording"
                >
                  <RotateCcw size={18} />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="z-10 bg-white dark:bg-transparent rounded-full p-1">
        <Button
          onClick={handleSend}
          disabled={isRecording || !audioBlob || !!error}
          className={cn(
            "h-12 w-12 rounded-lg  flex items-center justify-center transition-all duration-300 shadow-lg", 
            !isRecording && audioBlob && !error 
              ? "bg-primary text-white scale-110 shadow-emerald-500/30 hover:shadow-emerald-500/50" 
              : "bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600 shadow-none"
          )}
        >
          <Send size={22} className={cn("transition-transform duration-300", !isRecording && audioBlob && "scale-110")} />
        </Button>
      </div>

      <MicErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorType={errorType}
      />
    </div>
  );
};

export default AudioRecorder;
