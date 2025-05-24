
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
  order: number;
  is_random: boolean;
  combo_key: string | null;
};

const ExcelQuestionUploader = () => {
  const { toast } = useToast();
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: 'idle',
    message: ''
  });

  const cleanText = (text: string): string => {
    return text
      .replace(/[\r\n]+/g, ' ') // Replace line breaks with spaces
      .replace(/,+/g, ',') // Replace multiple commas with single comma
      .trim();
  };

  const generateComboKey = (style: string, topic: string, order: number): string | null => {
    if (style === 'roleplay' && (order === 11 || order === 12)) {
      // Group questions 11 and 12 together
      return `roleplay_${topic.toLowerCase()}_01`;
    }
    if (style === 'advques' && (order === 13 || order === 14 || order === 15)) {
      // Group questions 13, 14, 15 together
      return `advques_${topic.toLowerCase()}_01`;
    }
    return null;
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

      // Skip the "topics" sheet and only process valid question sheets
      const validSheets = ['describing', 'routine', 'comparison', 'pastexperience', 'roleplay', 'advques'];
      const questionSheets = sheetNames.filter(name => validSheets.includes(name.toLowerCase()));

      // Prepare data array for batch insert
      const allQuestionData: QuestionData[] = [];
      
      // Process each sheet
      for (let i = 0; i < questionSheets.length; i++) {
        const sheetName = questionSheets[i];
        const worksheet = workbook.Sheets[sheetName];
        const style = sheetName.toLowerCase().trim();
        
        // Convert worksheet to JSON with headers
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          console.warn(`Skipping sheet "${sheetName}" - insufficient data`);
          continue;
        }
        
        // Process each row (skip header row if exists)
        for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
          const row = jsonData[rowIndex] as any[];
          if (!row || row.length < 4) continue;
          
          // Extract data according to your format:
          // A = topic, B = question_type, C = question_no, D+ = question text
          const topic = row[0]?.toString().trim().toLowerCase();
          const questionType = row[1]?.toString().trim().toLowerCase();
          const questionNo = parseInt(row[2]?.toString()) || 0;
          
          // Concatenate all columns from D onward as question text
          const questionParts = [];
          for (let colIndex = 3; colIndex < row.length; colIndex++) {
            if (row[colIndex] && row[colIndex].toString().trim()) {
              questionParts.push(row[colIndex].toString().trim());
            }
          }
          
          if (!topic || !questionType || !questionNo || questionParts.length === 0) {
            console.warn(`Skipping row ${rowIndex + 1} in sheet "${sheetName}" - missing required data`);
            continue;
          }
          
          const questionText = cleanText(questionParts.join(' '));
          const isRandom = questionType === 'random';
          const comboKey = generateComboKey(style, topic, questionNo);
          
          allQuestionData.push({
            level,
            topic,
            question_type: questionType,
            style,
            question: questionText,
            order: questionNo,
            is_random: isRandom,
            combo_key: comboKey
          });
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
