
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Mic, Square, RefreshCw, Volume2 } from 'lucide-react';

const RecordAnswer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isDirectNavigation, setIsDirectNavigation] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
  const [transcription, setTranscription] = useState("");
  
  // For handling speech recognition (Web Speech API)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  useEffect(() => {
    // Check if coming directly from template selection (without practice answer)
    const prevPath = document.referrer;
    if (prevPath.includes('/template') && !prevPath.includes('/practice-answer')) {
      setIsDirectNavigation(true);
      setAnswer(""); // No prepared answer
      console.log("Direct navigation detected from template page");
    } else {
      // This is the example answer from PracticeAnswer page
      setAnswer("In my daily life, I usually wake up at 7. The first thing I do is play soccer. After that, I play soccer. In the afternoon, I typically play soccer. My favorite part of the day is when I play soccer because it's fun.");
      console.log("Navigation from practice-answer page detected");
    }
    
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setTranscription(transcript);
        // If this is a direct navigation (Speak Freely), update the answer too
        if (isDirectNavigation) {
          setAnswer(transcript);
        }
      };
      
      setRecognition(recognitionInstance);
    }
    
    return () => {
      // Clean up speech recognition
      if (recognition) {
        recognition.stop();
      }
    };
  }, [location]);
  
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordingComplete(true);
      
      // Stop the speech recognition if it's active
      if (recognition) {
        recognition.stop();
      }
      
      // Stop the text-to-speech if it's playing
      if (speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      setRecordingComplete(false);
      
      // Start speech recognition if it's a direct navigation (Speak Freely mode)
      if (isDirectNavigation && recognition) {
        recognition.start();
        console.log("Speech recognition started for direct navigation");
      } else if (!isDirectNavigation && window.speechSynthesis) {
        // If we have a prepared answer, use text-to-speech
        const utterance = new SpeechSynthesisUtterance(answer);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        setSpeechSynthesis(utterance);
        window.speechSynthesis.speak(utterance);
        console.log("Text-to-speech activated for prepared answer");
      }
      
      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Store timer ID for cleanup
      return () => clearInterval(timer);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="pb-20">
      <Header title="답변 녹음" showBack />
      
      <div className="p-4">
        <div className="bg-opic-light-purple rounded-lg p-4 mb-6">
          <h2 className="font-medium">질문</h2>
          <p className="mt-1">Tell me about your daily life.</p>
        </div>
        
        {(answer || (isDirectNavigation && transcription)) && (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
            <h3 className="font-medium mb-3">작성한 답변</h3>
            <p className="text-sm text-gray-700">{isDirectNavigation ? transcription : answer}</p>
          </div>
        )}
        
        <div className="text-center mb-8">
          {isDirectNavigation ? (
            <p className="text-gray-700 mb-6">자유롭게 답변을 녹음하세요</p>
          ) : (
            <p className="text-gray-700 mb-6">준비된 답변을 소리내어 읽고 녹음하세요</p>
          )}
          
          <div className="flex flex-col items-center">
            {isRecording ? (
              <button 
                onClick={toggleRecording}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-2 text-white"
              >
                <Square size={24} />
              </button>
            ) : (
              <button 
                onClick={toggleRecording} 
                className="w-16 h-16 bg-opic-purple rounded-full flex items-center justify-center mb-2 text-white"
              >
                <Mic size={24} />
              </button>
            )}
            
            <p className="text-sm text-gray-500">
              {isRecording ? '눌러서 녹음 중지' : (recordingComplete ? '눌러서 녹음 시작' : '눌러서 녹음 시작')}
            </p>
            
            {isRecording && (
              <div className="mt-2 text-opic-purple font-medium">
                {formatTime(recordingTime)}
              </div>
            )}
            
            {recordingComplete && (
              <div className="mt-4 flex space-x-4">
                <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Volume2 size={20} className="text-gray-700" />
                </button>
                <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <RefreshCw size={20} className="text-gray-700" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        <Button
          onClick={() => navigate('/feedback')}
          className="w-full bg-opic-purple hover:bg-opic-dark-purple"
        >
          계속하기
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default RecordAnswer;
