// tests/panelList.test.tsx
import { describe, it, expect } from "vitest";
import { panelList } from "../panelList"; // adjust path accordingly
import React from "react";

describe("panelList", () => {
  it("contains 3 panels with correct keys and titles", () => {
    expect(panelList).toHaveLength(3);

    expect(panelList[0]).toMatchObject({
      key: "fruitbook",
      title: "Fruit Book",
    });
    expect(panelList[1]).toMatchObject({
      key: "fruitview",
      title: "Fruit View",
    });
    expect(panelList[2]).toMatchObject({ key: "about", title: "About" });

    panelList.forEach((panel) => {
      expect(React.isValidElement(panel.content)).toBe(true);
    });
  });
});
