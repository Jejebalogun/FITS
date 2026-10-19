import type { MarketCode } from "@/data/markets";

// Rules for Screens 7 and 10: what a delivery address and a card must look
// like before we ask a courier or a bank to accept them. Copy says what to fix,
// not only that something is wrong.

export type Address = {
  id: string;
  /** "Home", "Work" — how the saved list names it. */
  label: string;
  name: string;
  phone: string;
  country: MarketCode;
  postcode: string;
  street: string;
  /** Flat, floor or building. */
  flat: string;
  town: string;
  isDefault: boolean;
};

export type AddressDraft = Omit<Address, "id" | "isDefault" | "label"> & { label: string };

/** "14 Elm Grove, London SE15 5DE" */
export function addressLine(address: Pick<Address, "flat" | "street" | "town" | "postcode">) {
  const first = [address.flat, address.street].filter(Boolean).join(", ");
  return `${first}, ${address.town}${address.postcode ? ` ${address.postcode}` : ""}`;
}

// --- Postcodes ---------------------------------------------------------------

type PostcodeRule = {
  label: string;
  required: boolean;
  pattern?: RegExp;
  example?: string;
  /** Shown when the format is wrong, e.g. a missing letter. */
  hint?: string;
};

export const postcodeRules: Record<MarketCode, PostcodeRule> = {
  GB: {
    label: "Postcode",
    required: true,
    pattern: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
    example: "SE15 4RQ",
    hint: "UK postcodes look like SE15 4RQ — check for a missing letter.",
  },
  US: {
    label: "ZIP code",
    required: true,
    pattern: /^\d{5}(-\d{4})?$/,
    example: "10001",
    hint: "ZIP codes are five digits, like 10001.",
  },
  CA: {
    label: "Postal code",
    required: true,
    pattern: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i,
    example: "M5V 2T6",
    hint: "Canadian postal codes look like M5V 2T6.",
  },
  // Many Nigerian and Ghanaian addresses have no postcode; couriers go by area.
  NG: { label: "Postcode", required: false },
  GH: { label: "Digital address", required: false, example: "GA-123-4567" },
};

/** Puts the space back in a UK postcode typed without one. */
export function tidyPostcode(value: string, country: MarketCode) {
  const trimmed = value.trim().toUpperCase();
  if (country === "GB" && !trimmed.includes(" ") && trimmed.length > 4) {
    return `${trimmed.slice(0, -3)} ${trimmed.slice(-3)}`;
  }
  return trimmed;
}

/** Stand-in for a postcode lookup service, for the few postcodes the mocks use. */
const KNOWN_STREETS: Record<string, { street: string; flat?: string; town: string }[]> = {
  "SE15 4RQ": [
    { street: "22 Choumert Road", town: "London" },
    { street: "24 Choumert Road", town: "London" },
    { flat: "Flat 1", street: "26 Choumert Road", town: "London" },
  ],
  "SE15 5DE": [
    { street: "12 Elm Grove", town: "London" },
    { street: "14 Elm Grove", town: "London" },
    { street: "16 Elm Grove", town: "London" },
  ],
  "EC1V 9AB": [
    { flat: "2nd floor", street: "30 Old Street", town: "London" },
    { flat: "3rd floor", street: "30 Old Street", town: "London" },
  ],
};

export function lookupPostcode(postcode: string) {
  return KNOWN_STREETS[tidyPostcode(postcode, "GB")] ?? [];
}

export type AddressErrors = Partial<Record<keyof AddressDraft | "email", string>>;

