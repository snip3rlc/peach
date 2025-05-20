
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressBar from '../../components/ProgressBar';

// OPIc levels in ascending order
const opicLevels = ['NL', 'NM', 'NH', 'IL', 'IM', 'IH', 'AL', 'AM', 'AH'];

const TestResults = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const [testAnswers, setTestAnswers] = useState<Array<{question: string, answer: string}>>([]);
  const [testFeedback, setTestFeedback] = useState<Array<{
    question: string, 
    answer: string,
    feedback: string,
    correctedAnswer: string,
    sampleAnswer: string
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [opicLevel, setOpicLevel] = useState('');
  
  useEffect(() => {
    // Load test answers
    const storedAnswers = localStorage.getItem(`opicTest${testId}Answers`);
    if (storedAnswers) {
      try {
        const parsedAnswers = JSON.parse(storedAnswers);
        setTestAnswers(parsedAnswers);
        
        // Generate feedback for each answer
        const feedback = parsedAnswers.map((item: {question: string, answer: string}) => {
          // In a real app, this would come from an API call to analyze the answers
          return {
            question: item.question,
            answer: item.answer,
            feedback: generateFeedback(item.answer),
            correctedAnswer: generateCorrectedAnswer(item.answer),
            sampleAnswer: generateSampleAnswer(item.question)
          };
        });
        
        setTestFeedback(feedback);
        
        // Determine OPIc level - in a real app, this would be more sophisticated
        // For now, we'll randomly select one of the higher levels
        const highIndexes = [4, 5, 6, 7, 8]; // IM, IH, AL, AM, AH
        const levelIndex = highIndexes[Math.floor(Math.random() * highIndexes.length)];
        setOpicLevel(opicLevels[levelIndex]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing test answers:', error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [testId]);
  
  // Mock feedback generators - in a real app, these would be API calls
  const generateFeedback = (answer: string): string => {
    const feedbackTemplates = [
      "Good job! Your vocabulary usage is impressive, but watch out for verb tense consistency.",
      "You provided a detailed response. Work on connecting your ideas more smoothly with transition words.",
      "Nice answer. Try to expand on your ideas with examples to make your response more comprehensive.",
      "Well structured response. Consider varying your sentence structures to sound more natural.",
      "Your answer is clear and direct. Adding more specific details would make it stronger.",
    ];
    
    return feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
  };
  
  const generateCorrectedAnswer = (answer: string): string => {
    // In a real app, this would apply grammar corrections
    return answer;
  };
  
  const generateSampleAnswer = (question: string): string => {
    const sampleAnswers: Record<string, string> = {
      "Tell me about your daily routine.": 
        "My daily routine is quite structured. I usually wake up at 6:30 am and start with a short workout followed by breakfast. I work from 9 to 5, with a lunch break around noon where I try to take a short walk. In the evenings, I spend time reading or watching documentaries before going to bed around 10:30 pm.",
      
      "What kinds of hobbies do you enjoy?": 
        "I enjoy several hobbies that keep me both mentally and physically active. Photography is my main passion—I love capturing landscapes and street scenes. I also play the guitar, which I've been learning for about three years now. On weekends, I often go hiking in nearby trails, which helps me stay fit and appreciate nature.",
      
      "Describe your hometown and what you like about it.":
        "My hometown is a mid-sized city with a good balance of urban amenities and natural beauty. What I appreciate most is its vibrant cultural scene—we have several art galleries, music venues, and seasonal festivals. The riverfront area was recently renovated, creating a beautiful place to walk and relax. The people are generally friendly and there's a strong sense of community."
    };
    
    return sampleAnswers[question] || "A detailed sample answer would be provided here, addressing all aspects of the question with proper grammar and vocabulary.";
  };
  
  return (
    <div className="pb-20">
      <Header title="Test Results" showBack />
      
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading results...</p>
          </div>
        ) : (
          <>
            {/* Overall score */}
            <Card className="mb-6">
              <CardContent className="p-5">
                <h2 className="text-lg font-medium mb-4 text-center">Overall Performance</h2>
                <div className="flex justify-center mb-3">
                  <div className="w-24 h-24 rounded-full bg-opic-light-purple flex items-center justify-center">
                    <span className="text-2xl font-bold text-opic-purple">{opicLevel}</span>
                  </div>
                </div>
                <p className="text-sm text-center text-gray-700 mb-4">
                  {opicLevel === 'AH' ? 'Advanced High' : 
                   opicLevel === 'AM' ? 'Advanced Mid' : 
                   opicLevel === 'AL' ? 'Advanced Low' : 
                   opicLevel === 'IH' ? 'Intermediate High' : 
                   opicLevel === 'IM' ? 'Intermediate Mid' : 
                   opicLevel === 'IL' ? 'Intermediate Low' : 
                   opicLevel === 'NH' ? 'Novice High' : 
                   opicLevel === 'NM' ? 'Novice Mid' : 'Novice Low'}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Fluency</span>
                      <span className="text-sm">{getRelativeLevelForSkill('fluency')}</span>
                    </div>
                    <ProgressBar progress={getProgressForSkill('fluency')} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Grammar</span>
                      <span className="text-sm">{getRelativeLevelForSkill('grammar')}</span>
                    </div>
                    <ProgressBar progress={getProgressForSkill('grammar')} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Vocabulary</span>
                      <span className="text-sm">{getRelativeLevelForSkill('vocabulary')}</span>
                    </div>
                    <ProgressBar progress={getProgressForSkill('vocabulary')} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Question-by-question feedback */}
            <h2 className="text-lg font-medium mb-4">Detailed Feedback</h2>
            {testFeedback.map((item, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Question {index + 1}</h3>
                  <p className="text-sm text-gray-700 mb-4">{item.question}</p>
                  
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="text-sm text-gray-600 italic">Your answer:</p>
                    <p className="text-sm">{item.answer}</p>
                  </div>
                  
                  <Tabs defaultValue="feedback">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="feedback">Feedback</TabsTrigger>
                      <TabsTrigger value="corrected">Corrected</TabsTrigger>
                      <TabsTrigger value="sample">Sample</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="feedback" className="p-3 bg-white rounded-md mt-2">
                      <p className="text-sm">{item.feedback}</p>
                    </TabsContent>
                    
                    <TabsContent value="corrected" className="p-3 bg-white rounded-md mt-2">
                      <p className="text-sm">{item.correctedAnswer}</p>
                    </TabsContent>
                    
                    <TabsContent value="sample" className="p-3 bg-white rounded-md mt-2">
                      <p className="text-sm">{item.sampleAnswer}</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
            
            <Button
              onClick={() => navigate('/tests')}
              className="w-full mt-4 bg-opic-purple hover:bg-opic-dark-purple"
            >
              Back to Tests
            </Button>
          </>
        )}
      </div>
    </div>
  );
  
  // Helper function to get relative progress for each skill
  function getProgressForSkill(skill: string): number {
    const levelIndex = opicLevels.indexOf(opicLevel);
    
    // Adjust based on skill - in a real app, these would be calculated from analysis
    if (skill === 'fluency') {
      // Fluency might be slightly higher
      return Math.min(((levelIndex + 1) / opicLevels.length) * 100 + 5, 100);
    } else if (skill === 'grammar') {
      // Grammar might be slightly lower
      return Math.max(((levelIndex + 1) / opicLevels.length) * 100 - 5, 20);
    } else {
      // Vocabulary matches the overall level
      return ((levelIndex + 1) / opicLevels.length) * 100;
    }
  }
  
  // Helper function to get relative level for each skill
  function getRelativeLevelForSkill(skill: string): string {
    const levelIndex = opicLevels.indexOf(opicLevel);
    
    if (skill === 'fluency') {
      // Fluency might be slightly higher
      const adjustedIndex = Math.min(levelIndex + 1, opicLevels.length - 1);
      return opicLevels[adjustedIndex];
    } else if (skill === 'grammar') {
      // Grammar might be slightly lower
      const adjustedIndex = Math.max(levelIndex - 1, 0);
      return opicLevels[adjustedIndex];
    } else {
      // Vocabulary matches the overall level
      return opicLevel;
    }
  }
};

export default TestResults;
