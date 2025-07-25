import React, { useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import FruitEnrichmentPanel from "./FruitEnrichmentPanel";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const FRUITS = [
  {
    id: "F001",
    name: "Banana",
    country: "Ecuador",
    type: "Tropical",
    status: "Available",
    details: "Organic, Fair Trade",
  },
  {
    id: "F002",
    name: "Apple",
    country: "Spain",
    type: "Temperate",
    status: "Available",
    details: "Fuji, Premium",
  },
  {
    id: "F003",
    name: "Orange",
    country: "Morocco",
    type: "Citrus",
    status: "Low Stock",
    details: "Navel, Sweet",
  },
  {
    id: "F004",
    name: "Kiwi",
    country: "New Zealand",
    type: "Berry",
    status: "Available",
    details: "Green, Large",
  },
  {
    id: "F005",
    name: "Mango",
    country: "Peru",
    type: "Tropical",
    status: "Pending",
    details: "Kent, Air Freight",
  },
  {
    id: "F006",
    name: "Pineapple",
    country: "Costa Rica",
    type: "Tropical",
    status: "Available",
    details: "Extra Sweet",
  },
  {
    id: "F007",
    name: "Grape",
    country: "Italy",
    type: "Berry",
    status: "Available",
    details: "Red Globe",
  },
  {
    id: "F008",
    name: "Pear",
    country: "Argentina",
    type: "Temperate",
    status: "Available",
    details: "Williams, Fresh",
  },
  {
    id: "F009",
    name: "Lime",
    country: "Mexico",
    type: "Citrus",
    status: "Low Stock",
    details: "Seedless",
  },
  {
    id: "F010",
    name: "Papaya",
    country: "Brazil",
    type: "Tropical",
    status: "Available",
    details: "Formosa",
  },
];

const getStatusCellStyle = (status: string) => ({
  color:
    status === "Available"
      ? "#7c5fe6"
      : status === "Pending"
      ? "#ffb300"
      : "#e57373",
  fontWeight: 700,
  fontFamily: "monospace",
  fontSize: 16,
  background: "var(--panel-background-color)",
});

const panelStyles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
    background: "var(--panel-background-color)",
  },
  header: {
    fontFamily: "monospace",
    fontWeight: 700,
    fontSize: 22,
    color: "var(--text-color)",
    background: "var(--panel-background-color)",
    padding: "16px 24px 10px",
    borderBottom: "1px solid #353b4a",
    letterSpacing: 1,
  },
  gridContainer: {
    flexGrow: 1,
    minHeight: 0,
  },
  agGrid: {
    height: "100%",
    width: "100%",
    border: "1px solid #7c5fe6",
    background: "var(--panel-background-color)",
  },
};

const FruitBook: React.FC = () => {
  const [selectedFruit, setSelectedFruit] = useState<any | null>(null);
  const gridRef = useRef<any>(null);

  const fruits = useMemo(() => FRUITS, []);

  const columns = useMemo<ColDef[]>(
    () => [
      { headerName: "ID", field: "id", minWidth: 90 },
      { headerName: "Fruit", field: "name", minWidth: 120 },
      { headerName: "Country", field: "country", minWidth: 120 },
      { headerName: "Type", field: "type", minWidth: 120 },
      {
        headerName: "Status",
        field: "status",
        minWidth: 120,
        cellStyle: ({ value }) => getStatusCellStyle(value),
      },
      { headerName: "Details", field: "details", minWidth: 180 },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      resizable: true,
    }),
    []
  );

  const handleRowDoubleClick = (event: any) => {
    setSelectedFruit(event.data);
  };

  const handleSelectionChange = () => {
    const selectedNode = gridRef.current?.api.getSelectedNodes()?.[0];
    if (selectedNode) {
      setSelectedFruit(selectedNode.data);
    }
  };

  const getRowStyle = ({
    data,
    rowIndex,
  }: {
    data: any;
    rowIndex: number;
  }) => ({
    fontFamily: "monospace",
    fontSize: 16,
    color: "var(--text-color)",
    background:
      selectedFruit?.id === data.id
        ? "var(--row-selected-background-color)"
        : rowIndex % 2 === 0
        ? "var(--panel-background-color)"
        : "var(--row-background-color-odd)",
  });

  return (
    <>
      <div style={panelStyles.container}>
        <header style={panelStyles.header}>Fruit Book</header>
        <div style={panelStyles.gridContainer}>
          <div className="ag-theme-alpine" style={panelStyles.agGrid}>
            <AgGridReact
              ref={gridRef}
              rowData={fruits}
              columnDefs={columns}
              defaultColDef={defaultColDef}
              rowSelection="single"
              pagination={true}
              paginationPageSize={50}
              cacheBlockSize={100}
              headerHeight={38}
              rowHeight={38}
              suppressCellFocus
              animateRows={true}
              enableCellTextSelection={true}
              suppressRowHoverHighlight={true}
              getRowStyle={getRowStyle}
              onRowDoubleClicked={handleRowDoubleClick}
              onSelectionChanged={handleSelectionChange}
            />
          </div>
        </div>
      </div>
      {selectedFruit &&
        ReactDOM.createPortal(
          <FruitEnrichmentPanel
            fruit={selectedFruit}
            onClose={() => setSelectedFruit(null)}
          />,
          document.body
        )}
    </>
  );
};

export default FruitBook;
