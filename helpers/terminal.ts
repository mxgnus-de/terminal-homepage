export function isAlphanumeric(char: string): boolean {
   return /^[a-zA-Z0-9]$/.test(char);
}

export function isSpace(char: string): boolean {
   return /^\s$/.test(char);
}

export function isSpecialChar(char: string): boolean {
   return /^[^a-zA-Z0-9]$/.test(char);
}

export function isValidInput(input: string): boolean {
   return isAlphanumeric(input) || isSpecialChar(input) || isSpace(input);
}
