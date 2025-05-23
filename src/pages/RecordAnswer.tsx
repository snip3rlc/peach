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
import useEmblaCarousel from 'embla-carousel-react';
import { supabase } from '@/integrations/supabase/client';

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

interface Question {
  id: string;
  level: string;
  topic: string;
  question_type: string;
  style: string;
  question: string;
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
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // For embla carousel
  const [emblaRef, emblaApi] = useEmblaCarousel();
  
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
  
  // Get the question ID from the URL
  const questionId = new URLSearchParams(location.search).get('id');

  // Fetch question from Supabase
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!questionId) {
        console.error('No question ID provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching question with ID:', questionId);
        
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('id', questionId)
          .single();
        
        if (error) {
          throw error;
        }
        
        console.log('Question data:', data);
        
        if (data) {
          setQuestion(data);
        } else {
          console.error('Question not found');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching question:', error);
        setIsLoading(false);
      }
    };
    
    fetchQuestion();
  }, [questionId]);
  
  const templates = [
    {
      id: 0,
      name: "Speak Freely",
      description: "",
      locked: false,
      content: ""
    },
    {
      id: 1, 
      name: "Template 1",
      description: "",
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
      description: "",
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
      description: "",
      locked: !isPremiumUser,
      fields: [
        { name: "time", label: "time:" },
        { name: "activity", label: "activity:" },
        { name: "reason", label: "reason:" }
      ],
      template: "When describing my daily life, I can mention that I typically start my day at [time]. I engage in various activities including [activity]. I maintain a balanced schedule that allows me to be productive while also taking care of my well-being because [reason]."
    }
  ];
  
  // Initialize speech recognition
  useEffect(() => {
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
  }, []);
  
  // Update completedAnswer based on active template and form data
  useEffect(() => {
    updateCompletedAnswer();
  }, [activeTemplate, formData]);
  
  // Sync carousel with active template
  useEffect(() => {
    if (emblaApi && emblaApi.scrollTo) {
      emblaApi.scrollTo(activeTemplate);
    }
  }, [emblaApi, activeTemplate]);
  
  // Update activeTemplate when carousel changes
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setActiveTemplate(emblaApi.selectedScrollSnap());
      // Update the completed answer when template changes
      updateCompletedAnswer();
    };
    
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);
  
  const updateCompletedAnswer = () => {
    if (activeTemplate === 0) {
      // Direct transcription
      setCompletedAnswer(transcription);
    } else {
      // Template-based answer
      const template = templates[activeTemplate];
      if (template && !template.locked) {
        let answer = template.template;
        // Replace each placeholder with form data or keep the placeholder if not filled
        Object.entries(formData).forEach(([key, value]) => {
          const regex = new RegExp(`\\[${key}\\]`, 'g');
          answer = answer.replace(regex, value || `[${key}]`);
        });
        
        setCompletedAnswer(answer);
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      return newData;
    });
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

  if (isLoading) {
    return (
      <div className="pb-20">
        <Header title="Question" showBack />
        <div className="p-4 flex justify-center items-center h-64">
          <p>Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Header title="Question" showBack>
        <Button
          onClick={handleContinue}
          size="sm"
          className="bg-opic-purple hover:bg-opic-dark-purple"
        >
          Next &gt;
        </Button>
      </Header>
      
      <div className="p-4">
        <div className="bg-opic-light-purple rounded-lg p-4 mb-6">
          <p>{question?.question || "No question available"}</p>
        </div>
        
        <Carousel className="mb-6" ref={emblaRef}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex">
              <CarouselPrevious className="static translate-y-0 mr-2 h-6 w-6" />
              <CarouselNext className="static translate-y-0 h-6 w-6" />
            </div>
            <div className="flex space-x-2 items-center">
              {recordingComplete && (
                <>
                  <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Volume2 size={14} className="text-gray-700" />
                  </button>
                  <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <RefreshCw size={14} className="text-gray-700" />
                  </button>
                </>
              )}
              {isRecording && (
                <div className="text-opic-purple font-medium mr-2">
                  {formatTime(recordingTime)}
                </div>
              )}
              <button 
                onClick={toggleRecording}
                className={`w-8 h-8 ${isRecording ? 'bg-red-500' : 'bg-opic-purple'} rounded-full flex items-center justify-center text-white`}
              >
                {isRecording ? <Square size={16} /> : <Mic size={16} />}
              </button>
            </div>
          </div>
          
          <CarouselContent>
            {templates.map((template) => (
              <CarouselItem key={template.id}>
                <Card className={`${template.locked ? 'bg-gray-50' : 'bg-white'} relative`}>
                  {template.locked && (
                    <div className="absolute top-4 right-4 z-20">
                      <Button 
                        variant="outline" 
                        className="text-xs px-2 py-1 h-auto border-opic-purple text-opic-purple"
                        onClick={() => navigate('/plans')}
                      >
                        Upgrade
                      </Button>
                    </div>
                  )}
                  <CardContent className="p-4 pt-4">
                    <div className="mb-4">
                      <h3 className="font-medium">{template.name}</h3>
                    </div>
                    
                    {/* For "Speak Freely" option - increased height */}
                    {template.id === 0 && (
                      <Textarea 
                        value={completedAnswer}
                        onChange={(e) => setCompletedAnswer(e.target.value)}
                        className="text-xs text-gray-700 min-h-[200px]"
                        placeholder="녹음을 시작하면 여기에 답변이 표시됩니다..."
                      />
                    )}
                    
                    {/* For regular template options - make font smaller in inputs */}
                    {template.id > 0 && !template.locked && (
                      <>
                        <div className="space-y-4 mb-4">
                          {template.fields?.map((field) => (
                            <div key={field.name}>
                              <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
                              <Input
                                type="text"
                                name={field.name}
                                placeholder={`Enter your ${field.name}...`}
                                value={formData[field.name as keyof typeof formData] || ''}
                                onChange={handleInputChange}
                                className="w-full text-xs"
                              />
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                          <h3 className="font-medium mb-3">완성된 답변</h3>
                          <p className="text-sm text-gray-700">
                            {activeTemplate === template.id && completedAnswer}
                            {activeTemplate !== template.id && template.template.replace(/\[(.*?)\]/g, '[$1]')}
                          </p>
                        </div>
                      </>
                    )}
                    
                    {/* For locked template options - show similar UI but blurred */}
                    {template.id > 0 && template.locked && (
                      <div className="relative">
                        <div className="space-y-4 mb-4 filter blur-[3px]">
                          {template.fields?.map((field) => (
                            <div key={field.name}>
                              <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
                              <div className="h-10 bg-gray-100 rounded-md"></div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 filter blur-[3px]">
                          <h3 className="font-medium mb-3">완성된 답변</h3>
                          <p className="text-sm text-gray-700">
                            {template.template.replace(/\[(.*?)\]/g, '[$1]')}
                          </p>
                        </div>
                        <div className="absolute inset-0 bg-gray-200 bg-opacity-10 flex items-center justify-center z-10">
                          <div className="flex flex-col items-center">
                            <Lock className="h-6 w-6 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-700 mb-2">프리미엄 템플릿</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Pagination indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {templates.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${activeTemplate === index ? 'bg-opic-purple' : 'bg-gray-300'}`}
              onClick={() => {
                setActiveTemplate(index);
                if (emblaApi && emblaApi.scrollTo) {
                  emblaApi.scrollTo(index);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecordAnswer;
