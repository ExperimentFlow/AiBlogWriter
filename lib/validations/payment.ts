import { z } from 'zod';

// Shared currency enum for payment settings
export const supportedCurrencies = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'SGD', 'HKD', 'CHF', 'SEK', 'NOK', 'DKK',
  'PLN', 'CZK', 'HUF', 'BRL', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU', 'KRW', 'TWD', 'THB',
  'MYR', 'IDR', 'PHP', 'VND', 'TRY', 'ILS', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD',
  'EGP', 'ZAR', 'NGN', 'KES', 'GHS', 'UGX', 'TZS', 'RUB', 'UAH', 'BYN', 'KZT', 'UZS', 'GEL',
  'AMD', 'AZN', 'MDL', 'RON', 'BGN', 'HRK', 'RSD', 'BAM', 'ALL', 'MKD', 'MNT', 'KHR', 'LAK',
  'MMK', 'BDT', 'LKR', 'NPR', 'PKR', 'AFN', 'IRR', 'IQD', 'LYD', 'TND', 'MAD', 'DZD', 'XOF',
  'XAF', 'XPF', 'NZD', 'FJD', 'PGK', 'SBD', 'TOP', 'VUV', 'WST', 'KID', 'XCD', 'BBD', 'BMD',
  'KYD', 'JMD', 'TTD', 'BZD', 'GYD', 'SRD', 'HTG', 'DOP', 'CUP', 'NIO', 'HNL', 'GTQ', 'BWP',
  'NAD', 'LSL', 'SZL', 'MUR', 'SCR', 'MVR', 'BTN', 'MOP', 'BND', 'KGS', 'TJS', 'TMT'
] as const;

// Payment settings validation schema
export const paymentSettingsSchema = z.object({
  publicKey: z.string()
    .min(1, 'Public key is required')
    .regex(/^pk_test_|^pk_live_/, 'Public key must start with pk_test_ or pk_live_'),
  secretKey: z.string()
    .min(1, 'Secret key is required')
    .regex(/^sk_test_|^sk_live_/, 'Secret key must start with sk_test_ or sk_live_'),
  currency: z.enum(supportedCurrencies),
});

// Type inference from the schema
export type PaymentSettings = z.infer<typeof paymentSettingsSchema>;

// Currency data for UI display
export const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br' },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸' },
  { code: 'UZS', name: 'Uzbekistani Som', symbol: "so'm" },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾' },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼' },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
  { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn' },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин.' },
  { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark', symbol: 'KM' },
  { code: 'ALL', name: 'Albanian Lek', symbol: 'L' },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден' },
  { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮' },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
  { code: 'LAK', name: 'Lao Kip', symbol: '₭' },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: '₨' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
  { code: 'AFN', name: 'Afghan Afghani', symbol: '؋' },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼' },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د' },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'ل.د' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA' },
  { code: 'XPF', name: 'CFP Franc', symbol: '₣' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$' },
  { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K' },
  { code: 'SBD', name: 'Solomon Islands Dollar', symbol: 'SI$' },
  { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$' },
  { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'VT' },
  { code: 'WST', name: 'Samoan Tālā', symbol: 'T' },
  { code: 'KID', name: 'Kiribati Dollar', symbol: '$' },
  { code: 'XCD', name: 'East Caribbean Dollar', symbol: 'EC$' },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: 'Bds$' },
  { code: 'BMD', name: 'Bermudian Dollar', symbol: 'BD$' },
  { code: 'KYD', name: 'Cayman Islands Dollar', symbol: 'CI$' },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$' },
  { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: 'TT$' },
  { code: 'BZD', name: 'Belize Dollar', symbol: 'BZ$' },
  { code: 'GYD', name: 'Guyanese Dollar', symbol: 'G$' },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: '$' },
  { code: 'HTG', name: 'Haitian Gourde', symbol: 'G' },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$' },
  { code: 'CUP', name: 'Cuban Peso', symbol: '$' },
  { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'C$' },
  { code: 'HNL', name: 'Honduran Lempira', symbol: 'L' },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q' },
  { code: 'BWP', name: 'Botswana Pula', symbol: 'P' },
  { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$' },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L' },
  { code: 'SZL', name: 'Eswatini Lilangeni', symbol: 'L' },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨' },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨' },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf' },
  { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu.' },
  { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP$' },
  { code: 'BND', name: 'Brunei Dollar', symbol: 'B$' },
  { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'с' },
  { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'ЅM' },
  { code: 'TMT', name: 'Turkmenistan Manat', symbol: 'T' },
] as const;

// Helper function to get currency symbol
export const getCurrencySymbol = (code: string): string => {
  return currencies.find(c => c.code === code)?.symbol || code;
};

// Helper function to get currency by code
export const getCurrencyByCode = (code: string) => {
  return currencies.find(c => c.code === code);
}; 