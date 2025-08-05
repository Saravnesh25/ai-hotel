import { useEffect, useState } from "react";
import Header from '../../components/Header';
import Footer from "../../components/Footer";
import { apiFetch } from "../../utils/api";

export default function Staff() {
    const [files, setFiles] = useState([]);
    const [escalations, setEscalations] = useState([]);
    const [documentName, setDocumentName] = useState<string>("");
    const [fileUpload, setFileUpload] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch files in vector store
    useEffect(() => {
        async function fetchFiles() {
            const res = await apiFetch("/query/vector_store_files");
            const data = await res.json();
            setFiles(
                (data.file_ids || [])
                    .map((file) => ({
                        id: file.id,
                        title: file.document_name,
                    }))
            );
        }
        fetchFiles();
    }, []);

    // Poll for escalations (demo: every 5s)
    useEffect(() => {
        const interval = setInterval(async () => {
            const res = await apiFetch("/query/escalations");
            const data = await res.json();
            setEscalations(data.escalations || []);

            // setEscalations([
            //     { thread_id: "123", user_message: "Need help with booking" },
            //     { thread_id: "456", user_message: "Issue with payment" },
            // ]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Upload file handler
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!fileUpload || !documentName) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", fileUpload);
        formData.append("document_name", documentName);
        const res = await apiFetch("/query/upload_vector_store_document/", {
            method: "POST",
            body: formData,
        });
        if (res.ok) {
            setDocumentName("");
            setFileUpload(null);
            // Refresh files
            const filesRes = await apiFetch("/query/vector_store_files");
            const filesData = await filesRes.json();
            setFiles(
                (filesData.file_ids || [])
                    .map((file) => ({
                        id: file.id,
                        title: file.document_name,
                    })));
        }
        setLoading(false);
    };

    // Delete file handler
    const handleDelete = async (fileId) => {
        setLoading(true);
        const result = await apiFetch(`/query/delete_vector_store_document/${fileId}`, {
            method: "DELETE",
        });

        if (result.ok) {
            setFiles(files.filter((f) => f.id !== fileId));
        }
        setLoading(false);
    };

    return (
        <main className="relative min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #c7d2fe 100%)' }}>
            <Header />
            <section id="dashboard" className="max-w-5xl mx-auto my-4 px-8 apy-12 ">
                {/* File Management */}
                <div className="bg-white rounded shadow hover:shadow-lg transition p-6">
                    <h2 className="text-lg font-bold mb-4">Vector Store Files</h2>
                    <form onSubmit={handleUpload} className="mb-4 flex gap-2">
                        <input
                            type="text"
                            placeholder="Document Title"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            className="border px-2 py-1 rounded"
                            required
                        />
                        <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={(e) => setFileUpload(e.target.files[0])}
                            className="border px-2 py-1 rounded"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                            disabled={loading}
                        >
                            Upload
                        </button>
                    </form>
                    <table className="table-fixed w-full">
                        <thead>
                            <tr>
                                <th className="w-1/2 px-4 py-2 text-left">Document Title</th>
                                <th className="w-1/4 px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {files.map((file) => (
                                <tr key={file.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2">{file.title}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleDelete(file.id)}
                                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                                            disabled={loading}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                {files.length === 0 && <td colSpan={2} className="text-gray-500 text-center">No files uploaded.</td>}
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Escalation Notifications */}
                <div className="bg-white rounded shadow hover:shadow-lg transition p-6 mt-4">
                    <h2 className="text-lg font-bold mb-4">Chatbot Escalations</h2>
                    <table className="table-fixed w-full">
                        <thead>
                            <tr>
                                <th className="w-1/2 px-4 py-2 text-left">User Message</th>
                                <th className="w-1/4 px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {escalations.map((esc) => (
                                <tr key={esc.thread_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2">{esc.user_message}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                            onClick={() => window.location.href = `/staff/respond/${esc.thread_id}`}
                                        >
                                            Respond
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {escalations.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="text-gray-500 text-center">No escalations.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
            <Footer />
        </main>
    );
}