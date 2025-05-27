"use client";
import React, { useEffect, useState } from "react";
import Toast from "@/app/components/ui/Toast";

const KnowledgeBaseTable = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState<string>("");
  const [currentArticle, setCurrentArticle] = useState<any>(null);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Show toast
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000); // Auto-hide after 3 seconds
  };

  // Fetch data
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/knowledge-base"
        );
        const data = await response.json();
        setArticles(data.data || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
        showToast("❌ Failed to load knowledge base.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Delete article
  const handleDelete = async () => {
    if (!articleToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/knowledge-base/${articleToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setArticles((prev) =>
          prev.filter((article) => article.id !== articleToDelete)
        );
        showToast("🗑️ Inquiry deleted successfully!", "success");
      } else {
        showToast("❌ Failed to delete inquiry.", "error");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      showToast("⚠️ An error occurred while deleting.", "error");
    } finally {
      setArticleToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  // Add new inquiry
  const handleAddNewInquiry = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/knowledge-base", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: newQuestion, answer: newAnswer }),
      });

      const result = await response.json();

      if (result.success) {
        setArticles((prev) => [...prev, result.data]);
        setIsModalOpen(false);
        setNewQuestion("");
        setNewAnswer("");
        showToast("✅ Inquiry added successfully!", "success");
      } else {
        showToast("❌ Failed to add new inquiry.", "error");
      }
    } catch (error) {
      console.error("Error adding new inquiry:", error);
      showToast("⚠️ An error occurred while adding.", "error");
    }
  };

  // Edit inquiry
  const handleEditInquiry = async () => {
    if (!currentArticle) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/knowledge-base/${currentArticle.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: newQuestion, answer: newAnswer }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setArticles((prev) =>
          prev.map((article) =>
            article.id === currentArticle.id ? result.data : article
          )
        );
        setIsEditModalOpen(false);
        setCurrentArticle(null);
        setNewQuestion("");
        setNewAnswer("");
        showToast("✅ Changes saved successfully!", "success");
      } else {
        showToast("❌ Failed to update inquiry.", "error");
      }
    } catch (error) {
      console.error("Error editing inquiry:", error);
      showToast("⚠️ An error occurred while updating.", "error");
    }
  };

  // Open edit modal with selected article
  const openEditModal = (article: any) => {
    setCurrentArticle(article);
    setNewQuestion(article.question);
    setNewAnswer(article.answer);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Modal for Deletion */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full animate-fade-in-up">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this inquiry?
            </h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
         Manage Knowledge Base Articles
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-700 transition"
        >
          + Add New Inquiry
        </button>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-green-950 border-b border-gray-200 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  <th className="px-4 py-3">Question</th>
                  <th className="px-4 py-3">Answer</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <tr
                      key={article.id}
                      className="odd:bg-white even:bg-blue-50 hover:bg-blue-100 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 min-w-[200px] text-green-900  font-extrabold">{article.question}</td>
                      <td className="px-4 py-3">{article.answer}</td>
                      <td className="px-4 py-3 flex space-x-2">
                        <button
                          onClick={() => openEditModal(article)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setArticleToDelete(article.id);
                            setIsConfirmModalOpen(true);
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      No inquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Adding */}
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <h2 className="text-xl font-semibold mb-4">Add New Inquiry</h2>
            <InputField
              label="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <TextAreaField
              label="Answer"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewInquiry}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Inquiry
              </button>
            </div>
          </Modal>
        )}

        {/* Modal for Editing */}
        {isEditModalOpen && currentArticle && (
          <Modal onClose={() => setIsEditModalOpen(false)}>
            <h2 className="text-xl font-semibold mb-4">Edit Inquiry</h2>
            <InputField
              label="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <TextAreaField
              label="Answer"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleEditInquiry}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

// Reusable Modal Component
const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative animate-fade-in-up">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

// Input Field Component
const InputField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label.toLowerCase()}`}
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

// Textarea Field Component
const TextAreaField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      rows={4}
      placeholder={`Enter ${label.toLowerCase()}`}
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default KnowledgeBaseTable;
