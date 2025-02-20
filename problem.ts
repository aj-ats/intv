import { Router } from 'express';
import { ProblemResponse } from './interfaces/responseSchema';
import { authenticate } from './Auth';

const router = Router();

const operators: string[] = ['+', '-', '/', '*'];
const stringOperands: string[] = ['Dog', 'Narwhal', 'Turtle', 'Axolotl', 'Capybara', 'Sifaka', 'Dik-dik', 'Red Panda', 'Zorilla', 'Kinkajou'] as const;

// ... (keep your existing isPrime function and other helper functions)
function isPrime(number: number) {
  const checkPrime = (nr:  number, limit: number) => {
    for (let start = 3; start <= limit; start += 2) {
      if (0 === nr % start) {
        return false;
      }
    }

    return nr > 1;
  };

  return number === 2 || number % 2 !== 0 && checkPrime(number, Math.sqrt(number));
}
const getRandomElement = (array: string[]) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomOperand = (): string | number => 
  Math.random() < 0.5 ? getRandomElement(stringOperands) : getRandomNumber(0, 100);

/**
 * Adjusts operands for division to ensure whole number result
 * @param first - First operand (dividend)
 * @param second - Second operand (divisor)
 * @returns Adjusted operands that will result in whole number division
 */
const adjustDivisionOperands = (first: number, second: number): { first: number, second: number } => {
  // Ensure second operand (divisor) is not zero
  if (second === 0) {
    second = getRandomNumber(1, 100); // If zero, get a new non-zero number
  }

  // To ensure whole number division:
  // 1. Generate a random quotient (whole number result)
  // 2. Make firstOperand = secondOperand * quotient
  
  const quotient = getRandomNumber(1, 10); // Limit quotient to reasonable range
  first = second * quotient;

  // Ensure first operand is within reasonable bounds (0-100)
  if (first > 100) {
    // If first operand exceeds 100, adjust second operand instead
    second = getRandomNumber(1, Math.min(50, first)); // Limit second operand
    first = second * quotient;
  }

  return { first, second };
};

router.get('/', authenticate, (req, res) => {
  let problem: ProblemResponse = {
    firstOperand: getRandomOperand(),
    secondOperand: getRandomOperand(),
    operator: getRandomElement(operators),
  };

  // If operands are numbers and operator is division
  if (
    problem.operator === '/' && 
    typeof problem.firstOperand === 'number' && 
    typeof problem.secondOperand === 'number'
  ) {
    // Adjust operands to ensure whole number division
    const adjusted = adjustDivisionOperands(
      problem.firstOperand,
      problem.secondOperand
    );
    problem.firstOperand = adjusted.first;
    problem.secondOperand = adjusted.second;
  }

 // if operation is subtraction on 2 numbers where result will be negitive , flip that shit 
  if (
    problem.operator === '-' &&
    typeof problem.firstOperand === 'number' && 
    typeof problem.secondOperand === 'number' &&
    problem.secondOperand > problem.firstOperand
  ) {
    problem.firstOperand = problem.secondOperand
    problem.secondOperand = problem.firstOperand
  }
  res.json(problem);
  
});

export default router;
