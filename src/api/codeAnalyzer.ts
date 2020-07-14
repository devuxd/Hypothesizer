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
const analyzeCode = async (coverage: any, files: string[]) => {
    const relevantAST: Object[] = [];
    const astList = await constructAST(files);
    debugger
    for (const ast of astList) {
        estree.walk(ast.tree, {
            enter: (node: any, parent: any, prop: any, index: any) => {
                if (node.type === "FunctionDeclaration") {
                    if (coverage.findIndex( (e:any) => e.functionName === node.id.name)) {
                        const filename = ast.file.substring(ast.file.lastIndexOf("/") + 1, ast.file.lastIndexOf(".js"));
                        relevantAST.push({node, filename});
                    }
                }
                // look for arrow functions
                if (node.type === "VariableDeclaration") {
                    for (const dec of node.declarations) {
                        if (coverage.findIndex( (e:any) => e.functionName === dec.id.name)) {
                            if (dec.init.type == "ArrowFunctionExpression") {
                                const filename = ast.file.substring(ast.file.lastIndexOf("/") + 1, ast.file.lastIndexOf(".js"));
                                relevantAST.push({node, filename});
                            }
                        }
                    }
                }
            },
            leave: (node, parent, prop, index) => { }
        })
    }

    return relevantAST;
}



export { analyzeCode, constructAST }