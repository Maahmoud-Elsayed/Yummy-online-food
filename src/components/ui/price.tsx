import React from "react";

type PriceProps = {
  price: number | string;
  currency?: "USD" | "EUR" | "GBP" | "EGP";
}

const Price = ({ price, currency = "USD" }: PriceProps) => {
  // Convert price to number if it's a string
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  // Extract whole and fractional parts of the price
  const [wholePart, fractionalPart] = numericPrice.toFixed(2).split(".");

  return (
    <div className=" flex ">
      {/* Integer part */}
      <span className="align-top text-xs font-medium text-muted-foreground">
        {currency === "USD" ? "$" : currency}
      </span>
      <span className=" text-3xl font-medium text-foreground">
        {wholePart}
      </span>
      {/* Decimal part */}
      <span className="align-top text-xs font-medium text-muted-foreground">
        {fractionalPart}
      </span>
      {/* Currency symbol */}
    </div>
  );
};

export default Price;
