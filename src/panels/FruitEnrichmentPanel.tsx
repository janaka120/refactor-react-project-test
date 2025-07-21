import React, { useState, useMemo } from "react";
import ResizableDraggablePanel from "../components/ResizableDraggablePanel";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const gridStyle: React.CSSProperties = {
  background: "#20263a",
  border: "1.5px solid #2e3650",
  borderRadius: 10,
  padding: "18px 24px",
  fontFamily: "monospace",
  color: "#e0e6f5",
  fontSize: 15,
  minWidth: 260,
  minHeight: 120,
  boxShadow: "0 2px 8px #0004",
  margin: 0,
};

/**
 * Props for FruitEnrichmentPanel.
 */
interface FruitEnrichmentPanelProps {
  fruit: any;
  onClose: () => void;
}

/**
 * Displays enrichment details for a fruit in a draggable, resizable panel.
 * @param fruit The fruit object to display details for.
 * @param onClose Callback to close the panel.
 */
const FruitEnrichmentPanel: React.FC<FruitEnrichmentPanelProps> = ({
  fruit,
  onClose,
}) => {
  const [panelState, setPanelState] = useState({
    x: 200,
    y: 120,
    width: 400,
    height: 220,
  });

  /**
   * Column definitions for the AG Grid.
   */
  const columnDefs: ColDef<{ property: string; value: any }>[] = [
    {
      headerName: "Property",
      field: "property",
      flex: 1,
      cellStyle: {
        fontWeight: 700,
        color: "var(--text-color)",
        fontFamily: "inherit",
      },
    },
    {
      headerName: "Value",
      field: "value",
      flex: 2,
      cellStyle: {
        color: "var(--text-color)",
        fontFamily: "inherit",
      },
    },
  ];

  /**
   * Memoized row data for the grid.
   */
  const rowData = useMemo(
    () => [
      { property: "ID", value: fruit.id },
      { property: "Country", value: fruit.country },
      { property: "Type", value: fruit.type },
      { property: "Status", value: fruit.status },
      { property: "Details", value: fruit.details },
    ],
    [fruit]
  );

  /**
   * Handles moving the panel.
   * @param dx Delta X
   * @param dy Delta Y
   */
  const handleMove = (dx: number, dy: number) => {
    setPanelState((prev) => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };

  /**
   * Handles resizing the panel.
   * @param dw Delta width
   * @param dh Delta height
   */
  const handleResize = (dw: number, dh: number) => {
    setPanelState((prev) => ({
      ...prev,
      width: Math.max(320, prev.width + dw),
      height: Math.max(160, prev.height + dh),
    }));
  };

  return (
    <ResizableDraggablePanel
      id={`fruit-enrichment-${fruit.id}`}
      title={`${fruit.name} Enrichment`}
      x={panelState.x}
      y={panelState.y}
      width={panelState.width}
      height={panelState.height}
      minWidth={320}
      minHeight={160}
      onClose={onClose}
      onMove={handleMove}
      onResize={handleResize}
    >
      <div
        className="ag-theme-alpine"
        style={{ height: panelState.height - 40 }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          domLayout="autoHeight"
          headerHeight={32}
          rowHeight={32}
          suppressCellFocus
          suppressMovableColumns
          suppressMenuHide
        />
      </div>
    </ResizableDraggablePanel>
  );
};

export default FruitEnrichmentPanel;
