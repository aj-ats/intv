/**
 * @typedef {Object} ProblemResponse
 * @type {string | number} first Operand in the mathematical problem
 * @type {string | number} secibd OPerand in mathematical problem 
 * @type {string} The mathematical operator used in the problem (e.g. '+', '-', '*', '/').
 * 
 */
export interface ProblemResponse {
    firstOperand: string | number,
    secondOperand: string |  number,
    operator: string,
}
