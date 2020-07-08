import * as acorn from "acorn";
import * as estree from "estree-walker";
let jsx = require("acorn-jsx");

const constructAST = async (files: any[]) => {
    const astList: any [] = [];
    for (const file of files){
      const ast =  await new Promise((resolve, _) =>
            file.getContent((jsCode: string) => {
                const ast: any = acorn.Parser.extend(jsx()).parse(jsCode, { sourceType: "module" });
                return resolve({ tree: ast, file: file.url });
            }))
            astList.push(ast);
    }
    return astList
}
const analyzeCode = async (methods: any, files: string[]) => {
    const coverage: string[] = [];
    const astList = await constructAST(files);
    for (var ast of astList) {
        estree.walk(ast.tree, {
            enter: (node: any, parent: any, prop: any, index: any) => {
                if (node.type === "FunctionDeclaration") {
                    if (methods.includes(node.id.name)) {
                        coverage.push(`Method name ${node.id.name}, found in ${ast.file}`);
                    }
                }
                // look for arrow functions
                if (node.type === "VariableDeclaration") {
                    for (var dec of node.declarations) {
                        if (methods.includes(dec.id.name)) {
                            if (dec.init.type == "ArrowFunctionExpression") {
                                coverage.push(`Arrow function name ${dec.id.name}, found in ${ast.file}`);
                            }
                        }
                    }
                }
            },
            leave: (node, parent, prop, index) => { }
        })
    }

    return coverage;
}

export { analyzeCode }