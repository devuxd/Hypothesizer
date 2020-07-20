import { analyzeCode } from "./codeAnalyzer";
import { getSourceCodeFiles } from "./devtools";
import { hypotheses, hypothesis } from "./tempDatabase";
import get from 'lodash/get'
const keyword_extractor = require("keyword-extractor");


/**
 *  return an array of objects according to key, value, or key and value matching
 * @param obj 
 * @param key 
 * @param val 
 */
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


/**
 *  giving a general description of the defect behavior and a runtime trace of the reproducing steps, hypothesizer returns a ranked lis
 * of  relevant hypotheses 
 * @param description String
 * @param runTimeMethodsCoverage any[]
 */
const getRelevantAndRankedHypotheses = async (description: String, runTimeMethodsCoverage: any[]) => {
    try {
        const files: any[] = await getSourceCodeFiles();
        const astWithTrace = await analyzeCode(runTimeMethodsCoverage, files);
        const hypothesesRanked = await RankHypotheses(description, astWithTrace[0]);
        return [hypothesesRanked, astWithTrace[1]];
    } catch (error) {
        console.error(error);
    }
}

/**
 *  givin a defect behavior and all ASTs of the runtime execution, return hypotheses that match the defect description and rank them base on the runtime execution.
 * @param description 
 * @param coverageAST 
 */

const RankHypotheses = async (description: String, coverageAST: any) => {
    const tags: String[] = getKeywords(description);
    const candidateHypotheses: hypothesis[] = hypotheses.filter(hypothesis => hypothesis.tags.some((tag: String) => tags.includes(tag)));
    const returnedHypotheses: any = [];
    for (const candidateHypothesis of candidateHypotheses) {
        let confidence = 0
        for (const ast of coverageAST) {
            Object.getOwnPropertyNames(candidateHypothesis.codeBlocks).forEach(key => {

                for (const { expressionRootId, subExpression } of candidateHypothesis.codeBlocks[key]) {
                    const relevantSubTrees = getSubTree(ast.node, '', expressionRootId).flat();
                    if (relevantSubTrees.length === 0) continue;
                    let isFound = matchAST(relevantSubTrees, subExpression);
                    if (isFound === "full" && key === "incorrect") {
                        confidence += 2;
                        break;
                    }
                    if (isFound === "partial" && key === "correct") {
                        confidence++;
                        break;
                    }
                }
            });

        }
        returnedHypotheses.push({ ...candidateHypothesis, confidence })
        console.log(returnedHypotheses)
        return returnedHypotheses;
    }
}

/**
 *  giving a description of a defect, return a set of unique keywords of the description.
 * @param sentence 
 */
const getKeywords = (sentence: String): String[] => {
    const extraction_result: String[] = keyword_extractor.extract(sentence, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true
    })
    return extraction_result;
}
/**
 *  giving a part of the program AST and a hypothesis AST properties, return 'full' if all AST properties are found in the program AST. 
 * If not, return 'partial' if some properties of the hypothesis matches the program AST. Otherwise return 'none'.
 * @param relevantSubTrees 
 * @param subExpression 
 */
const matchAST = (relevantSubTrees: any, subExpression: any) => {
    let found = "none";
    for (const subtree of relevantSubTrees) {
        let countNumberOfOccurrences = 0;
        for (const { expressionName, expressionValue } of subExpression) {
            const objectValues = get(subtree, expressionName);
            // if the subExpression value is an object including array.
            if (typeof expressionValue === "object" &&
                typeof objectValues === typeof expressionValue) {
                // in case there is a nested subExpressions
                if (expressionValue.length > 0) {
                    let localCounts = 0;
                    for (const localSubExpression of expressionValue) {
                        for (const objectValue of objectValues) {
                            const localValue = get(objectValue, localSubExpression.expressionName);
                            if (localValue === localSubExpression.expressionValue) {
                                localCounts++;
                            }
                        }


                    }
                    if (localCounts === expressionValue.length) {
                        countNumberOfOccurrences++;
                    }

                }
                // if there is no nested object and we only care about comparing the type of the object
                else if (expressionValue.length === 0) {
                    {
                        countNumberOfOccurrences++;
                    }

                }
            }
            else {
                // if the sub expression value is a string, primitive or undefined
                if (objectValues === expressionValue) {
                    countNumberOfOccurrences++;
                }
            }
        }
        // All the sub expression of a hypothesis occurred in the program AST
        if (countNumberOfOccurrences === subExpression.length) {
            found = "full";
            break;
        }
        // part of the sub expression occurred in the program AST
        if (countNumberOfOccurrences < subExpression.length && countNumberOfOccurrences != 0) {
            found = "partial";
        }
    }
    return found;
}

export { getRelevantAndRankedHypotheses, getKeywords }
