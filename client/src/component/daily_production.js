import React, { useState, useEffect } from 'react'
import PythonIDE from "./pyIDE";
import config from "../config";

function DailyProduction() {
    const username = localStorage.getItem("username");

    const [ThemeData, setThemeData] = useState({ theme: "" })
    const fetchTheme = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/show_daily_theme", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();
            setThemeData(data);
        } catch (error) {
            console.log("ERROR", error);
        }
    };

    const [file, setFile] = useState(null)
    const [submissionData, setSubmissionData] = useState({ filename: "", description: "", username: username });
    const [code, setCode] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // 最初の1ファイルを取得
    };

    const handleChange = (e) => {
        setSubmissionData({ ...submissionData, [e.target.name]: e.target.value })
    };

    function isCorrectExtension(name) {
        // スペース以外の文字で始まって「.jpg」「.png」「.gif」「.psf」で終わる文字(大文字・小文字を区別しない[i])
        var format = new RegExp('([^\\s]+(\\.py)$)');
        return format.test(name);
    }

    function isCorrectSize(size) {
        /** @type {number} 許容する最大サイズ(1MB). */
        var maxSize = 1024 * 1024;
        return size <= maxSize;
    }

    const UploadProduction = async (e) => {
        e.preventDefault()
        if (!file) {
            alert("ファイルを選択してください");
            return;
        }
        if (!isCorrectExtension(file.name) || !isCorrectSize(file.size)) {
            alert("拡張子またはサイズを間違えています");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("filename", submissionData.filename);
        formData.append("description", submissionData.description);
        formData.append("username", submissionData.username);

        try {
            const response = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            setCode(result.code)
            alert("アップロード成功: " + result.message);
        } catch (error) {
            console.error("アップロード失敗", error);
            alert("アップロードに失敗しました");
        }
    };

    useEffect(() => {
        fetchTheme();
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4">本日のテーマは <span className="text-blue-600">{ThemeData.theme}</span> です</h1>
            <p className="text-gray-700 text-center mb-6">
                テーマに則って作品制作を行ってください。締め切りは翌日の <span className="font-semibold">AM 6:00</span> です。
            </p>

            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">作品を提出する</h3>
                <form method="POST" onSubmit={UploadProduction} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">ファイル名</label>
                        <input
                            type="text"
                            name="filename"
                            value={submissionData.filename}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">説明</label>
                        <input
                            type="text"
                            name="description"
                            value={submissionData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">アップロードファイル</label>
                        <input
                            type="file"
                            name="file"
                            onChange={handleFileChange}
                            className="block w-full text-gray-700"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        アップロード
                    </button>
                </form>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">コードのプレビューと実行</h2>
                <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                    <PythonIDE initialCode={code} />
                </div>
            </div>
        </div>

    )
}



export default DailyProduction;