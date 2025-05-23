
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

interface UploadStatus {
  status: 'idle' | 'processing' | 'success' | 'error';
  message: string;
  progress?: number;
}

type QuestionData = {
  level: 'intermediate' | 'advanced';
  topic: string;
  question_type: string;
  style: string;
  question: string;
  order: number | null;
  is_random: boolean;
};

const ExcelQuestionUploader = () => {
  const { toast } = useToast();
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: 'idle',
    message: ''
  });

  // Map question_type to style
  const getStyleFromType = (questionType: string): string => {
    const styleMap: Record<string, string> = {
      'describing': 'Descriptive',
      'routine': 'Routine',
      'comparison': 'Contrast',
      'pastexperience': 'Past Experience',
      'roleplay': 'Role-Play',
      'advques': 'Advanced'
    };

    return styleMap[questionType] || questionType;
  };

  const isOrderRequired = (questionType: string): boolean => {
    return ['roleplay', 'advques'].includes(questionType);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadStatus({
        status: 'error',
        message: 'Please upload a valid Excel file (.xlsx or .xls)'
      });
      return;
    }

    // Determine level from filename
    let level: 'intermediate' | 'advanced' = 'intermediate';
    if (file.name.toLowerCase().includes('advanced')) {
      level = 'advanced';
    } else if (file.name.toLowerCase().includes('intermediate')) {
      level = 'intermediate';
    } else {
      setUploadStatus({
        status: 'error',
        message: 'File name must include "intermediate" or "advanced" to determine level'
      });
      return;
    }

    setUploadStatus({
      status: 'processing',
      message: `Processing ${level} Excel file...`,
      progress: 0
    });

    try {
      // Read the Excel file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Get all sheet names
      const sheetNames = workbook.SheetNames;
      console.log('Found sheets:', sheetNames);

      // Skip the "topics" sheet
      const questionSheets = sheetNames.filter(name => name.toLowerCase() !== 'topics');

      // Prepare data array for batch insert
      const allQuestionData: QuestionData[] = [];
      
      // Process each sheet
      for (let i = 0; i < questionSheets.length; i++) {
        const sheetName = questionSheets[i];
        const worksheet = workbook.Sheets[sheetName];
        const question_type = sheetName.toLowerCase();
        
        // Skip if not a valid question type
        if (!['describing', 'routine', 'comparison', 'pastexperience', 'roleplay', 'advques'].includes(question_type)) {
          console.warn(`Skipping sheet "${sheetName}" - not a recognized question type`);
          continue;
        }
        
        // Convert worksheet to JSON with headers
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          console.warn(`Skipping sheet "${sheetName}" - insufficient data`);
          continue;
        }
        
        // First row contains topic names
        const topics = jsonData[0] as string[];
        
        // For each column (topic)
        for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
          const topic = topics[topicIndex]?.toString().trim();
          if (!topic) continue;
          
          // For each row under the topic (questions)
          for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
            const row = jsonData[rowIndex] as any[];
            if (!row || !row[topicIndex]) continue;
            
            const questionText = row[topicIndex]?.toString().trim();
            if (!questionText) continue;
            
            // Check if this is a random survey question
            const is_random = questionText.toLowerCase().includes('random survey');
            
            // Determine order for roleplay and advques questions
            let order: number | null = null;
            if (isOrderRequired(question_type)) {
              // For roleplay: Q11-Q13, for advques: Q14-Q15
              if (question_type === 'roleplay') {
                order = 11 + (rowIndex - 1);  // Q11, Q12, Q13
              } else if (question_type === 'advques') {
                order = 14 + (rowIndex - 1);  // Q14, Q15
              }
            }
            
            allQuestionData.push({
              level,
              topic,
              question_type,
              style: getStyleFromType(question_type),
              question: questionText,
              order,
              is_random
            });
          }
        }

        // Update progress
        setUploadStatus({
          status: 'processing',
          message: `Processing sheet ${i + 1} of ${questionSheets.length}: ${sheetName}`,
          progress: Math.round(((i + 1) / questionSheets.length) * 50) // 50% for processing
        });
      }

      console.log(`Processed ${allQuestionData.length} questions from ${questionSheets.length} sheets`);

      if (allQuestionData.length === 0) {
        setUploadStatus({
          status: 'error',
          message: 'No valid question data found in the Excel file'
        });
        return;
      }

      // Insert data in batches
      setUploadStatus({
        status: 'processing',
        message: 'Uploading data to database...',
        progress: 70
      });

      const batchSize = 50;
      let totalInserted = 0;

      for (let i = 0; i < allQuestionData.length; i += batchSize) {
        const batch = allQuestionData.slice(i, i + batchSize);
        
        const { error: insertError } = await supabase
          .from('questions')
          .insert(batch);

        if (insertError) {
          throw new Error(`Database insert error: ${insertError.message}`);
        }

        totalInserted += batch.length;
        
        // Update progress
        const progress = 70 + Math.round((totalInserted / allQuestionData.length) * 30);
        setUploadStatus({
          status: 'processing',
          message: `Uploaded ${totalInserted} of ${allQuestionData.length} questions...`,
          progress
        });
      }

      setUploadStatus({
        status: 'success',
        message: `Successfully uploaded ${totalInserted} questions for ${level} level!`,
        progress: 100
      });

      toast({
        title: 'Upload Complete',
        description: `${totalInserted} questions have been added to the database`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        status: 'error',
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Reset file input
    event.target.value = '';
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Upload OPIc Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          Upload Excel files (.xlsx) containing OPIc questions. 
          File name must include "intermediate" or "advanced" to determine level.
        </div>
        
        <div className="space-y-2">
          <label htmlFor="excel-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <div className="text-sm font-medium">Click to upload Excel file</div>
              <div className="text-xs text-gray-500">or drag and drop</div>
            </div>
          </label>
          <input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploadStatus.status === 'processing'}
          />
        </div>

        {uploadStatus.status !== 'idle' && (
          <div className="space-y-2">
            <div className={`flex items-center gap-2 text-sm ${
              uploadStatus.status === 'success' ? 'text-green-600' :
              uploadStatus.status === 'error' ? 'text-red-600' :
              'text-blue-600'
            }`}>
              {uploadStatus.status === 'success' && <CheckCircle className="h-4 w-4" />}
              {uploadStatus.status === 'error' && <AlertCircle className="h-4 w-4" />}
              {uploadStatus.status === 'processing' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
              {uploadStatus.message}
            </div>
            
            {uploadStatus.status === 'processing' && uploadStatus.progress && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadStatus.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {uploadStatus.status === 'success' && (
          <Button 
            onClick={() => setUploadStatus({ status: 'idle', message: '' })}
            variant="outline"
            className="w-full"
          >
            Upload Another File
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExcelQuestionUploader;
