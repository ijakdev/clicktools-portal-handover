import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Download, Loader2, Link as LinkIcon, FileSpreadsheet, History, Trash2, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('single'); // 'single', 'bulk', 'history'

  // Single QR state
  const [urlInput, setUrlInput] = useState('');
  const [qrName, setQrName] = useState('');
  const [singleResult, setSingleResult] = useState(null); // holds real-time result from server

  // Bulk Excel state
  const [file, setFile] = useState(null);

  // History state
  const [history, setHistory] = useState([]);

  // Shared Options state
  const [options, setOptions] = useState({
    format: 'png',
    resolution: '1000',
    colorDark: '#000000',
    colorLight: '#ffffff',
    errorCorrectionLevel: 'H'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Dropzone for Bulk
  const onDrop = useCallback(files => { if (files?.length) { setFile(files[0]); setMessage(''); } }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  // Fetch History
  const fetchHistory = async () => {
    try {
      const res = await axios.get('/qr-generator/api/history');
      setHistory(res.data);
    } catch {
      console.error("Failed to fetch history");
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const handleDeleteHistory = async (id) => {
    try {
      await axios.delete(`/qr-generator/api/history/${id}`);
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateSingle = async () => {
    if (!urlInput) return setMessage('URL을 입력해주세요.');
    setLoading(true); setMessage('');

    try {
      const response = await axios.post('/qr-generator/api/single', {
        url: urlInput,
        name: qrName || urlInput.split('//')[1]?.split('/')[0] || '단일QR',
        options
      });
      setSingleResult(response.data);
      setMessage('QR 코드가 성공적으로 생성되었습니다!');
    } catch (err) {
      setMessage('생성 실패: 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSingle = () => {
    if (!singleResult) return;
    const link = document.createElement('a');
    link.href = `/qr-generator${singleResult.filePath}`;
    link.download = `qrcode_${singleResult.id}.${singleResult.format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleGenerateBulk = async () => {
    if (!file) return setMessage('엑셀/CSV 파일을 업로드하세요.');
    setLoading(true); setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    Object.keys(options).forEach(k => formData.append(k, options[k]));

    try {
      const response = await axios.post('/qr-generator/api/generate', formData, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `qrcodes_${Date.now()}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage('압축 파일 다운로드가 완료되었습니다.');
    } catch (err) {
      setMessage('생성 실패: 양식을 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row h-[85vh] min-h-[600px]">

        {/* Left Side: Preview Area (Adobe Express Style) */}
        <div className="w-full md:w-5/12 bg-gray-100 p-8 flex flex-col items-center justify-center border-r border-gray-200 relative">
          {activeTab === 'single' ? (
            singleResult ? (
              <div className="bg-white p-6 shadow-sm rounded-xl transition-all w-full max-w-sm aspect-square flex items-center justify-center">
                <img src={`/qr-generator${singleResult.filePath}`} alt="QR Code" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="bg-gray-200/50 w-full max-w-sm aspect-square rounded-xl flex items-center justify-center flex-col text-gray-400">
                <div className="w-48 h-48 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gray-300 font-bold text-2xl">QR Preview</span>
                </div>
              </div>
            )
          ) : activeTab === 'bulk' ? (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <FileSpreadsheet className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">대량 생성 모드</h3>
              <p className="text-gray-500 mt-2">여러 개의 QR 코드를<br />한 번에 만들고 압축 파일로 받습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <History className="w-16 h-16 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">내 QR 관리</h3>
              <p className="text-gray-500 mt-2">영구 저장된 QR 코드 내역을 확인합니다.</p>
            </div>
          )}
        </div>

        {/* Right Side: Control Settings Area */}
        <div className="w-full md:w-7/12 flex flex-col h-full bg-white relative">

          {/* Header & Main Tabs */}
          <div className="px-8 pt-8 pb-4 border-b border-gray-100 flex items-center justify-between z-10">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">QR 코드 생성</h1>
              <a href="/" className="text-xs font-bold text-blue-600 mt-1 hover:underline">🏠 이전 페이지 (허브 홈)</a>
            </div>

            <div className="flex space-x-1 bg-gray-100 p-1 rounded-full">
              <button onClick={() => setActiveTab('single')} className={`px-4 py-2 font-medium text-sm rounded-full transition-colors ${activeTab === 'single' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                단일 URL
              </button>
              <button onClick={() => setActiveTab('bulk')} className={`px-4 py-2 font-medium text-sm rounded-full transition-colors ${activeTab === 'bulk' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                엑셀 일괄
              </button>
              <button onClick={() => setActiveTab('history')} className={`px-4 py-2 font-medium text-sm rounded-full transition-colors ${activeTab === 'history' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                내 파일
              </button>
            </div>
          </div>

          {/* Scrollable Content Engine */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

            {activeTab === 'single' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">QR 이름 (선택)</label>
                  <input type="text" value={qrName} onChange={e => setQrName(e.target.value)} placeholder="예: 구글 메인페이지 홍보용" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">URL 입력 또는 붙여넣기</label>
                  <div className="relative">
                    <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://example.com" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg" />
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">입력한 URL 대상 사이트의 영구적인 QR 코드가 DB(로컬)에 저장됩니다.</p>
                </div>

                <OptionsPanel options={options} setOptions={setOptions} />

                {message && <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">{message}</div>}

                <div className="pt-4 flex gap-4">
                  <button onClick={handleGenerateSingle} disabled={loading || !urlInput} className="flex-1 bg-gray-900 hover:bg-black text-white py-4 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                    {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : 'QR 코드 생성하여 저장하기'}
                  </button>
                  {singleResult && (
                    <button onClick={handleDownloadSingle} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 py-4 rounded-full font-bold transition-all shadow-sm flex items-center justify-center">
                      <Download className="w-5 h-5 mr-2" /> 다운로드
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bulk' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">데이터 파일 업로드</label>
                  <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input {...getInputProps()} />
                    <FileSpreadsheet className={`w-12 h-12 mx-auto mb-4 ${file ? 'text-green-500' : 'text-gray-400'}`} />
                    {file ? (
                      <>
                        <p className="text-lg font-bold text-green-600">{file.name}</p>
                        <p className="text-sm text-gray-500 mt-1">파일이 선택되었습니다.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium text-gray-700">엑셀/CSV 파일을 영역에 드롭하세요</p>
                        <p className="text-sm text-gray-500 mt-2">name, url, campaign, store_code 컬럼 필수 포함</p>
                      </>
                    )}
                  </div>
                </div>

                <OptionsPanel options={options} setOptions={setOptions} />

                {message && <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">{message}</div>}

                <div className="pt-4">
                  <button onClick={handleGenerateBulk} disabled={loading || !file} className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-full font-bold transition-all disabled:opacity-50 flex items-center justify-center">
                    {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : '일괄 생성 및 다운로드 (서버 저장 안됨)'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800">생성된 내역 총 {history.length}건</h2>
                  <button onClick={fetchHistory} className="text-sm text-blue-600 hover:underline">새로고침</button>
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">생성된 이력이 없습니다. 단일 생성 모드에서 QR을 만들어보세요.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {history.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-xl p-4 flex flex-col transition-all hover:shadow-md bg-white">
                        <div className="flex gap-4 mb-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center p-1">
                            <img src={`/qr-generator${item.filePath}`} alt="QR" className="max-w-full max-h-full" />
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500 truncate mb-1">{item.originalUrl}</p>
                            <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-auto">
                          <a href={`/qr-generator${item.filePath}`} download={`qrcode_${item.name}.${item.format}`} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 rounded-lg text-sm font-medium transition-colors">
                            다운로드
                          </a>
                          <button onClick={() => handleDeleteHistory(item.id)} className="px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center justify-center">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

function OptionsPanel({ options, setOptions }) {
  const handleChange = (e) => setOptions({ ...options, [e.target.name]: e.target.value });

  return (
    <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-4">
      <h4 className="text-sm font-bold text-gray-800 mb-2">고급 스타일링</h4>
      <div className="flex gap-4">
        <label className="flex-1 block text-xs font-semibold text-gray-500 mb-1">
          포맷
          <select name="format" value={options.format} onChange={handleChange} className="mt-1 w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none text-gray-800">
            <option value="png">PNG 이미지</option>
            <option value="svg">SVG 벡터</option>
          </select>
        </label>
        <label className="flex-1 block text-xs font-semibold text-gray-500 mb-1">
          크기(px)
          <input type="number" name="resolution" value={options.resolution} onChange={handleChange} className="mt-1 w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none text-gray-800" />
        </label>
      </div>
      <div className="flex gap-4">
        <label className="flex-1 block text-xs font-semibold text-gray-500 mb-1">
          QR 색상
          <div className="mt-1 flex items-center bg-white border border-gray-200 rounded-lg px-2 py-1">
            <input type="color" name="colorDark" value={options.colorDark} onChange={handleChange} className="w-6 h-6 border-0 cursor-pointer" />
            <span className="ml-2 text-xs text-gray-600">{options.colorDark}</span>
          </div>
        </label>
        <label className="flex-1 block text-xs font-semibold text-gray-500 mb-1">
          배경 색상
          <div className="mt-1 flex items-center bg-white border border-gray-200 rounded-lg px-2 py-1">
            <input type="color" name="colorLight" value={options.colorLight} onChange={handleChange} className="w-6 h-6 border-0 cursor-pointer" />
            <span className="ml-2 text-xs text-gray-600">{options.colorLight}</span>
          </div>
        </label>
      </div>
    </div>
  );
}
