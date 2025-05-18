
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Mic, Square, RefreshCw, Volume2, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Textarea } from '@/components/ui/textarea';

// Define SpeechRecognition type for TypeScript
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onend: () => void;
  onerror: (event: any) => void;
  start: () => void;
  stop: () => void;
}

const RecordAnswer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isPremiumUser] = useState(false); // This would come from auth context in a real app
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
  const [transcription, setTranscription] = useState("");
  const [activeTemplate, setActiveTemplate] = useState(0); // 0: No template, 1-3: Templates
  
  // For handling speech recognition (Web Speech API)
  const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null);
  
  const templates = [
    {
      id: 0,
      name: "No Template",
      description: "Answer freely, your speech will be transcribed in real-time",
      locked: false,
      content: ""
    },
    {
      id: 1, 
      name: "Template 1",
      description: "Basic structure for daily life responses",
      locked: false,
      content: "In my daily life, I usually wake up at 7. The first thing I do is play soccer. After that, I play soccer. In the afternoon, I typically play soccer. My favorite part of the day is when I play soccer because it's fun."
    },
    {
      id: 2,
      name: "Template 2",
      description: "Advanced structure with more detail",
      locked: !isPremiumUser,
      content: "My daily routine starts early in the morning. I begin my day with exercise, followed by a healthy breakfast. Throughout the day, I balance work and personal activities. In the evening, I enjoy relaxing activities before going to sleep."
    },
    {
      id: 3,
      name: "Template 3",
      description: "Professional response template",
      locked: !isPremiumUser,
      content: "When describing my daily life, I can mention that I typically start my day at a reasonable hour. I engage in various activities including work, leisure, and social interactions. I maintain a balanced schedule that allows me to be productive while also taking care of my well-being."
    }
  ];
  
  useEffect(() => {
    // Set initial answer based on active template
    if (activeTemplate === 0) {
      setAnswer(""); // No prepared answer for direct transcription
    } else {
      setAnswer(templates[activeTemplate].content);
    }
    
    // Initialize speech recognition
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                                (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setTranscription(transcript);
        // If using direct transcription, update the answer too
        if (activeTemplate === 0) {
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
  }, [activeTemplate]);
  
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
      
      // Start speech recognition if it's direct transcription
      if (activeTemplate === 0 && recognition) {
        recognition.start();
        console.log("Speech recognition started for direct transcription");
      } else if (activeTemplate > 0 && window.speechSynthesis) {
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

  const handleContinue = () => {
    // Save the transcribed or template text to local storage
    localStorage.setItem('userSpeechTranscript', answer);
    navigate('/feedback');
  };

  return (
    <div className="pb-20">
      <Header title="답변 녹음" showBack />
      
      <div className="p-4">
        <div className="bg-opic-light-purple rounded-lg p-4 mb-6">
          <h2 className="font-medium">질문</h2>
          <p className="mt-1">Tell me about your daily life.</p>
        </div>
        
        <Carousel className="mb-6">
          <CarouselContent>
            {templates.map((template) => (
              <CarouselItem key={template.id}>
                <Card className={`${template.locked ? 'bg-gray-50' : 'bg-white'} relative`}>
                  {template.locked && (
                    <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center rounded-lg z-10">
                      <div className="flex flex-col items-center">
                        <Lock className="h-8 w-8 text-gray-500 mb-2" />
                        <p className="text-sm text-gray-700">프리미엄 템플릿</p>
                        <Button 
                          variant="outline" 
                          className="mt-2 text-xs px-2 py-1 h-auto border-opic-purple text-opic-purple"
                          onClick={() => navigate('/plans')}
                        >
                          업그레이드
                        </Button>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-4 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <span 
                        className={`text-xs px-2 py-0.5 rounded-full ${activeTemplate === template.id ? 'bg-opic-light-purple text-opic-purple' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {activeTemplate === template.id ? '선택됨' : '선택'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    
                    {!template.locked && (
                      <Button
                        variant={activeTemplate === template.id ? "default" : "outline"}
                        size="sm"
                        className={activeTemplate === template.id ? "bg-opic-purple w-full" : "w-full border-opic-purple text-opic-purple"}
                        onClick={() => setActiveTemplate(template.id)}
                      >
                        {activeTemplate === template.id ? '사용 중' : '이 템플릿 사용'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-2">
            <CarouselPrevious className="static translate-y-0 mr-2" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
        
        {answer !== "" && (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
            <h3 className="font-medium mb-3">
              {activeTemplate === 0 ? "실시간 답변" : "작성한 답변"}
            </h3>
            {activeTemplate === 0 ? (
              <Textarea 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="text-sm text-gray-700 min-h-[100px]"
                placeholder="녹음을 시작하면 여기에 답변이 표시됩니다..."
              />
            ) : (
              <p className="text-sm text-gray-700">{answer}</p>
            )}
          </div>
        )}
        
        <div className="text-center mb-8">
          <p className="text-gray-700 mb-6">
            {activeTemplate === 0 
              ? "자유롭게 답변을 녹음하세요" 
              : "준비된 답변을 소리내어 읽고 녹음하세요"}
          </p>
          
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
          onClick={handleContinue}
          className="w-full bg-opic-purple hover:bg-opic-dark-purple"
          disabled={!answer}
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
