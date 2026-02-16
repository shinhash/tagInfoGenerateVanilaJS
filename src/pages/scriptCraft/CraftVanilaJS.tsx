import { useEffect, useState } from "react";
import "../../css/pages/scriptCraft/ScriptCraft.css";
import { ClipboardCopy, createHandleChange } from "../../common/utils";

const CraftVanilaJS = () => {
    const initState = {inputText: "", outputText: ""};
    const [tagInfo, setTagInfo] = useState(initState);

    // 입력 액션
    const objectChange = createHandleChange(setTagInfo);
    
    const fn_analyze = () => {
        const result = fn_parseHTML(tagInfo.inputText);
        const dom = buildDOMCode(result as any);
        setTagInfo((prev) => ({...prev, outputText: dom}));
    }

    const fn_copy = () => {
        const copyTxt = tagInfo.outputText;
        ClipboardCopy(copyTxt);
    }

    // ====================================================================================
    // HTML CODE TO VANILA JS PARSER LINE
    // ====================================================================================
    type ASTNode =
    | { type: "element"; tag: string; attributes: Record<string, string>; children: ASTNode[] }
    | { type: "text"; content: string };

    
    const booleanAttributes = new Set([
        "disabled",
        "checked",
        "readonly",
        "multiple",
        "selected",
        "autofocus",
        "required"
    ]);

    // ===========================
    // 1️⃣ HTML → AST 파서
    // ===========================
    const fn_parseHTML = (html: string): ASTNode | null => {
        const stack: ASTNode[] = [];
        let root: ASTNode | null = null;

        const tagRegex = /<\/?[^>]+>/g;
        const attrRegex = /([a-zA-Z_:][\w:.-]*)(?:="([^"]*)"|'([^']*)'|=([^\s>]+))?/g;

        let lastIndex = 0;
        let match: RegExpExecArray | null;

        const pushTextNode = (text: string, parent?: ASTNode) => {
            const trimmed = text.trim();
            if (trimmed && parent && parent.type === "element") {
                parent.children.push({ type: "text", content: trimmed });
            }
        };

        while ((match = tagRegex.exec(html)) !== null) {
            pushTextNode(html.slice(lastIndex, match.index), stack[stack.length - 1]);

            const tag = match[0];
            if (tag.startsWith("</")) {
                stack.pop();
            } else {
                const tagNameMatch = tag.match(/^<([a-zA-Z][\w-]*)/);
                if (!tagNameMatch) {
                    lastIndex = tagRegex.lastIndex;
                    continue;
                }
                const tagName = tagNameMatch[1];

                const attributes: Record<string, string> = {};
                let attrMatch: RegExpExecArray | null;
                while ((attrMatch = attrRegex.exec(tag))) {
                    const attrName = attrMatch[1];
                    const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";
                    attributes[attrName] = attrValue;
                }
                attrRegex.lastIndex = 0;

                const element: ASTNode = { type: "element", tag: tagName, attributes, children: [] };
                if (!root) root = element;

                const parent = stack[stack.length - 1];
                if (parent && parent.type === "element") parent.children.push(element);

                if (!tag.endsWith("/>")) stack.push(element); // self-closing 제외
            }
            lastIndex = tagRegex.lastIndex;
        }
        pushTextNode(html.slice(lastIndex), stack[stack.length - 1]);
        return root;
    };

    // ===========================
    // 2️⃣ AST → createElement 코드 문자열 생성
    // ===========================
    const buildDOMCode = (node: ASTNode): string => {
        let counter = 0;

        const generate = (node: ASTNode, parentVar?: string): string => {
            if (node.type === "text") {
                return parentVar
                ? `${parentVar}.appendChild(document.createTextNode(${JSON.stringify(node.content)}));\n`
                : "";
            }
            const varName = `el${counter++}`;
            let code = `const ${varName} = document.createElement("${node.tag}");\n`;
            Object.entries(node.attributes).forEach(([key, value]) => {
                const lowerKey = key.toLowerCase();

                if (lowerKey === "class") {code += `${varName}.className = ${JSON.stringify(value)};\n`;}
                else if (lowerKey.startsWith("data-")){code += `${varName}.dataset.${lowerKey.slice(5)} = ${JSON.stringify(value)};\n`;}
                else if (booleanAttributes.has(lowerKey)) {code += `${varName}.${lowerKey} = true;\n`;}
                else if (lowerKey in document.createElement(node.tag)) {code += `${varName}.${lowerKey} = ${JSON.stringify(value)};\n`;}
                else {code += `${varName}.setAttribute("${key === "className" ? "class" : key}", ${JSON.stringify(value)});\n`;}
            });
            node.children.forEach(child => (code += generate(child, varName)));
            if (parentVar) {code += `${parentVar}.appendChild(${varName});\n`;}

            return code + "\n";
        };
        return generate(node);
    };

    return (
        <>
        <div className="container">
            <div className="wrapper">
                <h1 className="title">HTML 분석기</h1>
                
                <div className="content">
                    <div className="input-group">
                        <label className="label">HTML 입력</label>
                        <textarea
                            name="inputText"
                            className="textarea textarea-input"
                            placeholder="HTML 태그를 입력하세요..."
                            value={tagInfo.inputText}
                            onChange={objectChange}
                        ></textarea>
                    </div>

                    <div className="button-container">
                        <button id="analyzeBtn" className="btn btn-primary" onClick={fn_analyze}>분석하기</button>
                    </div>

                    <div className="input-group">
                        <div className="output-header">
                            <label className="label">분석 결과</label>
                            <button id="copyBtn" className="btn-small btn-copy" onClick={fn_copy}>클립보드 복사</button>
                        </div>
                        <textarea
                            name="outputInfo"
                            className="textarea textarea-output"
                            readOnly
                            placeholder="분석 결과가 여기에 표시됩니다..."
                            value={tagInfo.outputText}
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div id="initSetTag" style={{display:"none"}}></div>
        </>
    );
};

export default CraftVanilaJS;