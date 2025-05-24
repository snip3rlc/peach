
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
      console.log('📋 CSV Headers:', headers);

      // Find column indices
      const levelIndex = headers.findIndex(h => h === 'level');
      const topicIndex = headers.findIndex(h => h === 'topic');
      const questionTypeIndex = headers.findIndex(h => h === 'question_type' || h === 'type');
      const styleIndex = headers.findIndex(h => h === 'style');
      const questionIndex = headers.findIndex(h => h === 'question');
      const orderIndex = headers.findIndex(h => h === 'order' || h === 'question_no');
      const comboKeyIndex = headers.findIndex(h => h === 'combo_key');

      console.log('📍 Column indices:', {
        level: levelIndex,
        topic: topicIndex,
        question_type: questionTypeIndex,
        style: styleIndex,
        question: questionIndex,
        order: orderIndex,
        combo_key: comboKeyIndex
      });

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

      // Fetch existing questions to check for duplicates
      const { data: existingQuestions, error: fetchError } = await supabase
        .from('questions')
        .select('question, level, topic, style, order');

      if (fetchError) {
        console.error('❌ Error fetching existing questions:', fetchError);
        setUploadStatus({
          status: 'error',
          message: 'Error checking for existing questions'
        });
        return;
      }

      // Create a Set for fast duplicate checking
      const existingQuestionsSet = new Set(
        existingQuestions.map(q => `${q.level}|${q.topic}|${q.style}|${q.order}|${q.question}`)
      );

      console.log(`🔍 Found ${existingQuestions.length} existing questions in database`);

      // Process data rows
      const allQuestionData: QuestionData[] = [];
      let comboKeyCount = 0;
      let skippedRows = 0;
      let duplicateCount = 0;
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const maxIndex = Math.max(levelIndex, topicIndex, questionTypeIndex, styleIndex, questionIndex, orderIndex, comboKeyIndex);
        
        if (row.length < maxIndex + 1) {
          console.warn(`⚠️ Skipping row ${i + 1} - insufficient columns (expected ${maxIndex + 1}, got ${row.length})`);
          skippedRows++;
          continue;
        }

        const level = row[levelIndex]?.trim().toLowerCase();
        const topic = row[topicIndex]?.trim();
        const questionType = row[questionTypeIndex]?.trim().toLowerCase();
        const style = row[styleIndex]?.trim().toLowerCase();
        const question = row[questionIndex]?.trim();
        const order = parseInt(row[orderIndex]?.trim()) || 0;
        
        // Get combo_key from CSV if column exists, otherwise null
        let comboKey: string | null = null;
        if (comboKeyIndex !== -1) {
          const csvComboKey = row[comboKeyIndex]?.trim();
          comboKey = csvComboKey && csvComboKey !== '' && csvComboKey !== 'null' ? csvComboKey : null;
        }

        if (!level || !topic || !questionType || !style || !question || !order) {
          console.warn(`⚠️ Skipping row ${i + 1} - missing required data:`, {
            level: level || 'MISSING',
            topic: topic || 'MISSING',
            questionType: questionType || 'MISSING',
            style: style || 'MISSING',
            question: question ? 'present' : 'MISSING',
            order: order || 'MISSING'
          });
          skippedRows++;
          continue;
        }

        if (level !== 'intermediate' && level !== 'advanced') {
          console.warn(`⚠️ Skipping row ${i + 1} - invalid level: ${level}`);
          skippedRows++;
          continue;
        }

        // Check for duplicates
        const questionKey = `${level}|${topic}|${style}|${order}|${question}`;
        if (existingQuestionsSet.has(questionKey)) {
          console.log(`⚠️ Duplicate found, skipping row ${i + 1}:`, {
            level,
            topic,
            style,
            order,
            question_preview: question.substring(0, 50) + '...'
          });
          duplicateCount++;
          continue;
        }

        const isRandom = questionType === 'random';

        // Log combo_key details
        if (comboKey) {
          console.log(`🔑 Found combo_key in row ${i + 1}:`, {
            combo_key: comboKey,
            topic,
            style,
            order,
            question_preview: question.substring(0, 50) + '...'
          });
          comboKeyCount++;
        }

        // Log roleplay questions specifically
        if (style === 'roleplay') {
          console.log(`🎭 Roleplay question found in row ${i + 1}:`, {
            level,
            topic,
            style,
            order,
            combo_key: comboKey,
            question_preview: question.substring(0, 50) + '...'
          });
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
        - Skipped rows (missing data): ${skippedRows}
        - Duplicate rows skipped: ${duplicateCount}
        - Total input rows: ${rows.length - 1}
      `);

      // Show roleplay question examples
      const roleplays = allQuestionData.filter(q => q.style === 'roleplay');
      console.log(`🎭 Found ${roleplays.length} roleplay questions:`, roleplays.slice(0, 3).map((q, idx) => ({
        index: idx + 1,
        level: q.level,
        topic: q.topic,
        style: q.style,
        order: q.order,
        combo_key: q.combo_key,
        question_preview: q.question.substring(0, 50) + '...'
      })));

      if (allQuestionData.length === 0) {
        setUploadStatus({
          status: 'error',
          message: duplicateCount > 0 
            ? `All ${duplicateCount} questions are duplicates and already exist in the database`
            : 'No valid question data found in the CSV file'
        });
        return;
      }

      setUploadStatus({
        status: 'processing',
        message: 'Uploading new questions to database...',
        progress: 50
      });

      // Insert data one by one to preserve order and ensure combo_key questions are inserted
      let totalInserted = 0;
      let comboKeyInserted = 0;
      let roleplaysInserted = 0;
      let insertErrors = 0;

      for (let i = 0; i < allQuestionData.length; i++) {
        const questionData = allQuestionData[i];
        
        // Log each combo_key question before insertion
        if (questionData.combo_key) {
          console.log(`🚀 Inserting combo_key question ${comboKeyInserted + 1}:`, {
            combo_key: questionData.combo_key,
            topic: questionData.topic,
            style: questionData.style,
            order: questionData.order,
            level: questionData.level,
            question_type: questionData.question_type,
            is_random: questionData.is_random
          });
        }

        // Log roleplay insertions
        if (questionData.style === 'roleplay') {
          console.log(`🎭 Inserting roleplay question ${roleplaysInserted + 1}:`, {
            level: questionData.level,
            topic: questionData.topic,
            style: questionData.style,
            order: questionData.order,
            combo_key: questionData.combo_key,
            question_preview: questionData.question.substring(0, 50) + '...'
          });
        }

        try {
          const { data, error: insertError } = await supabase
            .from('questions')
            .insert([questionData])
            .select('id, combo_key, topic, order, style');

          if (insertError) {
            console.error(`❌ Database insert error for row ${i + 1}:`, insertError);
            if (questionData.combo_key) {
              console.error(`❌ Failed to insert combo_key question:`, {
                combo_key: questionData.combo_key,
                topic: questionData.topic,
                error: insertError.message
              });
            }
            insertErrors++;
            continue;
          }

          if (data && data.length > 0) {
            const insertedQuestion = data[0];
            if (insertedQuestion.combo_key) {
              console.log(`✅ Successfully inserted combo_key question:`, {
                id: insertedQuestion.id,
                combo_key: insertedQuestion.combo_key,
                topic: insertedQuestion.topic,
                style: insertedQuestion.style,
                order: insertedQuestion.order
              });
              comboKeyInserted++;
            }
            if (questionData.style === 'roleplay') {
              roleplaysInserted++;
            }
            totalInserted++;
          }
        } catch (error) {
          console.error(`❌ Unexpected error inserting row ${i + 1}:`, error);
          insertErrors++;
        }

        // Update progress
        const progress = 50 + Math.round((i / allQuestionData.length) * 40);
        setUploadStatus({
          status: 'processing',
          message: `Uploaded ${totalInserted} of ${allQuestionData.length} questions...`,
          progress
        });
      }

      console.log(`🎯 Upload complete summary:
        - Total questions inserted: ${totalInserted}
        - Questions with combo_key inserted: ${comboKeyInserted}
        - Roleplay questions inserted: ${roleplaysInserted}
        - Duplicates skipped: ${duplicateCount}
        - Insert errors: ${insertErrors}
      `);

      // Final verification for roleplay questions
      const { data: verifyRoleplays, error: verifyError } = await supabase
        .from('questions')
        .select('id, level, topic, style, order, combo_key')
        .eq('style', 'roleplay')
        .eq('level', 'advanced')
        .order('topic, order');

      if (verifyError) {
        console.error('❌ Error verifying roleplay questions:', verifyError);
      } else {
        console.log(`🎭 Verification - advanced roleplay questions in database (${verifyRoleplays.length} found):`, verifyRoleplays);
      }

      if (insertErrors > 0) {
        setUploadStatus({
          status: 'error',
          message: `Upload completed with ${insertErrors} errors. ${totalInserted} questions uploaded (${comboKeyInserted} with combo_key, ${roleplaysInserted} roleplay, ${duplicateCount} duplicates skipped)`
        });
      } else {
        setUploadStatus({
          status: 'success',
          message: `Successfully uploaded ${totalInserted} new questions! (${comboKeyInserted} with combo_key, ${roleplaysInserted} roleplay, ${duplicateCount} duplicates skipped)`,
          progress: 100
        });

        toast({
          title: 'Upload Complete',
          description: `${totalInserted} new questions added (${comboKeyInserted} with combo_key, ${roleplaysInserted} roleplay)`,
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
          Required columns: level, topic, question_type, style, question, order.
          Duplicate questions will be automatically skipped.
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
