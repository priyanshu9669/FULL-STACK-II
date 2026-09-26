import React, { useState, useEffect } from 'react';

// Backend runs on port 8080, Frontend runs on port 5173
const API_URL = 'http://localhost:8080/api';

export default function App() {
  // Posts state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    author: '',
    category: 'Technology',
    content: ''
  });

  // Validation & message states
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Logs & Test States
  const [logs, setLogs] = useState([]);
  const [testResult, setTestResult] = useState(null);

  // 1. Check if backend is connected
  const checkBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
  };

  // 2. Fetch all posts from Backend
  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/posts`);
      const result = await response.json();
      if (result.success && result.data) {
        setPosts(result.data);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch server logs (Assignment 3 & 5)
  const loadLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/traces`);
      const result = await response.json();
      if (result.success && result.data) {
        setLogs(result.data.slice(0, 8)); // show last 8
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  useEffect(() => {
    checkBackend();
    loadPosts();
    loadLogs();
  }, []);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field as user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  // Quick fill sample data
  const handleQuickFill = () => {
    setFormData({
      id: null,
      title: 'Spring Boot REST API Basics',
      author: 'Priyanshu',
      category: 'Technology',
      content: 'REST APIs allow frontend and backend to talk to each other using HTTP methods like GET and POST.'
    });
    setFormErrors({});
    setErrorMessage('');
  };

  // Reset form
  const handleResetForm = () => {
    setFormData({
      id: null,
      title: '',
      author: '',
      category: 'Technology',
      content: ''
    });
    setFormErrors({});
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Submit Post (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setErrorMessage('');
    setSuccessMessage('');

    const isEdit = Boolean(formData.id);
    const endpoint = isEdit ? `${API_URL}/posts/${formData.id}` : `${API_URL}/posts`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': 'user-action-' + Date.now()
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          category: formData.category,
          content: formData.content
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(isEdit ? 'Post updated successfully!' : 'Post created successfully!');
        handleResetForm();
        loadPosts();
        loadLogs();
      } else {
        // Backend validation or exception failed
        if (result.validationErrors) {
          setFormErrors(result.validationErrors);
          setErrorMessage('Please fix the highlighted errors below.');
        } else {
          setErrorMessage(result.message || 'Error saving post.');
        }
      }
    } catch (err) {
      setErrorMessage('Could not connect to backend server. Make sure port 8080 is running.');
    }
  };

  // Edit Post
  const handleEdit = (post) => {
    setFormData({
      id: post.id,
      title: post.title,
      author: post.author,
      category: post.category,
      content: post.content
    });
    setFormErrors({});
    setErrorMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Post
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete post #${id}?`)) return;

    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setSuccessMessage(`Post #${id} deleted successfully.`);
        loadPosts();
        loadLogs();
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Trigger Exception Test
  const handleRunTest = async (testType) => {
    setTestResult(null);
    let url = '';
    if (testType === '404') url = `${API_URL}/posts/9999`;
    if (testType === '500') url = `${API_URL}/posts/error/trigger-500`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setTestResult({
        type: testType,
        status: res.status,
        data: data
      });
      loadLogs();
    } catch (err) {
      alert('Test failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Top Simple Navigation */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                API
              </span>
              Experiment 5: REST API & Exception Handling
            </h1>
            <p className="text-xs text-slate-500">Unit 2 Lab • Spring Boot Backend (:8080) + React Frontend (:5173)</p>
          </div>

          <div className="flex items-center gap-3">
            {backendOnline ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                Backend Online (:8080)
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                Backend Offline (:8080)
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Global Notifications */}
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex justify-between items-center">
            <span><strong>Success:</strong> {successMessage}</span>
            <button onClick={() => setSuccessMessage('')} className="text-green-600 hover:text-green-900 font-bold">&times;</button>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex justify-between items-center">
            <span><strong>Notice:</strong> {errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="text-red-600 hover:text-red-900 font-bold">&times;</button>
          </div>
        )}

        {/* Grid: Left Column (Form) & Right Column (Post Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: Simple Post Form */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {formData.id ? `Edit Post #${formData.id}` : 'Create New Post'}
              </h2>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded hover:bg-blue-100 font-medium"
              >
                + Fill Sample Data
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Post Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Intro to REST APIs"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.title ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                  }`}
                />
                {formErrors.title && (
                  <p className="text-xs text-red-600 font-medium mt-1">{formErrors.title}</p>
                )}
              </div>

              {/* Author Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Author Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="e.g., Priyanshu"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.author ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                  }`}
                />
                {formErrors.author && (
                  <p className="text-xs text-red-600 font-medium mt-1">{formErrors.author}</p>
                )}
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Technology">Technology</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Spring Boot">Spring Boot</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* Content Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  rows={4}
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your post content here (at least 3 characters)..."
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.content ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                  }`}
                />
                {formErrors.content && (
                  <p className="text-xs text-red-600 font-medium mt-1">{formErrors.content}</p>
                )}
              </div>

              {/* Submit and Clear Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                >
                  {formData.id ? 'Save Changes' : 'Publish Post'}
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="py-2 px-3 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Posts List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">
                All Posts ({posts.length})
              </h2>
              <button
                onClick={loadPosts}
                className="text-xs text-slate-600 border border-slate-300 px-2.5 py-1 rounded bg-white hover:bg-slate-50 font-medium"
              >
                Refresh Posts
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">
                Loading posts from backend...
              </div>
            ) : posts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">
                No posts found. Use the form on the left to add one!
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            #{post.id}
                          </span>
                          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                            {post.category || 'General'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{post.title}</h3>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleEdit(post)}
                          className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{post.content}</p>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                      <span>Author: <strong className="text-slate-700">{post.author}</strong></span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: Experiment Lab Tests (Simple & Clean) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-base font-bold text-slate-900">
              Lab Tests: Exception Handling & Correlation Tracing
            </h2>
            <p className="text-xs text-slate-500">Click below to test how Spring Boot handles errors globally (@RestControllerAdvice)</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleRunTest('404')}
              className="px-3.5 py-2 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100"
            >
              Test 404 (Post Not Found)
            </button>

            <button
              onClick={() => handleRunTest('500')}
              className="px-3.5 py-2 text-xs font-semibold bg-red-50 text-red-800 border border-red-200 rounded-lg hover:bg-red-100"
            >
              Test 500 (Server Error)
            </button>

            <button
              onClick={loadLogs}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100"
            >
              Refresh Server Logs
            </button>
          </div>

          {/* Test Result Display */}
          {testResult && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-700">Response Status: HTTP {testResult.status}</span>
                <span className="text-slate-500">Error Code: {testResult.data?.errorCode || 'N/A'}</span>
              </div>
              <p className="text-slate-600"><strong>Message:</strong> {testResult.data?.message}</p>
              <p className="text-slate-500"><strong>Correlation ID:</strong> {testResult.data?.correlationId}</p>
            </div>
          )}

          {/* Simple Logs Table */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">Recent Server Logs (MDC Tracing):</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                    <th className="py-2">Method</th>
                    <th className="py-2">Endpoint</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Time Taken</th>
                    <th className="py-2">Correlation ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-mono">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-1.5 font-bold text-blue-600">{log.method}</td>
                      <td className="py-1.5 text-slate-800">{log.uri}</td>
                      <td className={`py-1.5 font-bold ${log.statusCode < 400 ? 'text-green-600' : 'text-red-600'}`}>
                        {log.statusCode}
                      </td>
                      <td className="py-1.5">{log.executionTimeMs} ms</td>
                      <td className="py-1.5 text-slate-400 truncate max-w-[150px]">{log.correlationId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>

      {/* Simple Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 bg-white">
        Experiment 5 • Spring Boot REST API & Exception Handling Lab
      </footer>
    </div>
  );
}
