
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
import { Input } from '@/components/ui/input';

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
  const [activeTemplate, setActiveTemplate] = useState(0); // 0: No template, 1-3: Templates
  const [transcription, setTranscription] = useState("");
  const [isPremiumUser] = useState(false); // This would come from auth context in a real app
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
  
  // For template form data
  const [formData, setFormData] = useState({
    time: '',
    activity: '',
    reason: '',
  });
  
  // For rendering the completed template or direct transcription
  const [completedAnswer, setCompletedAnswer] = useState('');
  
  // For handling speech recognition (Web Speech API)
  const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null);
  
  const templates = [
    {
      id: 0,
      name: "Speak Freely",
      description: "Answer freely, your speech will be transcribed in real-time",
      locked: false,
      content: ""
    },
    {
      id: 1, 
      name: "Template 1",
      description: "Basic structure for daily life responses",
      locked: false,
      fields: [
        { name: "time", label: "time:" },
        { name: "activity", label: "activity:" },
        { name: "reason", label: "reason:" }
      ],
      template: "In my daily life, I usually wake up at [time]. The first thing I do is [activity]. After that, I [activity]. In the afternoon, I typically [activity]. My favorite part of the day is when I [activity] because [reason]."
    },
    {
      id: 2,
      name: "Template 2",
      description: "Advanced structure with more detail",
      locked: !isPremiumUser,
      fields: [
        { name: "time", label: "time:" },
        { name: "activity", label: "activity:" },
        { name: "reason", label: "reason:" }
      ],
      template: "My daily routine starts early in the morning at [time]. I begin my day with [activity], followed by a healthy breakfast. Throughout the day, I [activity]. In the evening, I enjoy [activity] before going to sleep because [reason]."
    },
    {
      id: 3,
      name: "Template 3",
      description: "Professional response template",
      locked: !isPremiumUser,
      fields: [
        { name: "time", label: "time:" },
        { name: "activity", label: "activity:" },
        { name: "reason", label: "reason:" }
      ],
      template: "When describing my daily life, I can mention that I typically start my day at [time]. I engage in various activities including [activity]. I maintain a balanced schedule that allows me to be productive while also taking care of my well-being because [reason]."
    }
  ];
  
  useEffect(() => {
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
        
        // If using direct transcription, update the completedAnswer too
        if (activeTemplate === 0) {
          setCompletedAnswer(transcript);
        }
      };
      
      setRecognition(recognitionInstance);
    }
    
    // Set completedAnswer based on active template and form data
    updateCompletedAnswer();
    
    return () => {
      // Clean up speech recognition
      if (recognition) {
        recognition.stop();
      }
    };
  }, [activeTemplate, formData]);
  
  const updateCompletedAnswer = () => {
    if (activeTemplate === 0) {
      // Direct transcription
      setCompletedAnswer(transcription);
    } else {
      // Template-based answer
      const template = templates[activeTemplate];
      if (template) {
        let answer = template.template;
        Object.entries(formData).forEach(([key, value]) => {
          answer = answer.replace(new RegExp(`\\[${key}\\]`, 'g'), value || `[${key}]`);
        });
        
        setCompletedAnswer(answer);
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
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
        const utterance = new SpeechSynthesisUtterance(completedAnswer);
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
    localStorage.setItem('userSpeechTranscript', completedAnswer);
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
        
        <div className="flex justify-center mb-2">
          <CarouselPrevious className="static translate-y-0 mr-2" />
          <CarouselNext className="static translate-y-0" />
        </div>
        
        <Carousel className="mb-6" value={activeTemplate} onValueChange={setActiveTemplate}>
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
                    <div className="mb-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    </div>
                    
                    {!template.locked && (
                      <>
                        {/* For "Speak Freely" option */}
                        {template.id === 0 && (
                          <Textarea 
                            value={completedAnswer}
                            onChange={(e) => setCompletedAnswer(e.target.value)}
                            className="text-sm text-gray-700 min-h-[100px]"
                            placeholder="녹음을 시작하면 여기에 답변이 표시됩니다..."
                          />
                        )}
                        
                        {/* For template options */}
                        {template.id > 0 && (
                          <>
                            <div className="space-y-4 mb-4">
                              {template.fields?.map((field) => (
                                <div key={field.name}>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                  <Input
                                    type="text"
                                    name={field.name}
                                    placeholder={`Enter your ${field.name}...`}
                                    value={formData[field.name as keyof typeof formData] || ''}
                                    onChange={handleInputChange}
                                    className="w-full"
                                  />
                                </div>
                              ))}
                            </div>
                            
                            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                              <h3 className="font-medium mb-3">완성된 답변</h3>
                              <p className="text-sm text-gray-700">{completedAnswer}</p>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
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
          disabled={!completedAnswer}
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
