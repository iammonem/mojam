'use client';

import React, { useState, useEffect } from 'react';
import * as api from '../utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('meanings');
  const [activeLetter, setActiveLetter] = useState('أ');
  const [mainMeanings, setMainMeanings] = useState([]);
  const [selectedMainMeaning, setSelectedMainMeaning] = useState(null);
  const [references, setReferences] = useState([]);
  const [newMainMeaning, setNewMainMeaning] = useState({ title: '', letter: 'أ', number: 1 });
  const [newReference, setNewReference] = useState({
    type: 'poetry',
    title: '',
    content: '',
    source: '',
    poet: '',
    era: '',
    bookTitle: '',
    chapterNumber: '',
    verseNumber: '',
    hadithNumber: '',
    narrator: '',
    tags: [],
    subMeaningId: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState({ commentId: '', content: '' });
  const [showAddMeaningForm, setShowAddMeaningForm] = useState(false);
  const [showAddReferenceForm, setShowAddReferenceForm] = useState(false);

  const arabicLetters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];

  useEffect(() => {
    fetchMainMeaningsByLetter(activeLetter);
  }, [activeLetter]);

  useEffect(() => {
    if (selectedMainMeaning) {
      fetchReferences(selectedMainMeaning._id);
    }
  }, [selectedMainMeaning]);

  const fetchMainMeaningsByLetter = async (letter) => {
    try {
      // For demo purposes, generate some sample data
      const sampleData = [
        { _id: '1', title: 'معنى 1', letter: 'أ', number: 1 },
        { _id: '2', title: 'معنى 2', letter: 'أ', number: 2 },
        { _id: '3', title: 'معنى 3', letter: 'ب', number: 1 }
      ];
      
      // Filter by letter
      const filteredData = sampleData.filter(item => item.letter === letter);
      setMainMeanings(filteredData);
      
      // In a real app, use the API
      // const data = await api.getMainMeaningsByLetter(letter);
      // setMainMeanings(data);
    } catch (error) {
      console.error('Error fetching main meanings:', error);
    }
  };

  const fetchReferences = async (mainMeaningId) => {
    try {
      // For demo purposes, generate some sample data
      const sampleData = [
        {
          _id: '1',
          type: 'poetry',
          title: 'قصيدة البردة',
          content: 'مولاي صلِّ وسلم دائماً أبداً ... على حبيبك خير الخلق كلهم',
          poet: 'البوصيري',
          era: 'العصر المملوكي',
          source: 'ديوان البوصيري',
          tags: ['مدح', 'نبوي'],
          likes: 5,
          dislikes: 1,
          comments: [
            {
              _id: '1',
              content: 'قصيدة رائعة',
              author: 'أحمد',
              date: new Date().toISOString(),
              replies: [
                {
                  _id: '1',
                  content: 'أتفق معك',
                  author: 'محمد',
                  date: new Date().toISOString()
                }
              ]
            }
          ]
        },
        {
          _id: '2',
          type: 'quran',
          title: 'سورة الفاتحة',
          content: 'بسم الله الرحمن الرحيم',
          bookTitle: 'القرآن الكريم',
          chapterNumber: '1',
          verseNumber: '1',
          tags: ['قرآن', 'فاتحة'],
          likes: 10,
          dislikes: 0,
          comments: []
        }
      ];
      
      setReferences(sampleData);
      
      // In a real app, use the API
      // const data = await api.getReferences(mainMeaningId);
      // setReferences(data);
    } catch (error) {
      console.error('Error fetching references:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      // For demo purposes, use sample data
      const sampleResults = [
        {
          _id: '3',
          type: 'hadith',
          title: 'حديث النية',
          content: 'إنما الأعمال بالنيات',
          narrator: 'عمر بن الخطاب',
          source: 'صحيح البخاري',
          hadithNumber: '1',
          tags: ['نية', 'أعمال'],
          likes: 8,
          dislikes: 0,
          comments: []
        }
      ];
      
      setSearchResults(sampleResults);
      setActiveTab('search');
      
      // In a real app, use the API
      // const results = await api.searchReferences(searchQuery);
      // setSearchResults(results);
      // setActiveTab('search');
    } catch (error) {
      console.error('Error searching references:', error);
    }
  };

  const handleAddMainMeaning = async () => {
    try {
      // In a real app, use the API
      // const newMeaning = await api.createMainMeaning(newMainMeaning);
      // setMainMeanings([...mainMeanings, newMeaning]);
      
      // For demo purposes
      const newMeaning = {
        ...newMainMeaning,
        _id: Date.now().toString()
      };
      setMainMeanings([...mainMeanings, newMeaning]);
      
      setNewMainMeaning({ title: '', letter: 'أ', number: 1 });
      setShowAddMeaningForm(false);
    } catch (error) {
      console.error('Error adding main meaning:', error);
    }
  };

  const handleAddReference = async () => {
    try {
      if (!selectedMainMeaning) return;
      
      // In a real app, use the API
      // const referenceWithMainMeaning = {
      //   ...newReference,
      //   mainMeaningId: selectedMainMeaning._id
      // };
      // const addedReference = await api.createReference(referenceWithMainMeaning);
      // setReferences([...references, addedReference]);
      
      // For demo purposes
      const addedReference = {
        ...newReference,
        _id: Date.now().toString(),
        mainMeaningId: selectedMainMeaning._id,
        likes: 0,
        dislikes: 0,
        comments: []
      };
      setReferences([...references, addedReference]);
      
      setNewReference({
        type: 'poetry',
        title: '',
        content: '',
        source: '',
        poet: '',
        era: '',
        bookTitle: '',
        chapterNumber: '',
        verseNumber: '',
        hadithNumber: '',
        narrator: '',
        tags: [],
        subMeaningId: ''
      });
      setShowAddReferenceForm(false);
    } catch (error) {
      console.error('Error adding reference:', error);
    }
  };

  const handleAddComment = async (referenceId) => {
    try {
      if (!newComment.trim()) return;
      
      // In a real app, use the API
      // const commentData = {
      //   content: newComment,
      //   author: 'User' // Replace with actual user info
      // };
      // const updatedReference = await api.addComment(referenceId, commentData);
      // setReferences(references.map(ref => ref._id === referenceId ? updatedReference : ref));
      
      // For demo purposes
      const newCommentObj = {
        _id: Date.now().toString(),
        content: newComment,
        author: 'User',
        date: new Date().toISOString(),
        replies: []
      };
      
      setReferences(references.map(ref => {
        if (ref._id === referenceId) {
          return {
            ...ref,
            comments: [...ref.comments, newCommentObj]
          };
        }
        return ref;
      }));
      
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAddReply = async (referenceId) => {
    try {
      if (!newReply.content.trim() || !newReply.commentId) return;
      
      // In a real app, use the API
      // const replyData = {
      //   content: newReply.content,
      //   author: 'User' // Replace with actual user info
      // };
      // const updatedReference = await api.addReply(referenceId, newReply.commentId, replyData);
      // setReferences(references.map(ref => ref._id === referenceId ? updatedReference : ref));
      
      // For demo purposes
      const newReplyObj = {
        _id: Date.now().toString(),
        content: newReply.content,
        author: 'User',
        date: new Date().toISOString()
      };
      
      setReferences(references.map(ref => {
        if (ref._id === referenceId) {
          return {
            ...ref,
            comments: ref.comments.map(comment => {
              if (comment._id === newReply.commentId) {
                return {
                  ...comment,
                  replies: [...comment.replies, newReplyObj]
                };
              }
              return comment;
            })
          };
        }
        return ref;
      }));
      
      setNewReply({ commentId: '', content: '' });
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleLike = async (referenceId, isLike) => {
    try {
      // In a real app, use the API
      // const updatedReference = await api.likeReference(referenceId, isLike);
      // setReferences(references.map(ref => ref._id === referenceId ? updatedReference : ref));
      
      // For demo purposes
      setReferences(references.map(ref => {
        if (ref._id === referenceId) {
          return {
            ...ref,
            likes: isLike ? ref.likes + 1 : ref.likes,
            dislikes: !isLike ? ref.dislikes + 1 : ref.dislikes
          };
        }
        return ref;
      }));
    } catch (error) {
      console.error('Error liking reference:', error);
    }
  };

  const renderReferenceDetails = (reference) => {
    switch (reference.type) {
      case 'poetry':
        return (
          <div className="reference-details">
            <p><strong>الشاعر:</strong> {reference.poet}</p>
            <p><strong>العصر:</strong> {reference.era}</p>
            <p><strong>المصدر:</strong> {reference.source}</p>
          </div>
        );
      case 'quran':
        return (
          <div className="reference-details">
            <p><strong>السورة:</strong> {reference.bookTitle}</p>
            <p><strong>رقم السورة:</strong> {reference.chapterNumber}</p>
            <p><strong>رقم الآية:</strong> {reference.verseNumber}</p>
          </div>
        );
      case 'hadith':
        return (
          <div className="reference-details">
            <p><strong>الراوي:</strong> {reference.narrator}</p>
            <p><strong>المصدر:</strong> {reference.source}</p>
            <p><strong>رقم الحديث:</strong> {reference.hadithNumber}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderAddReferenceForm = () => {
    return (
      <div className="add-reference-form">
        <h3>إضافة شاهد جديد</h3>
        <div className="form-group">
          <label>نوع الشاهد:</label>
          <select
            value={newReference.type}
            onChange={(e) => setNewReference({ ...newReference, type: e.target.value })}
          >
            <option value="poetry">شعر</option>
            <option value="quran">قرآن</option>
            <option value="hadith">حديث</option>
          </select>
        </div>
        <div className="form-group">
          <label>العنوان:</label>
          <input
            type="text"
            value={newReference.title}
            onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>المحتوى:</label>
          <textarea
            value={newReference.content}
            onChange={(e) => setNewReference({ ...newReference, content: e.target.value })}
          />
        </div>
        
        {newReference.type === 'poetry' && (
          <>
            <div className="form-group">
              <label>الشاعر:</label>
              <input
                type="text"
                value={newReference.poet}
                onChange={(e) => setNewReference({ ...newReference, poet: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>العصر:</label>
              <input
                type="text"
                value={newReference.era}
                onChange={(e) => setNewReference({ ...newReference, era: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>المصدر:</label>
              <input
                type="text"
                value={newReference.source}
                onChange={(e) => setNewReference({ ...newReference, source: e.target.value })}
              />
            </div>
          </>
        )}
        
        {newReference.type === 'quran' && (
          <>
            <div className="form-group">
              <label>اسم السورة:</label>
              <input
                type="text"
                value={newReference.bookTitle}
                onChange={(e) => setNewReference({ ...newReference, bookTitle: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>رقم السورة:</label>
              <input
                type="text"
                value={newReference.chapterNumber}
                onChange={(e) => setNewReference({ ...newReference, chapterNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>رقم الآية:</label>
              <input
                type="text"
                value={newReference.verseNumber}
                onChange={(e) => setNewReference({ ...newReference, verseNumber: e.target.value })}
              />
            </div>
          </>
        )}
        
        {newReference.type === 'hadith' && (
          <>
            <div className="form-group">
              <label>الراوي:</label>
              <input
                type="text"
                value={newReference.narrator}
                onChange={(e) => setNewReference({ ...newReference, narrator: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>المصدر:</label>
              <input
                type="text"
                value={newReference.source}
                onChange={(e) => setNewReference({ ...newReference, source: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>رقم الحديث:</label>
              <input
                type="text"
                value={newReference.hadithNumber}
                onChange={(e) => setNewReference({ ...newReference, hadithNumber: e.target.value })}
              />
            </div>
          </>
        )}
        
        <div className="form-group">
          <label>الوسوم (مفصولة بفواصل):</label>
          <input
            type="text"
            value={newReference.tags.join(', ')}
            onChange={(e) => setNewReference({ ...newReference, tags: e.target.value.split(',').map(tag => tag.trim()) })}
          />
        </div>
        
        <div className="form-actions">
          <button onClick={handleAddReference}>حفظ الشاهد</button>
          <button onClick={() => setShowAddReferenceForm(false)}>إلغاء</button>
        </div>
      </div>
    );
  };

  return (
    <div className="dictionary-app">
      <header>
        <h1>المعجم الموسوعي للمعاني</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="ابحث عن معنى أو شاهد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>بحث</button>
        </div>
        <nav>
          <button
            className={activeTab === 'meanings' ? 'active' : ''}
            onClick={() => setActiveTab('meanings')}
          >
            المعاني
          </button>
          <button
            className={activeTab === 'search' ? 'active' : ''}
            onClick={() => {
              if (searchResults.length > 0) {
                setActiveTab('search');
              }
            }}
          >
            نتائج البحث
          </button>
        </nav>
      </header>
      
      <div className="letters-bar">
        {arabicLetters.map(letter => (
          <button
            key={letter}
            className={activeLetter === letter ? 'active' : ''}
            onClick={() => setActiveLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
      
      <main>
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>المعاني الرئيسية</h2>
            <button onClick={() => setShowAddMeaningForm(!showAddMeaningForm)}>
              {showAddMeaningForm ? 'إلغاء' : 'إضافة معنى جديد'}
            </button>
          </div>
          
          {showAddMeaningForm && (
            <div className="add-meaning-form">
              <div className="form-group">
                <label>عنوان المعنى:</label>
                <input
                  type="text"
                  value={newMainMeaning.title}
                  onChange={(e) => setNewMainMeaning({ ...newMainMeaning, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>الحرف:</label>
                <select
                  value={newMainMeaning.letter}
                  onChange={(e) => setNewMainMeaning({ ...newMainMeaning, letter: e.target.value })}
                >
                  {arabicLetters.map(letter => (
                    <option key={letter} value={letter}>{letter}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>الرقم:</label>
                <input
                  type="number"
                  value={newMainMeaning.number}
                  onChange={(e) => setNewMainMeaning({ ...newMainMeaning, number: parseInt(e.target.value) })}
                />
              </div>
              <button onClick={handleAddMainMeaning}>حفظ</button>
            </div>
          )}
          
          <ul className="meanings-list">
            {mainMeanings.map(meaning => (
              <li
                key={meaning._id}
                className={selectedMainMeaning && selectedMainMeaning._id === meaning._id ? 'active' : ''}
                onClick={() => setSelectedMainMeaning(meaning)}
              >
                {meaning.title}
              </li>
            ))}
          </ul>
        </aside>
        
        <section className="content">
          {activeTab === 'meanings' && (
            <>
              {selectedMainMeaning ? (
                <div className="meaning-details">
                  <div className="meaning-header">
                    <h2>{selectedMainMeaning.title}</h2>
                    <button onClick={() => setShowAddReferenceForm(!showAddReferenceForm)}>
                      {showAddReferenceForm ? 'إلغاء' : 'إضافة شاهد جديد'}
                    </button>
                  </div>
                  
                  {showAddReferenceForm && renderAddReferenceForm()}
                  
                  <div className="references">
                    <h3>الشواهد</h3>
                    {references.length === 0 ? (
                      <p>لا توجد شواهد لهذا المعنى</p>
                    ) : (
                      references.map(reference => (
                        <div key={reference._id} className="reference-card">
                          <h4>{reference.title}</h4>
                          <div className="reference-type">{reference.type === 'poetry' ? 'شعر' : reference.type === 'quran' ? 'قرآن' : 'حديث'}</div>
                          <div className="reference-content">{reference.content}</div>
                          
                          {renderReferenceDetails(reference)}
                          
                          <div className="reference-tags">
                            {reference.tags.map(tag => (
                              <span key={tag} className="tag">{tag}</span>
                            ))}
                          </div>
                          
                          <div className="reference-actions">
                            <button onClick={() => handleLike(reference._id, true)}>
                              👍 {reference.likes}
                            </button>
                            <button onClick={() => handleLike(reference._id, false)}>
                              👎 {reference.dislikes}
                            </button>
                          </div>
                          
                          <div className="comments-section">
                            <h5>التعليقات ({reference.comments.length})</h5>
                            
                            <div className="add-comment">
                              <textarea
                                placeholder="أضف تعليقًا..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                              />
                              <button onClick={() => handleAddComment(reference._id)}>تعليق</button>
                            </div>
                            
                            {reference.comments.map(comment => (
                              <div key={comment._id} className="comment">
                                <div className="comment-header">
                                  <span className="comment-author">{comment.author}</span>
                                  <span className="comment-date">{new Date(comment.date).toLocaleDateString('ar-EG')}</span>
                                </div>
                                <div className="comment-content">{comment.content}</div>
                                
                                {comment.replies && comment.replies.length > 0 && (
                                  <div className="replies">
                                    {comment.replies.map(reply => (
                                      <div key={reply._id} className="reply">
                                        <div className="reply-header">
                                          <span className="reply-author">{reply.author}</span>
                                          <span className="reply-date">{new Date(reply.date).toLocaleDateString('ar-EG')}</span>
                                        </div>
                                        <div className="reply-content">{reply.content}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="add-reply">
                                  {newReply.commentId === comment._id ? (
                                    <>
                                      <textarea
                                        placeholder="أضف ردًا..."
                                        value={newReply.content}
                                        onChange={(e) => setNewReply({ ...newReply, content: e.target.value })}
                                      />
                                      <div className="reply-actions">
                                        <button onClick={() => handleAddReply(reference._id)}>إرسال</button>
                                        <button onClick={() => setNewReply({ commentId: '', content: '' })}>إلغاء</button>
                                      </div>
                                    </>
                                  ) : (
                                    <button onClick={() => setNewReply({ commentId: comment._id, content: '' })}>
                                      رد
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="no-selection">
                  <p>اختر معنى من القائمة لعرض الشواهد</p>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'search' && (
            <div className="search-results">
              <h2>نتائج البحث: {searchQuery}</h2>
              
              {searchResults.length === 0 ? (
                <p>لا توجد نتائج للبحث</p>
              ) : (
                searchResults.map(reference => (
                  <div key={reference._id} className="reference-card">
                    <h4>{reference.title}</h4>
                    <div className="reference-type">{reference.type === 'poetry' ? 'شعر' : reference.type === 'quran' ? 'قرآن' : 'حديث'}</div>
                    <div className="reference-content">{reference.content}</div>
                    
                    {renderReferenceDetails(reference)}
                    
                    <div className="reference-tags">
                      {reference.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                    
                    <div className="reference-actions">
                      <button onClick={() => handleLike(reference._id, true)}>
                        👍 {reference.likes}
                      </button>
                      <button onClick={() => handleLike(reference._id, false)}>
                        👎 {reference.dislikes}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>
      
      <footer>
        <p>المعجم الموسوعي للمعاني © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
