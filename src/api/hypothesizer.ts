import { analyzeCode } from "./codeAnalyzer";
import { getSourceCodeFiles } from "./devtools";
import { hypotheses, hypothesis } from "./tempDatabase";
import get from 'lodash/get'

const keyword_extractor = require("keyword-extractor");


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

const RankHypotheses = async (description: String, coverageAST: any) => {
    const tags: String[] = getKeywords(description);
    const candidateHypotheses: hypothesis[] = hypotheses.filter(hypothesis => hypothesis.tags.some((tag: String) => tags.includes(tag)));
    const returnedHypotheses: any = [];
    for (const candidateHypothesis of candidateHypotheses) {
        let confidence = 0
        for (const ast of coverageAST) {
            for (const { expressionRootId, subExpression } of candidateHypothesis.codeBlocks.incorrect) {
                const relevantSubTrees = getSubTree(ast.node, '', expressionRootId).flat();
                for (const subtree of relevantSubTrees) {
                    let countNumberOfAccrue = 0;
                    for (const { expressionName, expressionValue } of subExpression) {
                        const objectValue = get(subtree, expressionName, undefined);
                        if (typeof expressionValue === "object" &&
                            typeof objectValue === typeof expressionValue) {
                            countNumberOfAccrue++;

                        } else {
                            if (objectValue === expressionValue) {
                                countNumberOfAccrue++;
                            }
                        }
                    }
                    if (countNumberOfAccrue === subExpression.length) {
                        confidence++;
                    }
                }
            }
        }
        returnedHypotheses.push({ ...candidateHypotheses, confidence })
    }
    console.log(returnedHypotheses)
    return returnedHypotheses;
}


const getKeywords = (sentence: String): String[] => {
    const extraction_result: String[] = keyword_extractor.extract(sentence, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true
    })
    return extraction_result;
}
//  Modified version of  https://gist.github.com/YagoLopez/1c2fe87d255fc64d5f1bf6a920b67484
const getSubTree = (obj: any, key: any, val: any): any[] => {
    let objects: any = [];
    for (const i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] === 'object') {
            objects = objects.concat(getSubTree(obj[i], key, val));
        } else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i === key && obj[i] === val || i === key && val === '') { //
                objects.push(obj);
            } else if (obj[i] === val && key === '') {
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj[i]) === -1) {
                    objects.push(obj);
                }
            }
    }
    return objects;
}

// const getValues = (obj: any, key: any): any => {
//     let objects: any[] = [];
//     for (const i in obj) {
//         if (!obj.hasOwnProperty(i)) continue;
//         if (typeof obj[i] == 'object') {
//             objects = objects.concat(getValues(obj[i], key));
//         } else if (i == key) {
//             objects.push(obj[i]);
//         }
//     }
//     return objects;
// }
export { getRelevantAndRankedHypotheses as getRelevantAndRankedHypotheses }