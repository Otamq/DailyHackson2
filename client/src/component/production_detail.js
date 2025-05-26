import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PythonIDE from "./pyIDE";

function ProductionDetail() {
    const { id } = useParams();
    const [production, setProduction] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/production/${id}`)
            .then(res => res.json())
            .then(data => setProduction(data))
            .catch(err => console.error(err));
    }, [id]);

    if (!production) return <p>Loading...</p>;
    if (production.error) return <p>{production.error}</p>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{production.filename}</h2>
            <p className="text-gray-700 mb-6">{production.description}</p>

            <h2 className="text-xl font-semibold mb-2 text-gray-800">コードのプレビューと実行</h2>
            <div className="border rounded-md p-4 bg-gray-50">
                <PythonIDE initialCode={production.code} />
            </div>
        </div>

    );
}

export default ProductionDetail;
