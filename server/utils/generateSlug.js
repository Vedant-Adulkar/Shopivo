/**
 * Generate URL-friendly slug from text without using regex
 * Uses character-by-character sanitization for security and performance
 * 
 * @param {string} name - The text to convert to a slug
 * @returns {string} - URL-friendly slug
 * 
 * @example
 * generateSlug("Hello World!") // "hello-world"
 * generateSlug("Product Name 123") // "product-name-123"
 * generateSlug("Special@#$Characters") // "specialcharacters"
 */
const generateSlug = (name) => {
    if (!name || typeof name !== 'string') {
        return '';
    }

    name = name.toLowerCase().trim();

    let slug = "";
    let prevDash = false;

    for (const char of name) {
        const isLetter = char >= "a" && char <= "z";
        const isNumber = char >= "0" && char <= "9";

        if (isLetter || isNumber) {
            slug += char;
            prevDash = false;
        }
        else if (char === " " || char === "_" || char === "-") {
            if (!prevDash) {
                slug += "-";
                prevDash = true;
            }
        }
        // Ignore all other special characters
    }

    // Remove trailing hyphen without regex
    if (slug.endsWith("-")) {
        slug = slug.slice(0, -1);
    }

    return slug;
};

module.exports = generateSlug;
