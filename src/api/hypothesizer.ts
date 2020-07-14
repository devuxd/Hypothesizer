import { analyzeCode } from "./codeAnalyzer";
import { getSourceCodeFiles } from "./devtools";
import { hypotheses } from "./tempDatabase";
var keyword_extractor = require("keyword-extractor");


const getRelevantAndRankedHypotheses = async (description: String, runTimeMethodsCoverage: any) => {
    try {
        const files: any[] = await getSourceCodeFiles();
        const coverageAST = await analyzeCode(runTimeMethodsCoverage, files);
        const hypothesesRanked = await RankHypotheses(description, coverageAST);
        return hypothesesRanked;
    } catch (error) {
        console.error(error);
    }
}

const RankHypotheses = async (description: any, coverageAST: any) => {
    const tags = getKeywords(description);
    let candidateHypotheses: any[] = hypotheses.filter(hypothesis => hypothesis.tags.some((tag: any) => tags.includes(tag)))

    for (var entry of coverageAST) {
        returnObj.set(entry, 0);
        switch (entry.verification) {
            case 0:
                var confidence = 0;
                for (var ast of asts) {
                    estree.walk(ast.tree, {
                        enter: (node: any, parent: any, prop: any, index: any) => {
                            if (node.type === "JSXAttribute") {
                                if (node.name.type === "JSXIdentifier") {
                                    if (node.name.name === "onSubmit" || node.name.name === "onClick") {
                                        if (node.value.expression.type === "CallExpression") {
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
    return candidateHypotheses;
}

const getKeywords = (sentence: any) => {
    var extraction_result: [] = keyword_extractor.extract(sentence, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true
    })
    return extraction_result
}
export { getRelevantAndRankedHypotheses as getRelevantAndRankedHypotheses }