// components/PythonIDE.jsx
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function PythonIDE({ initialCode }) {
    const [pyodide, setPyodide] = useState(null);
    const [code, setCode] = useState(initialCode || "print('Hello, Pyodide!')");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPyodide = async () => {
            setLoading(true);
            const pyodide = await window.loadPyodide();
            setPyodide(pyodide);
            setLoading(false);
        };



        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
        script.onload = loadPyodide;
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (initialCode) {
            setCode(initialCode);
        }
    }, [initialCode]);

    const runCode = async () => {
        if (!pyodide) return;
        try {
            await pyodide.loadPackage("micropip");
            await pyodide.runPythonAsync(`
        import sys
        import io
        sys.stdout = io.StringIO()
`       );
            await pyodide.runPythonAsync(code);
            const output = await pyodide.runPythonAsync("sys.stdout.getvalue()");
            setOutput(output || "(no output)");
        } catch (err) {
            setOutput("Error: " + err.toString());
        }
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Python in Browser (Pyodide)</h1>
            <Textarea
                rows={10}
                className="font-mono text-sm mb-4"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <Button onClick={runCode} disabled={loading}>
                {loading ? "Loading Pyodide..." : "Run Python Code"}
            </Button>
            <div className="mt-4 p-2 bg-gray-100 rounded">
                <pre className="text-sm whitespace-pre-wrap">{output}</pre>
            </div>
        </div>
    );
}
