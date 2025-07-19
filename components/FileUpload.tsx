import React, { useState, useRef } from 'react';
import { MessageAttachment } from '../types';

interface FileUploadProps {
  onFileUpload: (attachments: MessageAttachment[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // バイト単位
  acceptedTypes?: string[];
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  maxFiles = 3,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイル検証関数
  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `ファイル形式 "${file.type}" はサポートされていません。`;
    }
    if (file.size > maxFileSize) {
      return `ファイルサイズが上限（${Math.round(maxFileSize / 1024 / 1024)}MB）を超えています。`;
    }
    return null;
  };

  // ファイルをBase64に変換
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ファイル処理メイン関数
  const processFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    // ファイル数制限チェック
    if (fileArray.length > maxFiles) {
      newErrors.push(`一度にアップロードできるファイルは${maxFiles}個までです。`);
      setErrors(newErrors);
      return;
    }

    // 各ファイルの検証
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    setErrors(newErrors);

    if (validFiles.length === 0) return;

    // ファイル変換と進捗更新
    try {
      const attachments: MessageAttachment[] = [];
      
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const fileId = `${file.name}_${Date.now()}_${i}`;
        
        // 進捗開始
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        // ファイル変換
        const dataUrl = await fileToDataUrl(file);
        
        // 進捗更新
        setUploadProgress(prev => ({ ...prev, [fileId]: 50 }));
        
        // 添付ファイルオブジェクト作成
        const attachment: MessageAttachment = {
          id: fileId,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type === 'application/pdf' ? 'pdf' : 'audio',
          fileName: file.name,
          fileSize: file.size,
          dataUrl: dataUrl
        };
        
        attachments.push(attachment);
        
        // 進捗完了
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        
        // 少し待ってから進捗を削除
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 1000);
      }
      
      onFileUpload(attachments);
      
    } catch (error) {
      console.error('ファイル処理エラー:', error);
      setErrors(['ファイルの処理中にエラーが発生しました。']);
    }
  };

  // ドラッグ&ドロップハンドラー
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  // ファイル選択ハンドラー
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  // クリックハンドラー
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {/* アップロード領域 */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-sky-500 bg-sky-50' 
            : 'border-slate-300 hover:border-sky-400 hover:bg-slate-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-3">
          <div className="text-4xl">
            {isDragging ? '📁' : '📎'}
          </div>
          
          <div>
            <p className="text-lg font-medium text-slate-700">
              {isDragging ? 'ここにファイルをドロップ' : '問題の写真やPDFをアップロード'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              クリックして選択 または ドラッグ&ドロップ
            </p>
          </div>
          
          <div className="text-xs text-slate-400 space-y-1">
            <p>対応形式: JPG, PNG, GIF, PDF</p>
            <p>最大サイズ: {Math.round(maxFileSize / 1024 / 1024)}MB / 最大{maxFiles}ファイル</p>
          </div>
        </div>
      </div>

      {/* 進捗表示 */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="bg-slate-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  {fileId.split('_')[0]}
                </span>
                <span className="text-sm text-slate-500">{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* エラー表示 */}
      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-sm font-medium text-red-800 mb-2">アップロードエラー:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 使用方法のヒント */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 ヒント:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 問題の写真を撮る際は、文字がはっきり見えるようにしてください</li>
          <li>• PDFの場合、1ページ目の問題が解析されます</li>
          <li>• アップロード後、AIが問題を自動解析して学習をサポートします</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;