import * as acorn from "acorn";
import * as estree from "estree-walker";
import { data } from "./tempDatabase";
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
                        var filename = ast.file.substring(ast.file.lastIndexOf("/") + 1, ast.file.lastIndexOf(".js"));
                        coverage.push(`${node.id.name} inside ${filename} got executed.`);
                    }
                }
                // look for arrow functions
                if (node.type === "VariableDeclaration") {
                    for (var dec of node.declarations) {
                        if (methods.includes(dec.id.name)) {
                            if (dec.init.type == "ArrowFunctionExpression") {
                                var filename = ast.file.substring(ast.file.lastIndexOf("/") + 1, ast.file.lastIndexOf(".js"));
                                coverage.push(`${dec.id.name} inside ${filename} got executed.`);
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

const useTags = async (tags:any, files:any) => {
    var temp:any = data;
    var entriesToCheck = [];
    for(var entry of temp) {
        for(var tag of entry.tags) {
            if(tags.includes(tag)) {
                entriesToCheck.push(entry);
            }
        }
    }
    var asts:any = await constructAST(files);
    var returnObj = new Map();

    for(var entry of entriesToCheck) {
        returnObj.set(entry, 0);
        switch(entry.verification) {
            case 0:
                var confidence = 0;
                for(var ast of asts) {
                    estree.walk(ast.tree, {
                        enter: (node: any, parent: any, prop: any, index: any) => {
                            if (node.type === "JSXAttribute") {
                                if (node.name.type === "JSXIdentifier") {
                                    if (node.name.name === "onSubmit" || node.name.name === "onClick") {
                                        if(node.value.expression.type === "CallExpression") {
                                           confidence = 100;
                                        } 
                                    }
                                }
                            }
                        },
                        leave: (node, parent, prop, index) => { }
                    })
                }
                returnObj.set(entry, confidence);
                break
            case 1:
                // nothing necessary, temporary demo
                break
            case 2:
                // nothing necessary, temporary demo
                break
            default:
                break
        }
    }
    return returnObj;
}

export { analyzeCode, constructAST, useTags }