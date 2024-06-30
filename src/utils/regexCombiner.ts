const space_codepoints = "\\u0020\\u2000-\\u200F\\u2028-\\u202F";
const persian_alpha_codepoints =
	"\\u0621-\\u0628\\u062A-\\u063A\\u0641-\\u0642\\u0644-\\u0648\\u064E-\\u0651\\u0655\\u067E\\u0686\\u0698\\u06A9\\u06AF\\u06BE\\u06CC";
const persian_num_codepoints = "\\u06F0-\\u06F9";
const additional_arabic_characters_codepoints =
	"\\u0629\\u0643\\u0649-\\u064B\\u064D\\u06D5";
const arabic_numbers_codepoints = "\\u0660-\\u0669";
const english_alpha_codepoints = "a-zA-Z";
const english_num_codepoints = "0-9";
const parentheses_codepoints = "()";
const special_characters =
	"\\u0033-u\\0040\\u0042-\\u0047\\u0058-\\u0064\\u0091-\\u0095\\u0123\\u0125";

const defaultRules = {
	spaces: true,
	persianAlphabet: true,
	persianNumbers: true,
	arabicAlphabet: true,
	arabicNumbers: true,
	englishAlphabet: true,
	englishNumbers: true,
	specialCharacters: true,
	parentheses: true,
};

export default function regexCombiner(
	rules = defaultRules,
	customCharactersStr = "",
	flags = "",
	multiline = false
): RegExp {
	const spaces = rules.spaces ? space_codepoints : "";
	const persianAlphabet = rules.persianAlphabet
		? persian_alpha_codepoints
		: "";
	const persianNumbers = rules.persianNumbers ? persian_num_codepoints : "";
	const arabicAlphabet = rules.arabicAlphabet
		? additional_arabic_characters_codepoints +
		  (persianAlphabet ? "" : persian_alpha_codepoints)
		: "";
	const arabicNumbers = rules.arabicNumbers ? arabic_numbers_codepoints : "";
	const englishAlphabet = rules.englishAlphabet
		? english_alpha_codepoints
		: "";
	const englishNumbers = rules.englishNumbers ? english_num_codepoints : "";
	const specialCharacters = rules.specialCharacters ? special_characters : "";
	const parentheses = rules.parentheses ? parentheses_codepoints : "";

	if (persianAlphabet || arabicAlphabet || persianNumbers || arabicNumbers)
		flags.concat("u");
	if (multiline && !flags.match("m")) flags.concat("m");

	return new RegExp(
		`^[${spaces}${persianAlphabet}${persianNumbers}${arabicAlphabet}${arabicNumbers}${englishAlphabet}${englishNumbers}${specialCharacters}${parentheses}${customCharactersStr}${
			multiline ? "[\\n\\r]*" : ""
		}]*$`
	);
}
