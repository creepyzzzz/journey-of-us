import { nanoid } from "nanoid";

export const generateSlug = (length: number = 8): string => {
  return nanoid(length);
};

export const generateLoveCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateShareableURL = (slug: string, baseURL?: string): string => {
  const base = baseURL || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/play/${slug}`;
};

export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
};

export const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = normalizeString(str1);
  const s2 = normalizeString(str2);

  if (s1 === s2) return 1;

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

export const validateAnswer = (
  userAnswer: string,
  correctAnswer: string,
  threshold: number = 0.8
): boolean => {
  const similarity = calculateSimilarity(userAnswer, correctAnswer);
  return similarity >= threshold;
};
