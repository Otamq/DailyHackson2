import React, { useState, useEffect } from 'react'
import "../css/Theme.css"
import config from "../../config";

function DailyTheme() {
    const username = localStorage.getItem("username");
    const [formData, setFormData] = useState({ theme: "", description: "", username: username });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const register_theme = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:5000/theme", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log("Response:", data);
            fetchThemes();
            alert(data.message)
        } catch (error) {
            console.log("ERROR", error);
        }
    };

    const [themes, setThemes] = useState([]); // お題一覧
    const [OpenIndex, setOpenIndex] = useState(null);

    const fetchThemes = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/theme_all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();
            setThemes(data);
        } catch (error) {
            console.log("ERROR", error);
        }
    };

    const fetchGood = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/good_all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();
            setGood(data);
        } catch (error) {
            console.log("ERROR", error);
        }
    };


    useEffect(() => {
        fetchThemes();
        fetchGood();
    }, []);

    const toggleAccordion = (index) => {
        setOpenIndex(OpenIndex === index ? null : index);
    }

    const [GoodInfo, setGoodInfo] = useState({ username: username, theme: 0 })
    const [Good, setGood] = useState({})

    const AddGood = async (e, theme) => {
        e.preventDefault();
        setGoodInfo({ ...GoodInfo, theme: theme });
        try {
            const response = await fetch(`http://127.0.0.1:5000/good?username=${GoodInfo.username}&theme=${theme}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            setGood(prev => ({
                ...prev,
                [theme]: data.good
            }));
        } catch (error) {
            console.log("error", error);
        }
    }



    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6 mt-10">
            <h1 className="text-2xl font-bold text-gray-800">こちらはお題投稿ページです</h1>

            {/* お題投稿フォーム */}
            <form onSubmit={register_theme} className="space-y-4">
                <div>
                    <label htmlFor="theme" className="block font-medium text-gray-700">お題</label>
                    <input
                        type="text"
                        id="theme"
                        name="theme"
                        value={formData.theme}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="例：計算問題"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block font-medium text-gray-700">説明</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="お題の説明を入力"
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    登録
                </button>
            </form>

            {/* お題一覧 */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">登録されたお題一覧</h2>
                <ul className="space-y-4">
                    {themes.map((t, index) => (
                        <li key={index} className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <div
                                className="flex justify-between items-center bg-gray-100 px-4 py-3 cursor-pointer"
                                onClick={() => toggleAccordion(index)}
                            >
                                <h3 className="text-lg font-medium">{t.theme}</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={(e) => AddGood(e, t.id)}
                                        className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                    >
                                        👍 {Good?.[t.id] ?? 0}
                                    </button>
                                    <button className="text-sm text-gray-600 hover:text-gray-800">
                                        {OpenIndex === index ? "−" : "+"}
                                    </button>
                                </div>
                            </div>

                            {OpenIndex === index && (
                                <div className="bg-green-50 px-4 py-3 text-gray-700">
                                    <p>{t.description}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    )
}

export default DailyTheme;