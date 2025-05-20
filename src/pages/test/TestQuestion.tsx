
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import { Button } from '@/components/ui/button';
import { Mic, Square, Volume2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

// Type for speech recognition
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

// OPIc sample questions
const opicQuestions = [
  "Tell me about your daily routine.",
  "What kinds of hobbies do you enjoy?",
  "Describe your hometown and what you like about it.",
  "What is your typical weekend like?",
  "Tell me about your favorite restaurant.",
  "Describe your job or your studies.",
  "What do you do to stay healthy?",
  "Tell me about a recent vacation or trip you took.",
  "What are your plans for the future?",
  "Describe a movie or book you've enjoyed recently.",
  "What kinds of music do you like?",
  "Tell me about your family.",
  "How do you usually celebrate important holidays?",
  "What changes would you like to see in your city?",
  "If you could travel anywhere, where would you go and why?"
];

const TestQuestion = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [testAnswers, setTestAnswers] = useState<Array<{question: string, answer: string}>>([]);
  const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
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
      };
      
      setRecognition(recognitionInstance);
    }
    
    // Check if the test is already completed to redirect to results
    const storedTests = localStorage.getItem('opicTests');
    if (storedTests) {
      try {
        const parsedTests = JSON.parse(storedTests);
        const currentTest = parsedTests.find((test: any) => test.id.toString() === testId);
        if (currentTest && currentTest.completed) {
          // If the test is already completed, reset it instead of loading previous answers
          resetTest();
        } else {
          // Load existing test progress if any
          const storedAnswers = localStorage.getItem(`opicTest${testId}Answers`);
          if (storedAnswers) {
            try {
              const parsedAnswers = JSON.parse(storedAnswers);
              setTestAnswers(parsedAnswers);
              setCurrentQuestionIndex(parsedAnswers.length);
            } catch (error) {
              console.error('Error parsing test answers:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error parsing tests:', error);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [testId]);

  const resetTest = () => {
    // Reset the current test progress
    setCurrentQuestionIndex(0);
    setTestAnswers([]);
    localStorage.removeItem(`opicTest${testId}Answers`);
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      
      // Stop the speech recognition
      if (recognition) {
        recognition.stop();
      }
      
      // Save the answer
      const newAnswers = [...testAnswers];
      newAnswers[currentQuestionIndex] = {
        question: opicQuestions[currentQuestionIndex],
        answer: transcription
      };
      setTestAnswers(newAnswers);
      
      // Save to localStorage
      localStorage.setItem(`opicTest${testId}Answers`, JSON.stringify(newAnswers));
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start speech recognition
      if (recognition) {
        setTranscription("");
        recognition.start();
      }
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < opicQuestions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTranscription("");
    } else {
      // Complete the test
      completeTest();
    }
  };
  
  const completeTest = () => {
    // Update test status in localStorage
    const storedTests = localStorage.getItem('opicTests');
    if (storedTests) {
      try {
        const parsedTests = JSON.parse(storedTests);
        const updatedTests = parsedTests.map((test: any) => {
          if (test.id.toString() === testId) {
            return {
              ...test,
              completed: true,
              date: new Date().toISOString()
            };
          }
          return test;
        });
        localStorage.setItem('opicTests', JSON.stringify(updatedTests));
      } catch (error) {
        console.error('Error updating test status:', error);
      }
    }
    
    // Navigate to results page
    navigate(`/test/${testId}/results`);
  };
  
  return (
    <div className="pb-20">
      <Header title="Test" showBack>
        {currentQuestionIndex > 0 && (
          <Button
            onClick={handleNext}
            size="sm"
            className="bg-opic-purple hover:bg-opic-dark-purple"
          >
            {currentQuestionIndex < opicQuestions.length - 1 ? 'Next >' : 'Finish'}
          </Button>
        )}
      </Header>
      
      <div className="p-4">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Question {currentQuestionIndex + 1}/{opicQuestions.length}</span>
            <span>{Math.min(Math.round(((currentQuestionIndex + 1) / opicQuestions.length) * 100), 100)}%</span>
          </div>
          <Progress value={Math.min(((currentQuestionIndex + 1) / opicQuestions.length) * 100, 100)} className="h-2" />
        </div>
        
        {/* Question */}
        <div className="bg-opic-light-purple rounded-lg p-4 mb-6">
          <p>{opicQuestions[currentQuestionIndex]}</p>
        </div>
        
        {/* Answer area */}
        <Card className="mb-6">
          <CardContent className="p-4 pt-4">
            <div className="mb-4">
              <h3 className="font-medium">Speak Freely</h3>
            </div>
            
            <Textarea 
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              className="text-xs text-gray-700 min-h-[200px]"
              placeholder="녹음을 시작하면 여기에 답변이 표시됩니다..."
            />
          </CardContent>
        </Card>
        
        {/* Recording control */}
        <div className="flex items-center justify-center space-x-4">
          {isRecording && (
            <div className="text-opic-purple font-medium">
              {formatTime(recordingTime)}
            </div>
          )}
          <button 
            onClick={toggleRecording}
            className={`w-16 h-16 ${isRecording ? 'bg-red-500' : 'bg-opic-purple'} rounded-full flex items-center justify-center text-white`}
          >
            {isRecording ? <Square size={24} /> : <Mic size={24} />}
          </button>
        </div>
        
        {/* Next button - only shows after recording */}
        {transcription && !isRecording && currentQuestionIndex < opicQuestions.length - 1 && (
          <Button
            onClick={handleNext}
            className="w-full mt-6 bg-opic-purple hover:bg-opic-dark-purple"
          >
            Next Question
          </Button>
        )}
        
        {/* Finish button - only shows on last question after recording */}
        {transcription && !isRecording && currentQuestionIndex === opicQuestions.length - 1 && (
          <Button
            onClick={completeTest}
            className="w-full mt-6 bg-opic-purple hover:bg-opic-dark-purple"
          >
            Complete Test
          </Button>
        )}
      </div>
    </div>
  );
};

export default TestQuestion;
