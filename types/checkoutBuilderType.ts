const CheckoutLayoutType = {
  ONE_COLUMN: "ONE_COLUMN",
  TWO_COLUMN: "TWO_COLUMN",
} as const;

export type CheckoutLayoutType =
  (typeof CheckoutLayoutType)[keyof typeof CheckoutLayoutType];

export type CheckoutLayout = {
  layout: CheckoutLayoutType;
};
