'use client';

import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import { 
  getMainMeanings, 
  getReferences, 
  createMainMeaning, 
  createSubMeaning, 
  createReference,
  likeReference,
  addComment
} from '@/utils/api';

const App: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<string>('ا');
  const [selectedMeaning, setSelectedMeaning] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAddReferenceModal, setShowAddReferenceModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [mainMeanings, setMainMeanings] = useState<any[]>([]);
  const [references, setReferences] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newMeaning, setNewMeaning] = useState<string>('');
  
  const [newReference, setNewReference] = useState({
    type: 'شعر',
    content: '',
    mainMeaning: '',
    subMeaning: '',
    meaning: '',
    poet: '',
    era: '',
    narrator: '',
    hadith_grade: '',
    source: '',
    revelation_reason: '',
    interpretation: '',
    context: '',
    tags: [] as string[]
  });

  const arabicLetters = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];

  // Fetch main meanings when selected letter changes
  useEffect(() => {
    const fetchMainMeanings = async () => {
      try {
        setLoading(true);
        const data = await getMainMeanings(selectedLetter);
        setMainMeanings(data);
        // Select first meaning if available and none selected
        if (data.length > 0 && !selectedMeaning) {
          setSelectedMeaning(data[0].title);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching main meanings:', error);
        setLoading(false);
      }
    };

    fetchMainMeanings();
  }, [selectedLetter]);

  // Fetch references when selected meaning changes
  useEffect(() => {
    const fetchReferences = async () => {
      if (!selectedMeaning) return;
      
      try {
        setLoading(true);
        // Find the ID of the selected meaning
        const selectedMeaningObj = mainMeanings.find(m => m.title === selectedMeaning);
        if (selectedMeaningObj) {
          const data = await getReferences({ mainMeaning: selectedMeaningObj._id });
          setReferences(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching references:', error);
        setLoading(false);
      }
    };

    fetchReferences();
  }, [selectedMeaning, mainMeanings]);

  const handleAddMeaning = async () => {
    if (!newMeaning.trim()) return;
    
    try {
      setLoading(true);
      await createMainMeaning({
        title: newMeaning,
        letter: selectedLetter
      });
      
      // Refresh main meanings
      const data = await getMainMeanings(selectedLetter);
      setMainMeanings(data);
      
      setNewMeaning('');
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding main meaning:', error);
      setLoading(false);
    }
  };

  const handleAddReference = async () => {
    try {
      setLoading(true);
      
      // Find the ID of the selected meaning
      const selectedMeaningObj = mainMeanings.find(m => m.title === selectedMeaning);
      
      if (!selectedMeaningObj) {
        console.error('Selected meaning not found');
        setLoading(false);
        return;
      }
      
      // Prepare reference data
      const referenceData = {
        ...newReference,
        mainMeaning: selectedMeaningObj._id
      };
      
      await createReference(referenceData);
      
      // Refresh references
      const data = await getReferences({ mainMeaning: selectedMeaningObj._id });
      setReferences(data);
      
      // Reset form and close modal
      setNewReference({
        type: 'شعر',
        content: '',
        mainMeaning: '',
        subMeaning: '',
        meaning: '',
        poet: '',
        era: '',
        narrator: '',
        hadith_grade: '',
        source: '',
        revelation_reason: '',
        interpretation: '',
        context: '',
        tags: []
      });
      
      setShowAddReferenceModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding reference:', error);
      setLoading(false);
    }
  };

  const handleLikeReference = async (id: string, action: 'like' | 'dislike') => {
    try {
      await likeReference(id, action);
      
      // Refresh references
      const selectedMeaningObj = mainMeanings.find(m => m.title === selectedMeaning);
      if (selectedMeaningObj) {
        const data = await getReferences({ mainMeaning: selectedMeaningObj._id });
        setReferences(data);
      }
    } catch (error) {
      console.error(`Error ${action}ing reference:`, error);
    }
  };

  const handleAddComment = async (referenceId: string, commentText: string) => {
    if (!commentText.trim()) return;
    
    try {
      await addComment(referenceId, {
        user: 'مستخدم',
        text: commentText
      });
      
      // Refresh references
      const selectedMeaningObj = mainMeanings.find(m => m.title === selectedMeaning);
      if (selectedMeaningObj) {
        const data = await getReferences({ mainMeaning: selectedMeaningObj._id });
        setReferences(data);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">معجم الشواهد</h1>
            <div className="relative">
              <input
                type="text"
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ابحث عن معنى أو شاهد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </header>
      
      {/* Arabic Letters Navigation */}
      <nav className="bg-white shadow-sm mt-1">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-1 space-x-reverse py-3">
            {arabicLetters.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`px-3 py-2 rounded-lg text-lg font-semibold transition-colors whitespace-nowrap
                ${selectedLetter === letter ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">المعاني الرئيسية</h2>
              {loading && mainMeanings.length === 0 ? (
                <p className="text-gray-500">جاري التحميل...</p>
              ) : mainMeanings.length === 0 ? (
                <p className="text-gray-500">لا توجد معاني للحرف المحدد</p>
              ) : (
                <ul className="space-y-2">
                  {mainMeanings.map((meaning) => (
                    <li key={meaning._id}>
                      <button
                        onClick={() => setSelectedMeaning(meaning.title)}
                        className={`w-full text-right px-4 py-2 rounded-lg transition-colors whitespace-nowrap
                        ${selectedMeaning === meaning.title ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        <span>{meaning.title}</span>
                        <span className="float-left text-sm text-gray-500">{meaning.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                إضافة معنى جديد
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {selectedMeaning ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-bold">{selectedMeaning}</h2>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        إضافة معنى فرعي
                      </button>
                    </div>
                    <button
                      onClick={() => setShowAddReferenceModal(true)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      إضافة شاهد جديد
                    </button>
                  </div>
                  
                  {/* References List */}
                  {loading ? (
                    <p className="text-gray-500">جاري تحميل الشواهد...</p>
                  ) : references.length === 0 ? (
                    <p className="text-gray-500">لا توجد شواهد لهذا المعنى</p>
                  ) : (
                    <div className="space-y-6">
                      {references.map((ref) => (
                        <div key={ref._id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">{ref.type}</span>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-3">
                                <button 
                                  className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
                                  onClick={() => handleLikeReference(ref._id, 'like')}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                  </svg>
                                  <span className="text-sm">{ref.likes}</span>
                                </button>
                                <button 
                                  className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                                  onClick={() => handleLikeReference(ref._id, 'dislike')}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                  </svg>
                                  <span className="text-sm">{ref.dislikes}</span>
                                </button>
                                <button className="flex items-center gap-1 text-gray-600 hover:text-green-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                  </svg>
                                  <span className="text-sm">{ref.comments?.length || 0}</span>
                                </button>
                              </div>
                              <div className="flex space-x-2 space-x-reverse">
                                <button className="text-gray-500 hover:text-blue-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button className="text-gray-500 hover:text-red-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            {ref.type === 'شعر' && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                                <h3 className="text-yellow-800 font-semibold">{ref.subMeaning ? `في ${ref.subMeaning.title}` : 'في ' + ref.meaning}</h3>
                              </div>
                            )}
                            {ref.type === 'قرآن' && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                                <h3 className="text-green-800 font-semibold">{ref.subMeaning ? `في ${ref.subMeaning.title}` : 'في ' + ref.meaning}</h3>
                              </div>
                            )}
                            {ref.type === 'حديث' && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                <h3 className="text-blue-800 font-semibold">{ref.subMeaning ? `في ${ref.subMeaning.title}` : 'في ' + ref.meaning}</h3>
                              </div>
                            )}
                            <p className="text-lg">{ref.content}</p>
                            <p className="text-gray-600 mb-2">المعنى: {ref.meaning}</p>
                            {ref.type === 'شعر' && (
                              <div className="grid grid-cols-2 gap-4 mb-4 text-gray-600">
                                <div>
                                  <p className="font-semibold mb-1">الشاعر:</p>
                                  <p>{ref.poet}</p>
                                </div>
                                <div>
                                  <p className="font-semibold mb-1">العصر:</p>
                                  <p>{ref.era}</p>
                                </div>
                              </div>
                            )}
                            {ref.type === 'حديث' && (
                              <div className="grid grid-cols-2 gap-4 mb-4 text-gray-600">
                                <div>
                                  <p className="font-semibold mb-1">الراوي:</p>
                                  <p>{ref.narrator}</p>
                                </div>
                                <div>
                                  <p className="font-semibold mb-1">تخريج الحديث:</p>
                                  <p>{ref.hadith_grade}</p>
                                </div>
                              </div>
                            )}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <p className="font-semibold mb-2">السياق والمناسبة:</p>
                              <p className="text-gray-600 leading-relaxed">{ref.context}</p>
                            </div>
                            {ref.type === 'قرآن' && ref.revelation_reason && (
                              <div className="space-y-4 mb-4">
                                <div className="bg-green-50 rounded-lg p-4">
                                  <h4 className="font-bold text-green-800 mb-2">سبب النزول:</h4>
                                  <p className="text-green-700">{ref.revelation_reason}</p>
                                </div>
                                {ref.interpretation && (
                                  <div className="bg-green-50 rounded-lg p-4">
                                    <h4 className="font-bold text-green-800 mb-2">التفسير:</h4>
                                    <p className="text-green-700">{ref.interpretation}</p>
                                  </div>
                                )}
                              </div>
                            )}
                            {ref.type === 'حديث' && ref.explanation && (
                              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                <h4 className="font-bold text-blue-800 mb-2">شرح الحديث:</h4>
                                <p className="text-blue-700">{ref.explanation}</p>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {ref.tags && ref.tags.map((tag, index) => (
                                <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="border-t pt-4">
                              <h4 className="font-bold text-gray-800 mb-4">التعليقات والمناقشات</h4>
                              <div className="space-y-4">
                                {ref.comments && ref.comments.map((comment) => (
                                  <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <span className="font-semibold text-gray-800">{comment.user}</span>
                                        <span className="text-sm text-gray-500 mr-2">{new Date(comment.timestamp).toLocaleString('ar-SA')}</span>
                                      </div>
                                      <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                        </svg>
                                        <span className="text-sm">{comment.likes}</span>
                                      </button>
                                    </div>
                                    <p className="text-gray-700 mb-3">{comment.text}</p>
                                    {comment.replies && comment.replies.length > 0 && (
                                      <div className="mr-6 border-r pr-4 space-y-3">
                                        {comment.replies.map((reply) => (
                                          <div key={reply._id} className="bg-white rounded-lg p-3">
                                            <div className="flex justify-between items-start mb-2">
                                              <div>
                                                <span className="font-semibold text-gray-800">{reply.user}</span>
                                                <span className="text-sm text-gray-500 mr-2">{new Date(reply.timestamp).toLocaleString('ar-SA')}</span>
                                              </div>
                                              <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                </svg>
                                                <span className="text-sm">{reply.likes}</span>
                                              </button>
                                            </div>
                                            <p className="text-gray-700">{reply.text}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4">
                                <textarea
                                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="أضف تعليقاً..."
                                  rows={3}
                                  id={`comment-${ref._id}`}
                                ></textarea>
                                <button 
                                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                                  onClick={() => {
                                    const textarea = document.getElementById(`comment-${ref._id}`) as HTMLTextAreaElement;
                                    if (textarea) {
                                      handleAddComment(ref._id, textarea.value);
                                      textarea.value = '';
                                    }
                                  }}
                                >
                                  إضافة تعليق
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center py-10">يرجى اختيار معنى من القائمة</p>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Add Meaning Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">إضافة معنى جديد</h3>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
              placeholder="المعنى الرئيسي"
              value={newMeaning}
              onChange={(e) => setNewMeaning(e.target.value)}
            />
            <div className="flex justify-end space-x-2 space-x-reverse">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg whitespace-nowrap"
              >
                إلغاء
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 whitespace-nowrap"
                onClick={handleAddMeaning}
                disabled={loading}
              >
                {loading ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Reference Modal */}
      {showAddReferenceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">إضافة شاهد جديد</h3>
              <button onClick={() => setShowAddReferenceModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {/* Reference Type */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">نوع الشاهد</label>
                <div className="flex gap-4">
                  {['شعر', 'قرآن', 'حديث'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewReference({ ...newReference, type })}
                      className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                        newReference.type === type
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Content */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">نص الشاهد</label>
                <textarea
                  value={newReference.content}
                  onChange={(e) => setNewReference({ ...newReference, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24"
                  placeholder="أدخل نص الشاهد هنا..."
                ></textarea>
              </div>
              
              {/* Meaning */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">المعنى المستفاد من الشاهد</label>
                <input
                  type="text"
                  value={newReference.meaning}
                  onChange={(e) => setNewReference({ ...newReference, meaning: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="اكتب المعنى المستفاد من الشاهد..."
                />
              </div>
              
              {/* Conditional Fields Based on Type */}
              {newReference.type === 'شعر' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">الشاعر</label>
                    <input
                      type="text"
                      value={newReference.poet}
                      onChange={(e) => setNewReference({ ...newReference, poet: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="اسم الشاعر"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">العصر</label>
                    <input
                      type="text"
                      value={newReference.era}
                      onChange={(e) => setNewReference({ ...newReference, era: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="العصر الأدبي"
                    />
                  </div>
                </div>
              )}
              
              {newReference.type === 'حديث' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">الراوي</label>
                    <input
                      type="text"
                      value={newReference.narrator}
                      onChange={(e) => setNewReference({ ...newReference, narrator: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="اسم الراوي"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">درجة الحديث</label>
                    <input
                      type="text"
                      value={newReference.hadith_grade}
                      onChange={(e) => setNewReference({ ...newReference, hadith_grade: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="درجة الحديث"
                    />
                  </div>
                </div>
              )}
              
              {/* Context */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">السياق والمناسبة</label>
                <textarea
                  value={newReference.context}
                  onChange={(e) => setNewReference({ ...newReference, context: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24"
                  placeholder="اكتب السياق والمناسبة هنا..."
                ></textarea>
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الوسوم</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newReference.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                      {tag}
                      <button
                        onClick={() => {
                          const newTags = [...newReference.tags];
                          newTags.splice(index, 1);
                          setNewReference({ ...newReference, tags: newTags });
                        }}
                        className="mr-2 text-blue-600 hover:text-blue-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newTagInput.trim()) {
                        setNewReference({
                          ...newReference,
                          tags: [...newReference.tags, newTagInput.trim()]
                        });
                        setNewTagInput('');
                      }
                    }}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="أضف وسماً جديداً..."
                  />
                  <button
                    onClick={() => {
                      if (newTagInput.trim()) {
                        setNewReference({
                          ...newReference,
                          tags: [...newReference.tags, newTagInput.trim()]
                        });
                        setNewTagInput('');
                      }
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 whitespace-nowrap"
                  >
                    إضافة
                  </button>
                </div>
              </div>
              
              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowAddReferenceModal(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg whitespace-nowrap"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddReference}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 whitespace-nowrap"
                  disabled={loading}
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ الشاهد'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
