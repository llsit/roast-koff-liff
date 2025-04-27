import React from "react";
import { MenuItem } from "./MenuList";

type CartProps = {
  cartItems: MenuItem[];
};

export default function Cart({ cartItems }: CartProps) {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">รายการที่เลือก</h2>
      {cartItems.length === 0 ? (
        <p>ยังไม่ได้เลือกรายการ</p>
      ) : (
        <ul className="list-disc pl-5">
          {cartItems.map((item, idx) => (
            <li key={idx}>
              {item.name} ({item.englishName})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
