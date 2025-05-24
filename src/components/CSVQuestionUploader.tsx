
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
    console.log('🔍 Starting CSV parsing...');
    const lines = text.split('\n');
    const result: string[][] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        console.log(`⚠️ Skipping empty line ${i + 1}`);
        continue;
      }
      
      const row: string[] = [];
      let currentField = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          if (inQuotes && j + 1 < line.length && line[j + 1] === '"') {
            // Handle escaped quotes
            currentField += '"';
            j++; // Skip next quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          row.push(currentField);
          currentField = '';
        } else {
          currentField += char;
        }
      }
      
      row.push(currentField);
      
      // Clean up fields - remove quotes and trim
      const cleanedRow = row.map(field => {
        let cleaned = field.trim();
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
          cleaned = cleaned.slice(1, -1);
        }
        return cleaned.trim();
      });
      
      result.push(cleanedRow);
      
      if (i < 10) {
        console.log(`📝 Row ${i + 1} parsed (${cleanedRow.length} columns):`, cleanedRow.slice(0, 8));
      }
    }
    
    console.log(`📊 CSV parsing complete: ${result.length} rows total`);
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
      console.log('📋 CSV Headers detected:', headers);
      console.log('📊 Total CSV rows (including header):', rows.length);

      // Find column indices with better flexibility
      const levelIndex = headers.findIndex(h => h.includes('level'));
      const topicIndex = headers.findIndex(h => h.includes('topic'));
      const questionTypeIndex = headers.findIndex(h => h.includes('question_type') || h.includes('type'));
      const styleIndex = headers.findIndex(h => h.includes('style'));
      const questionIndex = headers.findIndex(h => h.includes('question') && !h.includes('type'));
      const orderIndex = headers.findIndex(h => h.includes('order') || h.includes('question_no'));
      const comboKeyIndex = headers.findIndex(h => h.includes('combo_key'));

      console.log('📍 Column mapping:', {
        level: `${levelIndex} (${headers[levelIndex] || 'NOT FOUND'})`,
        topic: `${topicIndex} (${headers[topicIndex] || 'NOT FOUND'})`,
        question_type: `${questionTypeIndex} (${headers[questionTypeIndex] || 'NOT FOUND'})`,
        style: `${styleIndex} (${headers[styleIndex] || 'NOT FOUND'})`,
        question: `${questionIndex} (${headers[questionIndex] || 'NOT FOUND'})`,
        order: `${orderIndex} (${headers[orderIndex] || 'NOT FOUND'})`,
        combo_key: `${comboKeyIndex} (${headers[comboKeyIndex] || 'NOT FOUND'})`
      });

      if ([levelIndex, topicIndex, questionTypeIndex, styleIndex, questionIndex, orderIndex].some(idx => idx === -1)) {
        setUploadStatus({
          status: 'error',
          message: 'CSV must contain required columns. Check console for column mapping details.'
        });
        return;
      }

      setUploadStatus({
        status: 'processing',
        message: 'Checking for existing questions...',
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
      let skippedCounts = {
        emptyRows: 0,
        missingData: 0,
        invalidLevel: 0,
        duplicates: 0,
        invalidOrder: 0
      };
      let comboKeyCount = 0;
      let roleplaysFound = 0;
      let advancedCount = 0;
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        
        // Skip completely empty rows
        if (!row || row.length === 0 || row.every(cell => !cell || !cell.trim())) {
          console.log(`⚠️ SKIP REASON: Empty row ${i + 1}`);
          skippedCounts.emptyRows++;
          continue;
        }

        // Safely extract values
        const level = row[levelIndex]?.trim().toLowerCase() || '';
        const topic = row[topicIndex]?.trim() || '';
        const questionType = row[questionTypeIndex]?.trim().toLowerCase() || '';
        const style = row[styleIndex]?.trim().toLowerCase() || '';
        const question = row[questionIndex]?.trim() || '';
        const orderValue = row[orderIndex]?.trim() || '';
        const order = parseInt(orderValue) || 0;
        
        // Handle combo_key
        let comboKey: string | null = null;
        if (comboKeyIndex !== -1 && row[comboKeyIndex]) {
          const csvComboKey = row[comboKeyIndex].trim();
          comboKey = csvComboKey && csvComboKey !== '' && csvComboKey !== 'null' ? csvComboKey : null;
        }

        // Detailed logging for debugging
        if (style === 'roleplay' || level === 'advanced' || comboKey) {
          console.log(`🔍 Processing special row ${i + 1}:`, {
            level,
            topic,
            questionType,
            style,
            order,
            combo_key: comboKey,
            question_preview: question.substring(0, 50) + '...',
            rowLength: row.length
          });
        }

        // Validate required fields
        if (!level || !topic || !questionType || !style || !question) {
          console.log(`⚠️ SKIP REASON: Missing required data in row ${i + 1}:`, {
            level: level || 'MISSING',
            topic: topic || 'MISSING',
            questionType: questionType || 'MISSING',
            style: style || 'MISSING',
            question: question ? 'present' : 'MISSING',
            order: order || 'MISSING'
          });
          skippedCounts.missingData++;
          continue;
        }

        if (!order || order <= 0) {
          console.log(`⚠️ SKIP REASON: Invalid order in row ${i + 1}: ${orderValue}`);
          skippedCounts.invalidOrder++;
          continue;
        }

        if (level !== 'intermediate' && level !== 'advanced') {
          console.log(`⚠️ SKIP REASON: Invalid level in row ${i + 1}: ${level}`);
          skippedCounts.invalidLevel++;
          continue;
        }

        // Count advanced questions
        if (level === 'advanced') {
          advancedCount++;
        }

        // Count roleplay questions
        if (style === 'roleplay') {
          roleplaysFound++;
          console.log(`🎭 Found roleplay question ${roleplaysFound} in row ${i + 1}:`, {
            level,
            topic,
            style,
            order,
            combo_key: comboKey
          });
        }

        // Check for duplicates
        const questionKey = `${level}|${topic}|${style}|${order}|${question}`;
        if (existingQuestionsSet.has(questionKey)) {
          console.log(`⚠️ SKIP REASON: Duplicate found in row ${i + 1}:`, {
            level,
            topic,
            style,
            order,
            question_preview: question.substring(0, 50) + '...'
          });
          skippedCounts.duplicates++;
          continue;
        }

        const isRandom = questionType === 'random';

        // Count combo_key questions
        if (comboKey) {
          comboKeyCount++;
          console.log(`🔑 Combo_key question ${comboKeyCount} in row ${i + 1}:`, {
            combo_key: comboKey,
            level,
            topic,
            style,
            order
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
        - Total CSV rows (excluding header): ${rows.length - 1}
        - Valid questions to insert: ${allQuestionData.length}
        - Advanced level questions found: ${advancedCount}
        - Roleplay questions found: ${roleplaysFound}
        - Questions with combo_key: ${comboKeyCount}
        - SKIPPED ROWS:
          * Empty rows: ${skippedCounts.emptyRows}
          * Missing required data: ${skippedCounts.missingData}
          * Invalid level: ${skippedCounts.invalidLevel}
          * Invalid order: ${skippedCounts.invalidOrder}
          * Duplicates: ${skippedCounts.duplicates}
          * TOTAL SKIPPED: ${Object.values(skippedCounts).reduce((a, b) => a + b, 0)}
      `);

      if (allQuestionData.length === 0) {
        setUploadStatus({
          status: 'error',
          message: skippedCounts.duplicates > 0 
            ? `All ${skippedCounts.duplicates} questions are duplicates and already exist in the database`
            : 'No valid question data found in the CSV file'
        });
        return;
      }

      setUploadStatus({
        status: 'processing',
        message: 'Uploading new questions to database...',
        progress: 50
      });

      // Insert data one by one to track progress
      let totalInserted = 0;
      let comboKeyInserted = 0;
      let roleplaysInserted = 0;
      let advancedInserted = 0;
      let insertErrors = 0;

      for (let i = 0; i < allQuestionData.length; i++) {
        const questionData = allQuestionData[i];
        
        try {
          const { data, error: insertError } = await supabase
            .from('questions')
            .insert([questionData])
            .select('id, combo_key, topic, order, style, level');

          if (insertError) {
            console.error(`❌ Database insert error for question ${i + 1}:`, insertError);
            insertErrors++;
            continue;
          }

          if (data && data.length > 0) {
            const insertedQuestion = data[0];
            
            // Track different types of insertions
            if (insertedQuestion.combo_key) {
              comboKeyInserted++;
              console.log(`✅ Inserted combo_key question:`, {
                id: insertedQuestion.id,
                combo_key: insertedQuestion.combo_key,
                level: insertedQuestion.level,
                topic: insertedQuestion.topic,
                style: insertedQuestion.style,
                order: insertedQuestion.order
              });
            }
            
            if (insertedQuestion.style === 'roleplay') {
              roleplaysInserted++;
              console.log(`✅ Inserted roleplay question:`, {
                id: insertedQuestion.id,
                level: insertedQuestion.level,
                topic: insertedQuestion.topic,
                order: insertedQuestion.order,
                combo_key: insertedQuestion.combo_key
              });
            }
            
            if (insertedQuestion.level === 'advanced') {
              advancedInserted++;
            }
            
            totalInserted++;
          }
        } catch (error) {
          console.error(`❌ Unexpected error inserting question ${i + 1}:`, error);
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

      // Final verification for roleplay questions
      const { data: verifyRoleplays, error: verifyError } = await supabase
        .from('questions')
        .select('id, level, topic, style, order, combo_key')
        .eq('style', 'roleplay')
        .order('level, topic, order');

      if (verifyError) {
        console.error('❌ Error verifying roleplay questions:', verifyError);
      } else {
        console.log(`🎭 VERIFICATION - roleplay questions in database (${verifyRoleplays.length} total):`, 
          verifyRoleplays.map(q => `${q.level}-${q.topic}-${q.order}${q.combo_key ? ` (${q.combo_key})` : ''}`));
      }

      console.log(`🎯 FINAL UPLOAD SUMMARY:
        - Total questions inserted: ${totalInserted}
        - Advanced level inserted: ${advancedInserted}
        - Roleplay questions inserted: ${roleplaysInserted}
        - Questions with combo_key inserted: ${comboKeyInserted}
        - Duplicates skipped: ${skippedCounts.duplicates}
        - Insert errors: ${insertErrors}
      `);

      if (insertErrors > 0) {
        setUploadStatus({
          status: 'error',
          message: `Upload completed with ${insertErrors} errors. ${totalInserted} questions uploaded (${advancedInserted} advanced, ${roleplaysInserted} roleplay, ${comboKeyInserted} with combo_key)`
        });
      } else {
        setUploadStatus({
          status: 'success',
          message: `Successfully uploaded ${totalInserted} new questions! (${advancedInserted} advanced, ${roleplaysInserted} roleplay, ${comboKeyInserted} with combo_key, ${skippedCounts.duplicates} duplicates skipped)`,
          progress: 100
        });

        toast({
          title: 'Upload Complete',
          description: `${totalInserted} new questions added (${advancedInserted} advanced, ${roleplaysInserted} roleplay, ${comboKeyInserted} with combo_key)`,
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