export function validateAddress(draft: AddressDraft, email?: string): AddressErrors {
  const errors: AddressErrors = {};
  const rule = postcodeRules[draft.country];

  if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
    errors.email = "Add the email you want the receipt and tracking sent to.";
  }
  if (draft.name.trim().split(/\s+/).length < 2) {
    errors.name = "Add your full name, as the courier will ask for it.";
  }
  if (draft.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Add a phone number the courier can call or text.";
  }
  const postcode = draft.postcode.trim();
  if (rule.required && !postcode) {
    errors.postcode = `Add your ${rule.label.toLowerCase()}.`;
  } else if (postcode && rule.pattern && !rule.pattern.test(postcode)) {
    errors.postcode = `We can't find that ${rule.label.toLowerCase()}. ${rule.hint ?? ""}`.trim();
  }
  if (!draft.street.trim()) errors.street = "Add the house number and street.";
  if (!draft.town.trim()) errors.town = "Add the town or city.";
  return errors;
}

// --- Cards ---------------------------------------------------------------------

export type CardBrand = "visa" | "mastercard" | "amex" | "verve" | null;

export function cardBrand(digits: string): CardBrand {
  if (/^3[47]/.test(digits)) return "amex";
  if (/^(506[01]|507[89]|6500)/.test(digits)) return "verve";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  if (/^4/.test(digits)) return "visa";
  return null;
}

function cardLength(brand: CardBrand) {
  if (brand === "amex") return 15;
  if (brand === "verve") return 19;
  return 16;
}

function luhn(digits: string) {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

/** "4921 8832 1190 4417", or Amex's 4–6–5. */
export function formatCardNumber(digits: string) {
  if (cardBrand(digits) === "amex") {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)]
      .filter(Boolean)
      .join(" ");
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export type CardDraft = { number: string; expiry: string; cvc: string; name: string };
export type CardErrors = Partial<Record<keyof CardDraft, string>>;

export function validateCard(card: CardDraft, today: Date): CardErrors {
  const errors: CardErrors = {};
  const digits = card.number.replace(/\D/g, "");
  const brand = cardBrand(digits);
  const length = cardLength(brand);

  if (!digits) {
    errors.number = "Add the long number on the front of your card.";
  } else if (digits.length === length - 1) {
    errors.number = "This card number is one digit short. Check it against your card.";
  } else if (digits.length < length) {
    errors.number = `This card number is ${length - digits.length} digits short. Check it against your card.`;
  } else if (!luhn(digits)) {
    errors.number = "One of these digits is off. Check the number against your card.";
  }

  const [mm, yy] = card.expiry.split("/").map((part) => part.trim());
  const month = Number(mm);
  const year = 2000 + Number(yy);
  if (!mm || !yy || yy.length !== 2 || month < 1 || month > 12) {
    errors.expiry = "Add the expiry as MM / YY.";
  } else if (
    year < today.getFullYear() ||
    (year === today.getFullYear() && month < today.getMonth() + 1)
  ) {
    errors.expiry = "This card has expired.";
  }

  const cvcLength = brand === "amex" ? 4 : 3;
  if (card.cvc.length !== cvcLength) {
    errors.cvc = `The ${cvcLength}-digit code on the ${brand === "amex" ? "front" : "back"}.`;
  }
  if (card.name.trim().length < 2) errors.name = "The name as it is printed on the card.";
  return errors;
}

/** Typing "0828" becomes "08 / 28". */
export function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
}

// --- Mock payment gateway ------------------------------------------------------

/**
 * How the stand-in gateway answers. The decline number is Stripe's own test
 * card, so the same number keeps working once the real gateway is wired in.
 */
export const DECLINE_CARD = "4000000000000002";

export type CardOutcome = "declined" | "approve-in-app";

export function cardOutcome(digits: string): CardOutcome {
  return digits === DECLINE_CARD ? "declined" : "approve-in-app";
}

export function newOrderId() {
  return `FT-${Math.floor(10000 + Math.random() * 90000)}`;
}

/** A virtual account number for one bank transfer, stable for the order. */
export function transferAccount(orderId: string) {
  const seed = Number(orderId.replace(/\D/g, "")) || 20418;
  const digits = String((seed * 7919 + 7281044913) % 10_000_000_000).padStart(10, "0");
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

/** The USSD string a Paystack transfer gives for an amount. */
export function ussdCode(amount: number) {
  return `*737*000*${Math.round(amount)}#`;
}
