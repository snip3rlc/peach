
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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

const CSVQuestionUploader = () => {
  const { toast } = useToast();
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: 'idle',
    message: ''
  });

  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n');
    const result: string[][] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const row: string[] = [];
      let currentField = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(currentField.trim());
          currentField = '';
        } else {
          currentField += char;
        }
      }
      
      row.push(currentField.trim());
      result.push(row);
    }
    
    return result;
  };

  const generateComboKey = (style: string, topic: string, order: number): string | null => {
    if (style === 'roleplay' && (order === 11 || order === 12)) {
      return `roleplay_${topic.toLowerCase()}_01`;
    }
    if (style === 'advques' && (order === 13 || order === 14 || order === 15)) {
      return `advques_${topic.toLowerCase()}_01`;
    }
    return null;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadStatus({
        status: 'error',
        message: 'Please upload a valid CSV file (.csv)'
      });
      return;
    }

    setUploadStatus({
      status: 'processing',
      message: 'Processing CSV file...',
      progress: 0
    });

    try {
      // Read the CSV file
      const text = await file.text();
      const rows = parseCSV(text);

      if (rows.length < 2) {
        setUploadStatus({
          status: 'error',
          message: 'CSV file must contain at least a header row and one data row'
        });
        return;
      }

      // Get header row to determine column indices
      const headers = rows[0].map(h => h.toLowerCase().trim());
      console.log('CSV Headers:', headers);

      // Find column indices
      const levelIndex = headers.findIndex(h => h === 'level');
      const topicIndex = headers.findIndex(h => h === 'topic');
      const questionTypeIndex = headers.findIndex(h => h === 'question_type' || h === 'type');
      const styleIndex = headers.findIndex(h => h === 'style');
      const questionIndex = headers.findIndex(h => h === 'question');
      const orderIndex = headers.findIndex(h => h === 'order' || h === 'question_no');

      if (levelIndex === -1 || topicIndex === -1 || questionTypeIndex === -1 || 
          styleIndex === -1 || questionIndex === -1 || orderIndex === -1) {
        setUploadStatus({
          status: 'error',
          message: 'CSV must contain columns: level, topic, question_type, style, question, order'
        });
        return;
      }

      setUploadStatus({
        status: 'processing',
        message: 'Parsing CSV data...',
        progress: 25
      });

      // Process data rows
      const allQuestionData: QuestionData[] = [];
      let comboKeyCount = 0;
      let skippedRows = 0;
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < Math.max(levelIndex, topicIndex, questionTypeIndex, styleIndex, questionIndex, orderIndex) + 1) {
          console.warn(`Skipping row ${i + 1} - insufficient columns`);
          skippedRows++;
          continue;
        }

        const level = row[levelIndex]?.trim().toLowerCase();
        const topic = row[topicIndex]?.trim().toLowerCase();
        const questionType = row[questionTypeIndex]?.trim().toLowerCase();
        const style = row[styleIndex]?.trim().toLowerCase();
        const question = row[questionIndex]?.trim();
        const order = parseInt(row[orderIndex]?.trim()) || 0;

        if (!level || !topic || !questionType || !style || !question || !order) {
          console.warn(`Skipping row ${i + 1} - missing required data:`, {
            level, topic, questionType, style, question: question ? 'present' : 'missing', order
          });
          skippedRows++;
          continue;
        }

        if (level !== 'intermediate' && level !== 'advanced') {
          console.warn(`Skipping row ${i + 1} - invalid level: ${level}`);
          skippedRows++;
          continue;
        }

        const isRandom = questionType === 'random';
        const comboKey = generateComboKey(style, topic, order);

        // Debug combo key generation
        if (comboKey) {
          console.log(`🔑 Generated combo_key for row ${i + 1}:`, {
            style,
            topic,
            order,
            comboKey,
            question: question.substring(0, 50) + '...'
          });
          comboKeyCount++;
        }

        const questionData: QuestionData = {
          level: level as 'intermediate' | 'advanced',
          topic,
          question_type: questionType,
          style,
          question,
          order,
          is_random: isRandom,
          combo_key: comboKey
        };

        allQuestionData.push(questionData);
      }

      console.log(`📊 Processing summary:
        - Total rows processed: ${allQuestionData.length}
        - Rows with combo_key: ${comboKeyCount}
        - Skipped rows: ${skippedRows}
      `);

      // Debug: Show combo_key examples
      const comboKeyExamples = allQuestionData.filter(q => q.combo_key);
      console.log('🔍 All combo_key questions:', comboKeyExamples.map((q, idx) => ({
        index: idx + 1,
        combo_key: q.combo_key,
        style: q.style,
        topic: q.topic,
        order: q.order,
        question_preview: q.question.substring(0, 50) + '...'
      })));

      if (allQuestionData.length === 0) {
        setUploadStatus({
          status: 'error',
          message: 'No valid question data found in the CSV file'
        });
        return;
      }

      setUploadStatus({
        status: 'processing',
        message: 'Uploading data to database...',
        progress: 50
      });

      // Insert data one by one to preserve order and ensure combo_key questions are inserted
      let totalInserted = 0;
      let comboKeyInserted = 0;
      let insertErrors = 0;

      for (let i = 0; i < allQuestionData.length; i++) {
        const questionData = allQuestionData[i];
        
        // Log each combo_key question before insertion
        if (questionData.combo_key) {
          console.log(`🚀 Inserting combo_key question ${comboKeyInserted + 1}:`, {
            combo_key: questionData.combo_key,
            style: questionData.style,
            topic: questionData.topic,
            order: questionData.order,
            level: questionData.level,
            question_type: questionData.question_type,
            is_random: questionData.is_random
          });
        }

        try {
          const { data, error: insertError } = await supabase
            .from('questions')
            .insert([questionData])
            .select('id, combo_key, style, topic, order');

          if (insertError) {
            console.error(`❌ Database insert error for row ${i + 1}:`, insertError);
            insertErrors++;
            continue;
          }

          if (data && data.length > 0) {
            const insertedQuestion = data[0];
            if (insertedQuestion.combo_key) {
              console.log(`✅ Successfully inserted combo_key question:`, {
                id: insertedQuestion.id,
                combo_key: insertedQuestion.combo_key,
                style: insertedQuestion.style,
                topic: insertedQuestion.topic,
                order: insertedQuestion.order
              });
              comboKeyInserted++;
            }
            totalInserted++;
          }
        } catch (error) {
          console.error(`❌ Unexpected error inserting row ${i + 1}:`, error);
          insertErrors++;
        }

        // Update progress
        const progress = 50 + Math.round((i / allQuestionData.length) * 50);
        setUploadStatus({
          status: 'processing',
          message: `Uploaded ${totalInserted} of ${allQuestionData.length} questions...`,
          progress
        });
      }

      console.log(`🎯 Upload complete summary:
        - Total questions inserted: ${totalInserted}
        - Questions with combo_key inserted: ${comboKeyInserted}
        - Expected combo_key questions: ${comboKeyCount}
        - Insert errors: ${insertErrors}
      `);

      // Verify combo_key questions were actually inserted
      const { data: verifyData, error: verifyError } = await supabase
        .from('questions')
        .select('id, combo_key, style, topic, order')
        .not('combo_key', 'is', null)
        .order('topic, order');

      if (verifyError) {
        console.error('❌ Error verifying combo_key questions:', verifyError);
      } else {
        console.log('🔍 Verification - combo_key questions in database:', verifyData);
      }

      if (insertErrors > 0) {
        setUploadStatus({
          status: 'error',
          message: `Upload completed with ${insertErrors} errors. ${totalInserted} questions uploaded (${comboKeyInserted} with combo_key)`
        });
      } else {
        setUploadStatus({
          status: 'success',
          message: `Successfully uploaded ${totalInserted} questions! (${comboKeyInserted} with combo_key)`,
          progress: 100
        });

        toast({
          title: 'Upload Complete',
          description: `${totalInserted} questions added (${comboKeyInserted} with combo_key)`,
        });
      }

    } catch (error) {
      console.error('❌ Upload error:', error);
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
          <FileText className="h-5 w-5" />
          Upload OPIc Questions (CSV)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          Upload CSV file containing OPIc questions with proper column structure.
          Required columns: level, topic, question_type, style, question, order
        </div>
        
        <div className="space-y-2">
          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <div className="text-sm font-medium">Click to upload CSV file</div>
              <div className="text-xs text-gray-500">or drag and drop</div>
            </div>
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
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

export default CSVQuestionUploader;
