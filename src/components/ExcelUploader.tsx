import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

interface UploadStatus {
  status: 'idle' | 'processing' | 'success' | 'error';
  message: string;
  progress?: number;
}

const ExcelUploader = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ 
    status: 'idle', 
    message: '' 
  });

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

    setUploadStatus({
      status: 'processing',
      message: 'Processing Excel file...',
      progress: 0
    });

    try {
      // Read the Excel file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Prepare data array for batch insert
      const allTestData: Array<{
        test_number: number;
        question_number: number;
        question_text: string;
      }> = [];

      // Process each sheet (test1 to test12)
      const sheetNames = workbook.SheetNames;
      console.log('Found sheets:', sheetNames);

      for (let i = 0; i < sheetNames.length; i++) {
        const sheetName = sheetNames[i];
        const worksheet = workbook.Sheets[sheetName];
        
        // Extract test number from sheet name (e.g., "test1" -> 1)
        const testNumberMatch = sheetName.match(/test(\d+)/i);
        if (!testNumberMatch) {
          console.warn(`Skipping sheet "${sheetName}" - doesn't match expected format`);
          continue;
        }
        
        const testNumber = parseInt(testNumberMatch[1]);
        
        // Convert worksheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Process each row (assuming questions are in the first column)
        for (let rowIndex = 0; rowIndex < Math.min(jsonData.length, 15); rowIndex++) {
          const row = jsonData[rowIndex] as any[];
          const questionText = row[0]; // Assuming question is in first column
          
          if (questionText && typeof questionText === 'string' && questionText.trim()) {
            allTestData.push({
              test_number: testNumber,
              question_number: rowIndex + 1,
              question_text: questionText.trim()
            });
          }
        }

        // Update progress
        setUploadStatus({
          status: 'processing',
          message: `Processing sheet ${i + 1} of ${sheetNames.length}: ${sheetName}`,
          progress: Math.round(((i + 1) / sheetNames.length) * 50) // 50% for processing
        });
      }

      console.log(`Processed ${allTestData.length} questions from ${sheetNames.length} sheets`);

      if (allTestData.length === 0) {
        setUploadStatus({
          status: 'error',
          message: 'No valid question data found in the Excel file'
        });
        return;
      }

      // Clear existing data first (optional - remove if you want to keep existing data)
      setUploadStatus({
        status: 'processing',
        message: 'Clearing existing test data...',
        progress: 60
      });

      const { error: deleteError } = await supabase
        .from('opic_tests')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

      if (deleteError) {
        console.warn('Error clearing existing data:', deleteError);
      }

      // Insert data in batches (Supabase has a limit of 1000 rows per insert)
      setUploadStatus({
        status: 'processing',
        message: 'Uploading data to database...',
        progress: 70
      });

      const batchSize = 100;
      let totalInserted = 0;

      for (let i = 0; i < allTestData.length; i += batchSize) {
        const batch = allTestData.slice(i, i + batchSize);
        
        const { error: insertError } = await supabase
          .from('opic_tests')
          .insert(batch);

        if (insertError) {
          throw new Error(`Database insert error: ${insertError.message}`);
        }

        totalInserted += batch.length;
        
        // Update progress
        const progress = 70 + Math.round((totalInserted / allTestData.length) * 30);
        setUploadStatus({
          status: 'processing',
          message: `Uploaded ${totalInserted} of ${allTestData.length} questions...`,
          progress
        });
      }

      setUploadStatus({
        status: 'success',
        message: `Successfully uploaded ${totalInserted} questions from ${sheetNames.length} tests!`,
        progress: 100
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
          Upload OPIc Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          Upload an Excel file (.xlsx) with sheets named "test1" to "test12".
          Each sheet should contain 15 questions in the first column.
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

export default ExcelUploader;
