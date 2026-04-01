// src/app/page/documents/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { documentService } from "@/app/service/document/service";
import { IDocument } from "@/app/types/document/type";
import { 
  FileText, Upload, Trash2, Download, 
  Loader2, FilePlus, Search, FileType 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function DocumentPage() {
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    
    // Form State
    const [title, setTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const data = await documentService.getAll();
            setDocuments(data);
        } catch (error) {
            console.error("Lỗi tải tài liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDocuments(); }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !title) return alert("Vui lòng nhập tiêu đề và chọn file!");

        try {
            setIsUploading(true);
            await documentService.upload(selectedFile, title);
            alert("Tải lên thành công!");
            setTitle("");
            setSelectedFile(null);
            loadDocuments(); // Refresh danh sách
        } catch (error: any) {
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;
        try {
            await documentService.delete(id);
            setDocuments(documents.filter(d => d._id !== id));
        } catch (error) {
            alert("Không thể xóa tài liệu");
        }
    };

    const getFileIcon = (type: string) => {
        if (type.includes("pdf")) return <FileText className="text-red-500" />;
        return <FileType className="text-blue-500" />;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                    <FilePlus className="text-teal-600" /> Quản lý tài liệu học tập
                </h1>

                {/* Section 1: Upload Form */}
                <Card className="mb-10 border-none shadow-sm">
                    <CardContent className="pt-6">
                        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Tiêu đề tài liệu</label>
                                <Input 
                                    placeholder="VD: Đề cương môn học..." 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Chọn file (PDF/Word)</label>
                                <Input 
                                    type="file" 
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="bg-teal-600 hover:bg-teal-700"
                                disabled={isUploading}
                            >
                                {isUploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2 w-4 h-4" />}
                                Tải lên hệ thống
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Section 2: List Documents */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-teal-600" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc) => (
                            <Card key={doc._id} className="hover:shadow-md transition-shadow border-slate-100">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className="p-3 bg-slate-50 rounded-lg">
                                                {getFileIcon(doc.fileType)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 line-clamp-1">{doc.title}</h3>
                                                <p className="text-xs text-slate-500 mt-1">{doc.fileName}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    {(doc.fileSize / 1024).toFixed(1)} KB • {new Date(doc.createdAt!).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 mt-6 border-t pt-4">
                                        <a 
                                            href={`http://localhost:3001/${doc.filePath}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex-1"
                                        >
                                            <Button variant="outline" className="w-full text-xs h-8 border-teal-100 text-teal-600 hover:bg-teal-50">
                                                <Download className="w-3 h-3 mr-1" /> Tải về
                                            </Button>
                                        </a>
                                        <Button 
                                            variant="ghost" 
                                            className="text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                                            onClick={() => handleDelete(doc._id!)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}