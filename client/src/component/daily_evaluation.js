import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function Evaluation() {
    const [ThemeData, setThemeData] = useState({ theme: "" })
    const [Productions, setProductions] = useState([])
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const fetchTheme = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/show_daily_production_theme", {
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

    const fetchProduction = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/show_daily_production_all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();
            setProductions(data);
        } catch (error) {
            console.log("ERROR", error);
        }
    }

    useEffect(() => {
        fetchTheme();
        fetchProduction();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4 text-center">評価ページ</h1>
            <h3 className="text-lg text-gray-700 mb-2 text-center">
                今回のテーマは <span className="font-semibold text-blue-600">{ThemeData.theme}</span> でした。
            </h3>
            <h3 className="text-xl font-semibold mt-6 mb-4">作成された作品一覧</h3>

            <div className="space-y-4">
                {Productions.map((production, index) => (
                    <div key={index} className="border rounded-lg shadow-sm">
                        <div
                            className="bg-gray-100 px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-gray-200"
                            onClick={() => toggleAccordion(index)}
                        >
                            <span className="font-medium text-gray-800">{production.filename}</span>
                            <span className="text-sm text-gray-500">{openIndex === index ? "▲" : "▼"}</span>
                        </div>

                        {openIndex === index && (
                            <div className="bg-white px-4 py-3 border-t">
                                <p className="text-gray-700 mb-2">{production.description}</p>
                                <Link
                                    to={`/production/${production.id}`}
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    詳細ページへ
                                </Link>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

    );
}

export default Evaluation;