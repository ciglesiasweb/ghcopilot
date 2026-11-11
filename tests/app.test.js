import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const appScript = readFileSync(
  new URL("../script.js", import.meta.url),
  "utf8",
);
const storageKey = "bucks2bar.monthly-values.v1";
let dom;

function loadApp({ savedData, chartAvailable = true } = {}) {
  dom = new JSDOM(html, {
    runScripts: "outside-only",
    url: "http://localhost",
  });
  const { window } = dom;
  window.chartInstances = [];

  if (chartAvailable) {
    window.Chart = class {
      constructor(canvas, config) {
        this.canvas = canvas;
        this.data = config.data;
        this.update = vi.fn();
        this.resize = vi.fn();
        window.chartInstances.push(this);
      }
    };
  }

  if (savedData !== undefined)
    window.localStorage.setItem(storageKey, savedData);
  window.eval(appScript);
  return window;
}

function enterAmount(window, id, amount) {
  const input = window.document.getElementById(id);
  input.value = amount;
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
  return input;
}

afterEach(() => {
  dom?.window.close();
});

describe("Bucks2Bar", () => {
  it("renders all months with accessible income and expense inputs", () => {
    const window = loadApp();

    expect(window.document.querySelectorAll("#month-rows tr")).toHaveLength(12);
    expect(
      window.document
        .getElementById("january-income")
        .getAttribute("aria-label"),
    ).toBe("January income in US dollars");
    expect(window.document.getElementById("december-expense")).toBeTruthy();
  });

  it("saves valid values and updates chart datasets", () => {
    const window = loadApp();
    window.document.getElementById("chart-tab").click();

    enterAmount(window, "january-income", "1250.50");
    enterAmount(window, "january-expense", "425");

    const savedValues = JSON.parse(window.localStorage.getItem(storageKey));
    const chart = window.chartInstances[0];
    expect(savedValues[0]).toEqual({ income: "1250.50", expense: "425" });
    expect(chart.data.datasets[0].data[0]).toBe(1250.5);
    expect(chart.data.datasets[1].data[0]).toBe(425);
    expect(chart.update).toHaveBeenCalledTimes(3);
  });

  it("keeps invalid edits out of storage and the chart until corrected", () => {
    const window = loadApp();
    window.document.getElementById("chart-tab").click();
    enterAmount(window, "january-income", "100");

    const input = enterAmount(window, "january-expense", "12.345");

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.validationMessage).toContain("up to two decimal places");
    expect(window.chartInstances[0].data.datasets[1].data[0]).toBe(0);
    expect(JSON.parse(window.localStorage.getItem(storageKey))[0].expense).toBe(
      "",
    );

    enterAmount(window, "january-expense", "12.34");
    expect(input.getAttribute("aria-invalid")).toBe("false");
    expect(window.chartInstances[0].data.datasets[1].data[0]).toBe(12.34);
  });

  it("supports arrow-key tab navigation and initializes the chart once", () => {
    const window = loadApp();
    const dataTab = window.document.getElementById("data-tab");
    const chartTab = window.document.getElementById("chart-tab");
    const event = new window.KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
      cancelable: true,
    });

    dataTab.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(chartTab.getAttribute("aria-selected")).toBe("true");
    expect(window.document.getElementById("chart-panel").hidden).toBe(false);
    expect(window.document.activeElement).toBe(chartTab);
    expect(window.chartInstances).toHaveLength(1);

    chartTab.click();
    expect(window.chartInstances).toHaveLength(1);
  });

  it("does not overwrite unreadable saved data", () => {
    const unreadableData = "{invalid json";
    const window = loadApp({ savedData: unreadableData });

    enterAmount(window, "january-income", "100");

    expect(window.document.getElementById("storage-message").hidden).toBe(
      false,
    );
    expect(window.localStorage.getItem(storageKey)).toBe(unreadableData);
  });

  it("keeps data entry available when Chart.js is unavailable", () => {
    const window = loadApp({ chartAvailable: false });

    window.document.getElementById("chart-tab").click();

    expect(window.document.getElementById("download-chart").disabled).toBe(
      true,
    );
    expect(
      window.document.getElementById("chart-message").textContent,
    ).toContain("The chart could not be loaded");
    expect(window.document.getElementById("january-income")).toBeTruthy();
  });
});
